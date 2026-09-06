using System.Net;
using System.Text;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class DataverseChangeServiceTests
{
    [TestMethod]
    public async Task ParsesChangesAndValidatesPagingOrigin()
    {
        var recordId = Guid.NewGuid();
        using var handler = new ChangeHandler($$"""
            {
              "value": [{
                "accountid": "{{recordId:D}}",
                "name": "Acme",
                "@odata.etag": "W/\"1\""
              }],
              "@odata.nextLink":
                "https://example.crm.dynamics.com/api/data/v9.2/accounts?$skiptoken=next"
            }
            """);
        using var client = new HttpClient(handler);
        var executor = Executor(client);
        var callerId = Guid.NewGuid();

        var page = await executor.ReadAsync(
            "account",
            callerId,
            pageOrDeltaLink: null);

        Assert.HasCount(1, page.Changes);
        Assert.AreEqual(recordId, page.Changes[0].RecordId);
        Assert.AreEqual("W/\"1\"", page.Changes[0].Etag);
        StringAssert.Contains(page.NextLink, "$skiptoken=next");
        CollectionAssert.Contains(
            handler.Headers["CallerObjectId"],
            callerId.ToString("D"));
        CollectionAssert.Contains(
            handler.Headers["Prefer"],
            "odata.track-changes,odata.maxpagesize=100");
    }

    [TestMethod]
    public async Task RejectsDataversePagingLinkForAnotherHost()
    {
        using var client = new HttpClient(new ChangeHandler(
            """{"value":[],"@odata.deltaLink":"https://attacker.example.test/api/data/v9.2/accounts?$deltatoken=x"}"""));
        var executor = Executor(client);

        await Assert.ThrowsExactlyAsync<InvalidDataException>(
            () => executor.ReadAsync(
                    "account",
                    Guid.NewGuid(),
                    pageOrDeltaLink: null)
                .AsTask());
    }

    private static HttpDataverseChangeExecutor Executor(
        HttpClient client) =>
        new(
            client,
            new Uri("https://example.crm.dynamics.com/"),
            new TestTokenProvider(),
            new DictionaryEntitySetResolver(
                new Dictionary<string, string>
                {
                    ["account"] = "accounts",
                }),
            new DictionaryPrimaryIdResolver(
                new Dictionary<string, string>
                {
                    ["account"] = "accountid",
                }));

    private sealed class TestTokenProvider : IDataverseAccessTokenProvider
    {
        public ValueTask<string> GetAccessTokenAsync(
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult("token");
    }

    private sealed class ChangeHandler(string responseJson)
        : HttpMessageHandler
    {
        public Dictionary<string, string[]> Headers { get; } =
            new(StringComparer.OrdinalIgnoreCase);

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            foreach (var header in request.Headers)
            {
                Headers[header.Key] = header.Value.ToArray();
            }

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    responseJson,
                    Encoding.UTF8,
                    "application/json"),
            });
        }
    }
}
