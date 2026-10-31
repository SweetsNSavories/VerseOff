using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Text;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.ReadModel;

public interface IPostgreSqlConnectionFactory
{
    DbConnection CreateConnection();
}

/// <summary>
/// Validates and creates encrypted PostgreSQL connections for reading Fabric Link / OneLake
/// mirrored projections. Rejects unencrypted or untrusted TLS configurations.
/// </summary>
public sealed class PostgreSqlConnectionFactory : IPostgreSqlConnectionFactory
{
    private static readonly HashSet<string> AllowedSslModes = new(StringComparer.OrdinalIgnoreCase)
    {
        "Require",
        "VerifyCA",
        "VerifyFull",
    };

    private readonly string connectionString;
    private readonly Func<string, DbConnection> connectionActivator;

    public PostgreSqlConnectionFactory(
        string connectionString,
        DbProviderFactory providerFactory)
        : this(
            connectionString,
            cs =>
            {
                ArgumentNullException.ThrowIfNull(providerFactory);
                var connection = providerFactory.CreateConnection()
                    ?? throw new InvalidOperationException(
                        "The PostgreSQL DbProviderFactory returned a null connection.");
                connection.ConnectionString = cs;
                return connection;
            })
    {
        ArgumentNullException.ThrowIfNull(providerFactory);
    }

    public PostgreSqlConnectionFactory(
        string connectionString,
        Func<string, DbConnection> connectionActivator)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
        ArgumentNullException.ThrowIfNull(connectionActivator);

        var builder = new DbConnectionStringBuilder
        {
            ConnectionString = connectionString,
        };

        var host = GetSetting(builder, "Host", "Server");
        if (string.IsNullOrWhiteSpace(host))
        {
            throw new ArgumentException(
                "The PostgreSQL read-plane connection string must specify a Host.",
                nameof(connectionString));
        }

        var database = GetSetting(builder, "Database", "Initial Catalog");
        if (string.IsNullOrWhiteSpace(database))
        {
            throw new ArgumentException(
                "The PostgreSQL read-plane connection string must specify a Database.",
                nameof(connectionString));
        }

        var sslMode = GetSetting(builder, "SSL Mode", "SslMode");
        if (string.IsNullOrWhiteSpace(sslMode) || !AllowedSslModes.Contains(sslMode))
        {
            throw new ArgumentException(
                "The PostgreSQL read-plane connection must require TLS (SSL Mode=Require, VerifyCA, or VerifyFull).",
                nameof(connectionString));
        }

        var trustServerCert = GetSetting(
            builder,
            "Trust Server Certificate",
            "TrustServerCertificate");
        if (bool.TryParse(trustServerCert, out var trusted) && trusted)
        {
            throw new ArgumentException(
                "TrustServerCertificate must be false for the PostgreSQL read plane.",
                nameof(connectionString));
        }

        this.connectionString = builder.ConnectionString;
        this.connectionActivator = connectionActivator;
    }

    public string ConnectionString => connectionString;

    public DbConnection CreateConnection() => connectionActivator(connectionString);

    private static string? GetSetting(
        DbConnectionStringBuilder builder,
        params string[] keys)
    {
        foreach (var key in keys)
        {
            if (builder.TryGetValue(key, out var value) && value is not null)
            {
                return Convert.ToString(value, CultureInfo.InvariantCulture)?.Trim();
            }
        }

        return null;
    }
}

