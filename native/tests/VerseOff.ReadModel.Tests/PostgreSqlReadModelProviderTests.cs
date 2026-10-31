using System.Data;
using System.Data.Common;
using System.Diagnostics.CodeAnalysis;
using Microsoft.Data.Sqlite;
using VerseOff.Domain;

namespace VerseOff.ReadModel.Tests;

[TestClass]
public sealed class PostgreSqlReadModelProviderTests
{
    [TestMethod]
    public void PostgreSqlConnectionFactoryRejectsUnencryptedOrUntrustedTls()
    {
        Assert.ThrowsExactly<ArgumentException>(
            () => new PostgreSqlConnectionFactory(
                "Host=pg.example.test;Database=verseoff;SSL Mode=Disable",
                static cs => new SqliteConnection(cs)));
        Assert.ThrowsExactly<ArgumentException>(
            () => new PostgreSqlConnectionFactory(
                "Host=pg.example.test;Database=verseoff;SSL Mode=Prefer",
                static cs => new SqliteConnection(cs)));
        Assert.ThrowsExactly<ArgumentException>(
            () => new PostgreSqlConnectionFactory(
                "Host=pg.example.test;Database=verseoff;SSL Mode=Require;Trust Server Certificate=true",
                static cs => new SqliteConnection(cs)));
        Assert.ThrowsExactly<ArgumentException>(
            () => new PostgreSqlConnectionFactory(
                "Database=verseoff;SSL Mode=VerifyFull",
                static cs => new SqliteConnection(cs)));
    }

    [TestMethod]
    public void PostgreSqlConnectionFactoryAcceptsVerifiedTlsConfiguration()
    {
        var factory = new PostgreSqlConnectionFactory(
            "Host=pg.fabric.example.test;Database=verseoff_read;SSL Mode=VerifyFull;Trust Server Certificate=false",
            static _ => new SqliteConnection("Data Source=:memory:"));

        using var connection = factory.CreateConnection();

        Assert.IsNotNull(connection);
        StringAssert.Contains(factory.ConnectionString, "pg.fabric.example.test", StringComparison.OrdinalIgnoreCase);
    }

    [TestMethod]
    public async Task QueryBuildsParameterizedJsonbAndIlikeCommandAndPaginates()
    {
        var now = DateTimeOffset.UtcNow;
        var record1 = Guid.NewGuid();
        var record2 = Guid.NewGuid();
        var scope = new SqlReadModelScope(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "security-v2");
        var recordingFactory = new RecordingConnectionFactory(
            [
                ("account", record1, """{"name":"Contoso Fleet","status":"Active"}""", "security-v2", now, false),
                ("account", record2, """{"name":"Contoso North","status":"Active"}""", "security-v2", now.AddMinutes(-5), false),
            ]);
        var provider = new PostgreSqlReadModelProvider(recordingFactory, scope);

        var page = await provider.QueryAsync(new(
            "account",
            SearchText: "Contoso_100%",
            new Dictionary<string, object?>
            {
                ["status"] = "Active",
                ["parentaccountid"] = null,
            },
            PageSize: 1,
            ContinuationToken: null));

        Assert.HasCount(1, page.Records);
        Assert.AreEqual(record1, page.Records[0].RecordId);
        Assert.AreEqual("Contoso Fleet", page.Records[0].Data.GetProperty("name").GetString());
        Assert.IsNotNull(page.ContinuationToken);

        StringAssert.Contains(recordingFactory.LastCommandText, "FROM verseoff.read_projection", StringComparison.Ordinal);
        StringAssert.Contains(recordingFactory.LastCommandText, "data_json::text ILIKE @searchText ESCAPE '~'", StringComparison.Ordinal);
        StringAssert.Contains(recordingFactory.LastCommandText, "jsonb_extract_path_text(data_json::jsonb, @filterKey0) IS NULL", StringComparison.Ordinal);
        StringAssert.Contains(recordingFactory.LastCommandText, "jsonb_extract_path_text(data_json::jsonb, @filterKey1) = @filter1", StringComparison.Ordinal);
        StringAssert.Contains(recordingFactory.LastCommandText, "LIMIT @pageSize", StringComparison.Ordinal);
        Assert.AreEqual("%Contoso~_100~%%", recordingFactory.LastParameters["@searchText"]);
        Assert.AreEqual("Active", recordingFactory.LastParameters["@filter1"]);
    }

