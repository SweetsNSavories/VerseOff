using System.Net;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class DataverseOperationServiceTests
{
    [TestMethod]
    public async Task UpdateUsesCallerObjectIdEtagAndDocumentedWebApiPath()
    {
        using var handler = new RecordingHandler();
        using var client = new HttpClient(handler);
        var executor = new HttpDataverseOperationExecutor(
            client,
            new Uri("https://example.crm.dynamics.com/"),
            new TestTokenProvider(),
            new DictionaryEntitySetResolver(
                new Dictionary<string, string>(
                    StringComparer.OrdinalIgnoreCase)
                {
                    ["account"] = "accounts",
                }));
        var userId = Guid.NewGuid();
        var recordId = Guid.NewGuid();
        using var payload = JsonDocument.Parse("""{"name":"Acme"}""");
        var operation = new DataverseOperation(
            Guid.NewGuid(),
            DataverseOperationType.Update,
            "account",
            recordId,
            payload.RootElement.Clone(),
            "W/\"base\"",
            userId,
            "device",
            DateTimeOffset.UtcNow,
            "correlation");

        var result = await executor.ExecuteAsync(operation);

        Assert.IsTrue(result.Succeeded);
        Assert.IsNotNull(handler.Request);
        Assert.AreEqual(HttpMethod.Patch, handler.Request.Method);
        Assert.AreEqual(
            $"https://example.crm.dynamics.com/api/data/v9.2/accounts({recordId:D})",
            handler.Request.RequestUri?.AbsoluteUri);
        Assert.AreEqual(
            "Bearer test-token",
            handler.Request.Headers.Authorization?.ToString());
        CollectionAssert.Contains(
            handler.Request.Headers.GetValues("CallerObjectId").ToArray(),
            userId.ToString("D"));
        CollectionAssert.Contains(
            handler.Request.Headers.GetValues("If-Match").ToArray(),
            "W/\"base\"");
        StringAssert.Contains(handler.Body, "Acme");
    }

    [TestMethod]
    public async Task MissingEntitySetReturnsExplicitFailure()
    {
        using var client = new HttpClient(new RecordingHandler());
        var executor = new HttpDataverseOperationExecutor(
            client,
            new Uri("https://example.crm.dynamics.com/"),
            new TestTokenProvider(),
            new DictionaryEntitySetResolver(
                new Dictionary<string, string>(
                    StringComparer.OrdinalIgnoreCase)));
        using var payload = JsonDocument.Parse("{}");
        var operation = new DataverseOperation(
            Guid.NewGuid(),
            DataverseOperationType.Create,
            "unknown",
            Guid.NewGuid(),
            payload.RootElement.Clone(),
            null,
            Guid.NewGuid(),
            "device",
            DateTimeOffset.UtcNow,
            "correlation");

        var result = await executor.ExecuteAsync(operation);

        Assert.IsFalse(result.Succeeded);
        Assert.AreEqual(400, result.StatusCode);
        Assert.AreEqual("EntitySetNotConfigured", result.ErrorCode);
    }

    private sealed class TestTokenProvider : IDataverseAccessTokenProvider
    {
        public ValueTask<string> GetAccessTokenAsync(
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult("test-token");
    }

    private sealed class RecordingHandler : HttpMessageHandler
    {
        public HttpRequestMessage? Request { get; private set; }

        public string? Body { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            Request = Clone(request);
            Body = request.Content is null
                ? null
                : await request.Content.ReadAsStringAsync(cancellationToken);
            var response = new HttpResponseMessage(HttpStatusCode.NoContent);
            response.Headers.ETag =
                new System.Net.Http.Headers.EntityTagHeaderValue(
                    "\"version-1\"");
            return response;
        }

        private static HttpRequestMessage Clone(
            HttpRequestMessage request)
        {
            var clone = new HttpRequestMessage(
                request.Method,
                request.RequestUri);
            foreach (var header in request.Headers)
            {
                clone.Headers.TryAddWithoutValidation(
                    header.Key,
                    header.Value);
            }

            return clone;
        }
    }
}