/// <summary>
/// Queries security-trimmed Dataverse projections materialized from Microsoft Fabric Link / OneLake
/// into a PostgreSQL read model (`verseoff.read_projection`). Dataverse remains the sole write authority.
/// </summary>
public sealed class PostgreSqlReadModelProvider(
    IPostgreSqlConnectionFactory connectionFactory,
    SqlReadModelScope scope) : IReadModelProvider
{
    public async ValueTask<ReadRecord?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        ValidateScopeAndTable(scope, tableLogicalName);

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT table_logical_name,
                   record_id,
                   data_json,
                   security_snapshot_version,
                   projected_at,
                   is_deleted
            FROM verseoff.read_projection
            WHERE tenant_id = @tenantId
              AND environment_id = @environmentId
              AND user_object_id = @userObjectId
              AND security_snapshot_version = @securitySnapshotVersion
              AND table_logical_name = @tableLogicalName
              AND record_id = @recordId;
            """;
        AddScopeParameters(command, scope, tableLogicalName);
        AddParameter(command, "@recordId", DbType.Guid, recordId);

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
        ArgumentNullException.ThrowIfNull(connectionFactory);
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
            SELECT table_logical_name,
                   record_id,
                   data_json,
                   security_snapshot_version,
                   projected_at,
                   is_deleted
            FROM verseoff.read_projection
            WHERE tenant_id = @tenantId
              AND environment_id = @environmentId
              AND user_object_id = @userObjectId
              AND security_snapshot_version = @securitySnapshotVersion
              AND table_logical_name = @tableLogicalName
              AND is_deleted = FALSE
            """);
        AddScopeParameters(command, scope, query.TableLogicalName);
        if (!string.IsNullOrWhiteSpace(query.SearchText))
        {
            sql.AppendLine();
            sql.Append("  AND data_json::text ILIKE @searchText ESCAPE '~'");
            AddParameter(
                command,
                "@searchText",
                DbType.String,
                $"%{EscapeLike(query.SearchText)}%");
        }

        var filterIndex = 0;
        foreach (var filter in query.Filters.OrderBy(
            filter => filter.Key,
            StringComparer.Ordinal))
        {
            ValidateColumnName(filter.Key);
            var keyParameterName = $"@filterKey{filterIndex}";
            var valueParameterName = $"@filter{filterIndex}";
            filterIndex++;

            AddParameter(command, keyParameterName, DbType.String, filter.Key);
            sql.AppendLine();
            if (filter.Value is null)
            {
                sql.Append("  AND jsonb_extract_path_text(data_json::jsonb, ")
                    .Append(keyParameterName)
                    .Append(") IS NULL");
                continue;
            }

            sql.Append("  AND jsonb_extract_path_text(data_json::jsonb, ")
                .Append(keyParameterName)
                .Append(") = ")
                .Append(valueParameterName);
            AddParameter(
                command,
                valueParameterName,
                DbType.String,
                Convert.ToString(filter.Value, CultureInfo.InvariantCulture)
                    ?? string.Empty);
        }

        sql.AppendLine();
        sql.Append(
            """
            ORDER BY projected_at DESC, record_id
            LIMIT @pageSize
            OFFSET @offset;
            """);
        AddParameter(command, "@pageSize", DbType.Int32, query.PageSize + 1);
        AddParameter(command, "@offset", DbType.Int32, offset);
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

    private static ReadRecord ReadRecordFrom(DbDataReader reader)
    {
        using var document = JsonDocument.Parse(reader.GetString(2));
        var recordIdValue = reader.GetValue(1);
        var recordId = recordIdValue switch
        {
            Guid guid => guid,
            string text => Guid.Parse(text),
            _ => reader.GetGuid(1),
        };
        var projectedAtValue = reader.GetValue(4);
        var projectedAt = projectedAtValue switch
        {
            DateTimeOffset dto => dto,
            DateTime dt => new DateTimeOffset(DateTime.SpecifyKind(dt, DateTimeKind.Utc)),
            string text => DateTimeOffset.Parse(text, CultureInfo.InvariantCulture),
            _ => reader.GetFieldValue<DateTimeOffset>(4),
        };
        var isDeletedValue = reader.GetValue(5);
        var isDeleted = isDeletedValue switch
        {
            bool flag => flag,
            long number => number != 0,
            int number => number != 0,
            _ => reader.GetBoolean(5),
        };

        return new(
            reader.GetString(0),
            recordId,
            document.RootElement.Clone(),
            reader.GetString(3),
            projectedAt,
            LocalSyncState.Synced,
            isDeleted);
    }

    private static void AddScopeParameters(
        DbCommand command,
        SqlReadModelScope scope,
        string tableLogicalName)
    {
        AddParameter(command, "@tenantId", DbType.Guid, scope.TenantId);
        AddParameter(command, "@environmentId", DbType.Guid, scope.EnvironmentId);
        AddParameter(command, "@userObjectId", DbType.Guid, scope.UserObjectId);
        AddParameter(
            command,
            "@securitySnapshotVersion",
            DbType.String,
            scope.SecuritySnapshotVersion);
        AddParameter(
            command,
            "@tableLogicalName",
            DbType.String,
            tableLogicalName);
    }

    private static void AddParameter(
        DbCommand command,
        string name,
        DbType dbType,
        object value)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.DbType = dbType;
        parameter.Value = value;
        command.Parameters.Add(parameter);
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
                "The PostgreSQL read-model security scope is incomplete.");
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
            .Replace("_", "~_", StringComparison.Ordinal);

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
                "The PostgreSQL continuation token is invalid.",
                exception);
        }

        throw new InvalidDataException(
            "The PostgreSQL continuation token is invalid.");
    }
}

