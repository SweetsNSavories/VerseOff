using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Sync.Tests;

[TestClass]
public sealed class HttpBcdrChangeGatewayTests
{
    [TestMethod]
    public async Task ReadsChangePageThroughHttpsGateway()
    {
        var recordId = Guid.NewGuid();
        using var payload = JsonDocument.Parse(
            $$"""{"accountid":"{{recordId:D}}"}""");
        using var handler = new ChangeHandler(new(
            [
                new(
                    "account",
                    recordId,
                    payload.RootElement.Clone(),
                    "W/\"1\"",
                    IsDeleted: false),
            ],
            NextLink: null,
            DeltaLink: "delta"));
        using var client = new HttpClient(handler)
        {
            BaseAddress = new Uri("https://gateway.example.test/"),
        };
        var gateway = new HttpBcdrChangeGateway(client);

        var page = await gateway.ReadChangesAsync(
            "account",
            "prior-delta");

        Assert.HasCount(1, page.Changes);
        Assert.AreEqual("delta", page.DeltaLink);
        Assert.AreEqual(
            "https://gateway.example.test/api/v1/sync/changes",
            handler.RequestUri?.AbsoluteUri);
        Assert.AreEqual("account", handler.TableLogicalName);
        Assert.AreEqual("prior-delta", handler.PageOrDeltaLink);
    }

    private sealed class ChangeHandler(DataverseChangePage page)
        : HttpMessageHandler
    {
        public Uri? RequestUri { get; private set; }

        public string? TableLogicalName { get; private set; }

        public string? PageOrDeltaLink { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            RequestUri = request.RequestUri;
            using var body = JsonDocument.Parse(
                await request.Content!.ReadAsStringAsync(cancellationToken));
            TableLogicalName = body.RootElement
                .GetProperty("tableLogicalName")
                .GetString();
            PageOrDeltaLink = body.RootElement
                .GetProperty("pageOrDeltaLink")
                .GetString();
            return new(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(page),
            };
        }
    }
}
