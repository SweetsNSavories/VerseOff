using System.Net;
using System.Text;

namespace VerseOff.Integrations.Tests;

[TestClass]
public sealed class GraphMailDeltaClientTests
{
    [TestMethod]
    public async Task FollowsBoundedGraphPagingAndReturnsDeltaLink()
    {
        using var handler = new QueueHandler(
            """
            {
              "value": [{
                "id": "message-1",
                "subject": "New case",
                "bodyPreview": "Customer called",
                "from": {"emailAddress":{"name":"Sender","address":"sender@example.test"}},
                "toRecipients": [{"emailAddress":{"name":"Agent","address":"agent@example.test"}}],
                "receivedDateTime": "2026-09-06T12:00:00Z",
                "lastModifiedDateTime": "2026-09-06T12:01:00Z",
                "isRead": false,
                "hasAttachments": true
              }],
              "@odata.nextLink": "https://graph.microsoft.com/v1.0/users/user/mailFolders/inbox/messages/delta?$skiptoken=next"
            }
            """,
            """
            {
              "value": [{
                "id": "message-2",
                "@removed": {"reason":"deleted"}
              }],
              "@odata.deltaLink": "https://graph.microsoft.com/v1.0/users/user/mailFolders/inbox/messages/delta?$deltatoken=final"
            }
            """);
        using var client = new HttpClient(handler);
        var deltaClient = new GraphMailDeltaClient(
            client,
            new TestTokenProvider());

        var result = await deltaClient.GetInboxDeltaAsync("user");

        Assert.HasCount(2, result.Changes);
        Assert.AreEqual("New case", result.Changes[0].Subject);
        Assert.AreEqual(
            "agent@example.test",
            result.Changes[0].ToRecipients[0].Address);
        Assert.IsTrue(result.Changes[1].IsDeleted);
        StringAssert.Contains(result.DeltaLink, "$deltatoken=final");
        Assert.AreEqual(2, handler.RequestCount);
    }

    [TestMethod]
    public async Task RejectsGraphPagingLinkOutsideMicrosoftGraph()
    {
        using var handler = new QueueHandler(
            """
            {
              "value": [],
              "@odata.nextLink": "https://attacker.example.test/steal"
            }
            """);
        using var client = new HttpClient(handler);
        var deltaClient = new GraphMailDeltaClient(
            client,
            new TestTokenProvider());

        await Assert.ThrowsExactlyAsync<InvalidDataException>(
            () => deltaClient.GetInboxDeltaAsync("user").AsTask());
    }

    private sealed class TestTokenProvider : IGraphAccessTokenProvider
    {
        public ValueTask<string> GetAccessTokenAsync(
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult("graph-token");
    }

    private sealed class QueueHandler(params string[] responses)
        : HttpMessageHandler
    {
        private int index;

        public int RequestCount { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            Assert.AreEqual(
                "Bearer graph-token",
                request.Headers.Authorization?.ToString());
            RequestCount++;
            var content = responses[Math.Min(index, responses.Length - 1)];
            index++;
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    content,
                    Encoding.UTF8,
                    "application/json"),
            });
        }
    }
}