    [TestMethod]
    public async Task RetrieveReturnsProjectedRecordWithinTenantAndSnapshotScope()
    {
        var now = DateTimeOffset.UtcNow;
        var recordId = Guid.NewGuid();
        var scope = new SqlReadModelScope(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "security-v2");
        var recordingFactory = new RecordingConnectionFactory(
            [
                ("account", recordId, """{"name":"Fabrikam Motors"}""", "security-v2", now, false),
            ]);
        var provider = new PostgreSqlReadModelProvider(recordingFactory, scope);

        var record = await provider.RetrieveAsync("account", recordId);

        Assert.IsNotNull(record);
        Assert.AreEqual(recordId, record.RecordId);
        Assert.AreEqual("Fabrikam Motors", record.Data.GetProperty("name").GetString());
        Assert.AreEqual(scope.TenantId, recordingFactory.LastParameters["@tenantId"]);
        Assert.AreEqual(scope.EnvironmentId, recordingFactory.LastParameters["@environmentId"]);
        Assert.AreEqual(scope.UserObjectId, recordingFactory.LastParameters["@userObjectId"]);
        Assert.AreEqual("security-v2", recordingFactory.LastParameters["@securitySnapshotVersion"]);
        Assert.AreEqual(recordId, recordingFactory.LastParameters["@recordId"]);
    }

    [TestMethod]
    public async Task ProviderRejectsInvalidScopeOrUnsafeIdentifiers()
    {
        var validScope = new SqlReadModelScope(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "security-v2");
        var invalidScope = validScope with { TenantId = Guid.Empty };
        var factory = new RecordingConnectionFactory([]);

        var invalidScopeProvider = new PostgreSqlReadModelProvider(factory, invalidScope);
        await Assert.ThrowsExactlyAsync<InvalidOperationException>(
            () => invalidScopeProvider.RetrieveAsync("account", Guid.NewGuid()).AsTask());

        var provider = new PostgreSqlReadModelProvider(factory, validScope);
        await Assert.ThrowsExactlyAsync<ArgumentException>(
            () => provider.RetrieveAsync("account; DROP TABLE", Guid.NewGuid()).AsTask());
        await Assert.ThrowsExactlyAsync<ArgumentException>(
            () => provider.QueryAsync(new(
                "account",
                null,
                new Dictionary<string, object?> { ["bad'column"] = "x" },
                10,
                null)).AsTask());
    }

