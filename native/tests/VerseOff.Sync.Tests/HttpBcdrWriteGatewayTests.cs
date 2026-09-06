using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Sync.Tests;

[TestClass]
public sealed class HttpBcdrWriteGatewayTests
{
    [TestMethod]
    public async Task PostsOperationToHttpsGatewayAndReturnsResult()
    {
        var operation = Operation();
        using var handler = new ResultHandler(operation.OperationId);
        using var client = new HttpClient(handler)
        {
            BaseAddress = new Uri("https://gateway.example.test/"),
        };
        var gateway = new HttpBcdrWriteGateway(client);

        var result = await gateway.ExecuteAsync(operation);

        Assert.IsTrue(result.Succeeded);
        Assert.AreEqual(
            "https://gateway.example.test/api/v1/sync/operations",
            handler.RequestUri?.AbsoluteUri);
        Assert.AreEqual(HttpMethod.Post, handler.Method);
    }

    [TestMethod]
    public void RejectsUnencryptedGatewayAddress()
    {
        using var client = new HttpClient
        {
            BaseAddress = new Uri("http://gateway.example.test/"),
        };

        Assert.ThrowsExactly<ArgumentException>(
            () => new HttpBcdrWriteGateway(client));
    }

    private static DataverseOperation Operation()
    {
        using var payload = JsonDocument.Parse("""{"name":"Acme"}""");
        return new(
            Guid.NewGuid(),
            DataverseOperationType.Create,
            "account",
            Guid.NewGuid(),
            payload.RootElement.Clone(),
            null,
            Guid.NewGuid(),
            "device",
            DateTimeOffset.UtcNow,
            "correlation");
    }

    private sealed class ResultHandler(Guid operationId) : HttpMessageHandler
    {
        public Uri? RequestUri { get; private set; }

        public HttpMethod? Method { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            RequestUri = request.RequestUri;
            Method = request.Method;
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(new SyncResult(
                    operationId,
                    Succeeded: true,
                    "W/\"1\"",
                    204,
                    null,
                    null)),
            };
            return Task.FromResult(response);
        }
    }
}
