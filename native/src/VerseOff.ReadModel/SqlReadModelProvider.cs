using System.Data;
using System.Globalization;
using System.Text;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using VerseOff.Domain;

namespace VerseOff.ReadModel;

public interface ISqlConnectionFactory
{
    SqlConnection CreateConnection();
}

public sealed class MicrosoftSqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string connectionString;

    public MicrosoftSqlConnectionFactory(string connectionString)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
        var builder = new SqlConnectionStringBuilder(connectionString);
        if (builder.Encrypt == SqlConnectionEncryptOption.Optional)
        {
            throw new ArgumentException(
                "The Microsoft SQL read-plane connection must require encryption.",
                nameof(connectionString));
        }

        if (builder.TrustServerCertificate)
        {
            throw new ArgumentException(
                "TrustServerCertificate must be false for the Microsoft SQL read plane.",
                nameof(connectionString));
        }

        this.connectionString = builder.ConnectionString;
    }

    public SqlConnection CreateConnection() => new(connectionString);
}

public sealed record SqlReadModelScope(
    Guid TenantId,
    Guid EnvironmentId,
    Guid UserObjectId,
    string SecuritySnapshotVersion);

public sealed class SqlReadModelProvider(
    ISqlConnectionFactory connectionFactory,
    SqlReadModelScope scope) : IReadModelProvider
{
    public async ValueTask<ReadRecord?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default)
    {
        ValidateScopeAndTable(scope, tableLogicalName);
        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT TableLogicalName,
                   RecordId,
                   DataJson,
                   SecuritySnapshotVersion,
                   ProjectedAt,
                   IsDeleted
            FROM dbo.VerseOffReadProjection
            WHERE TenantId = @tenantId
              AND EnvironmentId = @environmentId
              AND UserObjectId = @userObjectId
              AND SecuritySnapshotVersion = @securitySnapshotVersion
              AND TableLogicalName = @tableLogicalName
              AND RecordId = @recordId;
            """;
        AddScopeParameters(command, scope, tableLogicalName);
        command.Parameters.Add(
            new("@recordId", SqlDbType.UniqueIdentifier)
            {
                Value = recordId,
            });
        await using var reader = await command.ExecuteReaderAsync(
            CommandBehavior.SequentialAccess | CommandBehavior.SingleRow,
            cancellationToken);
        return await reader.ReadAsync(cancellationToken)
            ? ReadRecordFrom(reader)
            : null;
    }

    public async ValueTask<ReadPage> QueryAsync(
        ReadQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);
        ValidateScopeAndTable(scope, query.TableLogicalName);
        ArgumentOutOfRangeException.ThrowIfLessThan(query.PageSize, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(query.PageSize, 500);
        var offset = DecodeOffset(query.ContinuationToken);

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        var sql = new StringBuilder(
            """
            SELECT TableLogicalName,
                   RecordId,
                   DataJson,
                   SecuritySnapshotVersion,
                   ProjectedAt,
                   IsDeleted
            FROM dbo.VerseOffReadProjection
            WHERE TenantId = @tenantId
              AND EnvironmentId = @environmentId
              AND UserObjectId = @userObjectId
              AND SecuritySnapshotVersion = @securitySnapshotVersion
              AND TableLogicalName = @tableLogicalName
              AND IsDeleted = 0
            """);
        AddScopeParameters(command, scope, query.TableLogicalName);
        if (!string.IsNullOrWhiteSpace(query.SearchText))
        {
            sql.AppendLine(
                "  AND DataJson LIKE @searchText ESCAPE '~'");
            command.Parameters.Add(
                new("@searchText", SqlDbType.NVarChar, 4000)
                {
                    Value = $"%{EscapeLike(query.SearchText)}%",
                });
        }

        var filterIndex = 0;
        foreach (var filter in query.Filters.OrderBy(
            filter => filter.Key,
            StringComparer.Ordinal))
        {
            ValidateColumnName(filter.Key);
            var parameterName = $"@filter{filterIndex++}";
            if (filter.Value is null)
            {
                sql.Append("  AND JSON_VALUE(DataJson, '$.")
                    .Append(filter.Key)
                    .AppendLine("') IS NULL");
                continue;
            }

            sql.Append("  AND JSON_VALUE(DataJson, '$.")
                .Append(filter.Key)
                .Append("') = ")
                .AppendLine(parameterName);
            command.Parameters.Add(
                new(parameterName, SqlDbType.NVarChar, 4000)
                {
                    Value = Convert.ToString(
                        filter.Value,
                        CultureInfo.InvariantCulture)
                        ?? string.Empty,
                });
        }

        sql.AppendLine(
            """
            ORDER BY ProjectedAt DESC, RecordId
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY;
            """);
        command.Parameters.Add(
            new("@offset", SqlDbType.Int)
            {
                Value = offset,
            });
        command.Parameters.Add(
            new("@pageSize", SqlDbType.Int)
            {
                Value = query.PageSize + 1,
            });
        command.CommandText = sql.ToString();

        var records = new List<ReadRecord>();
        await using var reader = await command.ExecuteReaderAsync(
            CommandBehavior.SequentialAccess,
            cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            records.Add(ReadRecordFrom(reader));
        }

        var hasMore = records.Count > query.PageSize;
        if (hasMore)
        {
            records.RemoveAt(records.Count - 1);
        }

        return new(
            records,
            hasMore ? EncodeOffset(offset + records.Count) : null,
            TotalCount: null);
    }

    private static ReadRecord ReadRecordFrom(SqlDataReader reader)
    {
        using var document = JsonDocument.Parse(reader.GetString(2));
        return new(
            reader.GetString(0),
            reader.GetGuid(1),
            document.RootElement.Clone(),
            reader.GetString(3),
            reader.GetFieldValue<DateTimeOffset>(4),
            LocalSyncState.Synced,
            reader.GetBoolean(5));
    }

    private static void AddScopeParameters(
        SqlCommand command,
        SqlReadModelScope scope,
        string tableLogicalName)
    {
        command.Parameters.Add(
            new("@tenantId", SqlDbType.UniqueIdentifier)
            {
                Value = scope.TenantId,
            });
        command.Parameters.Add(
            new("@environmentId", SqlDbType.UniqueIdentifier)
            {
                Value = scope.EnvironmentId,
            });
        command.Parameters.Add(
            new("@userObjectId", SqlDbType.UniqueIdentifier)
            {
                Value = scope.UserObjectId,
            });
        command.Parameters.Add(
            new("@securitySnapshotVersion", SqlDbType.NVarChar, 128)
            {
                Value = scope.SecuritySnapshotVersion,
            });
        command.Parameters.Add(
            new("@tableLogicalName", SqlDbType.NVarChar, 128)
            {
                Value = tableLogicalName,
            });
    }

    private static void ValidateScopeAndTable(
        SqlReadModelScope scope,
        string tableLogicalName)
    {
        ArgumentNullException.ThrowIfNull(scope);
        if (scope.TenantId == Guid.Empty
            || scope.EnvironmentId == Guid.Empty
            || scope.UserObjectId == Guid.Empty
            || string.IsNullOrWhiteSpace(scope.SecuritySnapshotVersion))
        {
            throw new InvalidOperationException(
                "The Microsoft SQL read-model security scope is incomplete.");
        }

        ValidateColumnName(tableLogicalName);
    }

    private static void ValidateColumnName(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (!name.All(character =>
                char.IsAsciiLetterOrDigit(character) || character == '_'))
        {
            throw new ArgumentException(
                "Dataverse logical names may contain ASCII letters, digits, and underscores only.",
                nameof(name));
        }
    }

    private static string EscapeLike(string value) =>
        value.Replace("~", "~~", StringComparison.Ordinal)
            .Replace("%", "~%", StringComparison.Ordinal)
            .Replace("_", "~_", StringComparison.Ordinal)
            .Replace("[", "~[", StringComparison.Ordinal);

    private static string EncodeOffset(int offset) =>
        Convert.ToBase64String(
            Encoding.UTF8.GetBytes(
                offset.ToString(CultureInfo.InvariantCulture)));

    private static int DecodeOffset(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return 0;
        }

        try
        {
            var value = Encoding.UTF8.GetString(
                Convert.FromBase64String(token));
            if (int.TryParse(
                    value,
                    NumberStyles.None,
                    CultureInfo.InvariantCulture,
                    out var offset)
                && offset is >= 0 and <= 1_000_000)
            {
                return offset;
            }
        }
        catch (FormatException exception)
        {
            throw new InvalidDataException(
                "The SQL continuation token is invalid.",
                exception);
        }

        throw new InvalidDataException(
            "The SQL continuation token is invalid.");
    }
}