    private sealed class RecordingConnectionFactory(
        IReadOnlyList<(string Table, Guid RecordId, string DataJson, string SnapshotVersion, DateTimeOffset ProjectedAt, bool IsDeleted)> rows)
        : IPostgreSqlConnectionFactory
    {
        public string LastCommandText { get; private set; } = string.Empty;

        public Dictionary<string, object?> LastParameters { get; } = new(StringComparer.Ordinal);

        public DbConnection CreateConnection() => new FakeDbConnection(this, rows);

        private sealed class FakeDbConnection(
            RecordingConnectionFactory owner,
            IReadOnlyList<(string Table, Guid RecordId, string DataJson, string SnapshotVersion, DateTimeOffset ProjectedAt, bool IsDeleted)> rows)
            : DbConnection
        {
            private ConnectionState state = ConnectionState.Closed;

            [AllowNull]
            public override string ConnectionString { get; set; } = string.Empty;

            public override string Database => "verseoff";

            public override string DataSource => "pg.fabric.example.test";

            public override string ServerVersion => "16.0";

            public override ConnectionState State => state;

            public override void ChangeDatabase(string databaseName)
            {
            }

            public override void Close() => state = ConnectionState.Closed;

            public override void Open() => state = ConnectionState.Open;

            protected override DbTransaction BeginDbTransaction(IsolationLevel isolationLevel) =>
                throw new NotSupportedException();

            protected override DbCommand CreateDbCommand() => new FakeDbCommand(owner, rows);
        }

        private sealed class FakeDbCommand(
            RecordingConnectionFactory owner,
            IReadOnlyList<(string Table, Guid RecordId, string DataJson, string SnapshotVersion, DateTimeOffset ProjectedAt, bool IsDeleted)> rows)
            : DbCommand
        {
            private readonly FakeParameterCollection parameters = new();

            [AllowNull]
            public override string CommandText { get; set; } = string.Empty;

            public override int CommandTimeout { get; set; }

            public override CommandType CommandType { get; set; } = CommandType.Text;

            public override bool DesignTimeVisible { get; set; }

            public override UpdateRowSource UpdatedRowSource { get; set; }

            protected override DbConnection? DbConnection { get; set; }

            protected override DbParameterCollection DbParameterCollection => parameters;

            protected override DbTransaction? DbTransaction { get; set; }

            public override void Cancel()
            {
            }

            public override int ExecuteNonQuery() => 0;

            public override object? ExecuteScalar() => null;

            public override void Prepare()
            {
            }

            protected override DbParameter CreateDbParameter() => new FakeDbParameter();

            protected override DbDataReader ExecuteDbDataReader(CommandBehavior behavior)
            {
                owner.LastCommandText = CommandText;
                owner.LastParameters.Clear();
                foreach (FakeDbParameter parameter in parameters)
                {
                    owner.LastParameters[parameter.ParameterName] = parameter.Value;
                }

                var table = new DataTable();
                table.Columns.Add("table_logical_name", typeof(string));
                table.Columns.Add("record_id", typeof(Guid));
                table.Columns.Add("data_json", typeof(string));
                table.Columns.Add("security_snapshot_version", typeof(string));
                table.Columns.Add("projected_at", typeof(DateTimeOffset));
                table.Columns.Add("is_deleted", typeof(bool));

                foreach (var row in rows)
                {
                    table.Rows.Add(
                        row.Table,
                        row.RecordId,
                        row.DataJson,
                        row.SnapshotVersion,
                        row.ProjectedAt,
                        row.IsDeleted);
                }

                return table.CreateDataReader();
            }
        }

        private sealed class FakeDbParameter : DbParameter
        {
            public override DbType DbType { get; set; }

            public override ParameterDirection Direction { get; set; } = ParameterDirection.Input;

            public override bool IsNullable { get; set; }

            [AllowNull]
            public override string ParameterName { get; set; } = string.Empty;

            public override int Size { get; set; }

            [AllowNull]
            public override string SourceColumn { get; set; } = string.Empty;

            public override bool SourceColumnNullMapping { get; set; }

            public override object? Value { get; set; }

            public override void ResetDbType()
            {
            }
        }

        private sealed class FakeParameterCollection : DbParameterCollection
        {
            private readonly List<object> items = [];

            public override int Count => items.Count;

            public override object SyncRoot => items;

            public override int Add(object value)
            {
                items.Add(value);
                return items.Count - 1;
            }

            public override void AddRange(Array values)
            {
                foreach (var value in values)
                {
                    items.Add(value!);
                }
            }

            public override void Clear() => items.Clear();

            public override bool Contains(object value) => items.Contains(value);

            public override bool Contains(string value) =>
                items.OfType<DbParameter>().Any(p => p.ParameterName == value);

            public override void CopyTo(Array array, int index) =>
                ((System.Collections.ICollection)items).CopyTo(array, index);

            public override System.Collections.IEnumerator GetEnumerator() => items.GetEnumerator();

            public override int IndexOf(object value) => items.IndexOf(value);

            public override int IndexOf(string parameterName) =>
                items.FindIndex(p => p is DbParameter param && param.ParameterName == parameterName);

            public override void Insert(int index, object value) => items.Insert(index, value);

            public override void Remove(object value) => items.Remove(value);

            public override void RemoveAt(int index) => items.RemoveAt(index);

            public override void RemoveAt(string parameterName)
            {
                var index = IndexOf(parameterName);
                if (index >= 0)
                {
                    items.RemoveAt(index);
                }
            }

            protected override DbParameter GetParameter(int index) => (DbParameter)items[index];

            protected override DbParameter GetParameter(string parameterName) =>
                (DbParameter)items[IndexOf(parameterName)];

            protected override void SetParameter(int index, DbParameter value) => items[index] = value;

            protected override void SetParameter(string parameterName, DbParameter value)
            {
                var index = IndexOf(parameterName);
                if (index >= 0)
                {
                    items[index] = value;
                }
            }
        }
    }
}

