using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using VerseOff.Gateway;
using VerseOff.Customization;
using VerseOff.Customization.Runtime;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddAuthentication(NegotiateDefaults.AuthenticationScheme)
    .AddNegotiate();
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
builder.Services.AddHealthChecks();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<
    IEntitlementAuthorizationService,
    ClaimsEntitlementAuthorizationService>();
builder.Services.AddSingleton<
    IGatewayOperationAuthorizationService,
    ClaimsGatewayOperationAuthorizationService>();
builder.Services.AddSingleton<
    IGatewayReadAuthorizationService,
    ClaimsGatewayReadAuthorizationService>();
builder.Services.AddDataverseGateway(builder.Configuration);
builder.Services.AddGraphMailGateway(builder.Configuration);

var customizationStorePath = Path.Combine(
    AppContext.BaseDirectory,
    builder.Configuration["Customization:StorePath"] ?? "customizations");
builder.Services.AddVerseOffCustomization(customizationStorePath);
builder.Services.AddSingleton<IEntitlementLeaseIssuer>(services =>
{
    var section = builder.Configuration.GetSection("EntitlementSigning");
    var privateKeyPath = section["PrivateKeyPemPath"];
    var issuer = section["Issuer"];
    var signingKeyId = section["SigningKeyId"];
    if (string.IsNullOrWhiteSpace(privateKeyPath)
        || string.IsNullOrWhiteSpace(issuer)
        || string.IsNullOrWhiteSpace(signingKeyId))
    {
        return new UnavailableEntitlementLeaseIssuer(
            "Entitlement signing key, issuer, and key ID are not configured.");
    }

    var leaseHours = int.TryParse(
        section["LeaseHours"],
        out var configuredHours)
            ? configuredHours
            : 168;
    return EcdsaEntitlementLeaseIssuer.FromPemFile(
        privateKeyPath,
        new(
            issuer,
            signingKeyId,
            TimeSpan.FromHours(leaseHours)),
        services.GetRequiredService<TimeProvider>());
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health/live").AllowAnonymous();
app.MapGet("/api/v1/session", (ClaimsPrincipal user) =>
{
    return Results.Ok(new
    {
        user = user.Identity?.Name,
        authenticationType = user.Identity?.AuthenticationType,
        authenticated = user.Identity?.IsAuthenticated == true,
    });
});
app.MapPost(
    "/api/v1/entitlements",
    async (
        EntitlementIssuanceRequest request,
        ClaimsPrincipal user,
        IEntitlementAuthorizationService authorizationService,
        IEntitlementLeaseIssuer issuer,
        ILogger<Program> logger,
        CancellationToken cancellationToken) =>
    {
        var validationProblem = ValidateEntitlementRequest(request);
        if (validationProblem is not null)
        {
            return Results.ValidationProblem(validationProblem);
        }

        if (!issuer.IsAvailable)
        {
            return Results.Problem(
                issuer.UnavailableReason,
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var authorization = await authorizationService.AuthorizeAsync(
            user,
            request,
            cancellationToken);
        if (!authorization.IsAuthorized)
        {
            return Results.Problem(
                authorization.FailureReason,
                statusCode: StatusCodes.Status403Forbidden);
        }

        var lease = issuer.Issue(request, authorization);
        GatewayAuditLog.EntitlementIssued(logger, lease);
        return Results.Ok(lease);
    });
app.MapPost(
    "/api/v1/sync/operations",
    async (
        VerseOff.Domain.DataverseOperation operation,
        ClaimsPrincipal user,
        IGatewayOperationAuthorizationService authorizationService,
        IDataverseOperationExecutor executor,
        ILogger<Program> logger,
        CancellationToken cancellationToken) =>
    {
        var validationProblem = ValidateOperation(operation);
        if (validationProblem is not null)
        {
            return Results.ValidationProblem(validationProblem);
        }

        var authorization = await authorizationService.AuthorizeAsync(
            user,
            operation,
            cancellationToken);
        if (!authorization.IsAuthorized)
        {
            return Results.Problem(
                authorization.FailureReason,
                statusCode: StatusCodes.Status403Forbidden);
        }

        if (!executor.IsAvailable)
        {
            return Results.Problem(
                executor.UnavailableReason,
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var result = await executor.ExecuteAsync(
            operation,
            cancellationToken);
        GatewayAuditLog.SyncCompleted(logger, operation, result);
        return Results.Ok(result);
    });
app.MapPost(
    "/api/v1/mail/inbox/delta",
    async (
        GraphMailDeltaRequest request,
        ClaimsPrincipal user,
        IGraphMailGateway graphMailGateway,
        CancellationToken cancellationToken) =>
    {
        if (!graphMailGateway.IsAvailable)
        {
            return Results.Problem(
                graphMailGateway.UnavailableReason,
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var userValue = user.FindFirst("oid")?.Value
            ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userValue, out var userObjectId))
        {
            return Results.Problem(
                "The authenticated identity has no Microsoft Entra object ID.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        return Results.Ok(await graphMailGateway.GetInboxDeltaAsync(
            userObjectId,
            request.DeltaLink,
            cancellationToken));
    });
app.MapPost(
    "/api/v1/sync/changes",
    async (
        GatewayChangeRequest request,
        ClaimsPrincipal user,
        IGatewayReadAuthorizationService authorizationService,
        IDataverseChangeExecutor executor,
        CancellationToken cancellationToken) =>
    {
        if (!authorizationService.CanRead(user, out var userObjectId))
        {
            return Results.Problem(
                "The caller has no authorized BCDR read identity.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        if (!executor.IsAvailable)
        {
            return Results.Problem(
                executor.UnavailableReason,
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        return Results.Ok(await executor.ReadAsync(
            request.TableLogicalName,
            userObjectId,
            request.PageOrDeltaLink,
            cancellationToken));
    });

// Initialize customization cache at startup
try
{
    var runtimeCustomizationApp = app.Services.GetRequiredService<RuntimeCustomizationApplication>();
    await runtimeCustomizationApp.InitializeAsync();
}
catch (Exception ex)
{
#pragma warning disable CA1848 // Use LoggerMessage delegates (acceptable for error logging)
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning(ex, "Customization cache initialization failed; running without customizations");
#pragma warning restore CA1848
}

app.Run();

static Dictionary<string, string[]>? ValidateEntitlementRequest(
    EntitlementIssuanceRequest request)
{
    var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
    if (request.TenantId == Guid.Empty)
    {
        errors[nameof(request.TenantId)] = ["Tenant ID is required."];
    }

    if (request.EnvironmentId == Guid.Empty
        || request.AppModuleId == Guid.Empty
        || request.ProfileId == Guid.Empty)
    {
        errors["scope"] =
            ["Environment, app-module, and profile IDs are required."];
    }

    if (string.IsNullOrWhiteSpace(request.DeviceId))
    {
        errors[nameof(request.DeviceId)] = ["Device ID is required."];
    }

    if (!request.EnvironmentUri.IsAbsoluteUri
        || !string.Equals(
            request.EnvironmentUri.Scheme,
            Uri.UriSchemeHttps,
            StringComparison.OrdinalIgnoreCase))
    {
        errors[nameof(request.EnvironmentUri)] =
            ["Environment URI must be absolute HTTPS."];
    }

    if (!VerseOff.Domain.IntegrityHash.IsSha256(request.ProfileHash))
    {
        errors[nameof(request.ProfileHash)] =
            ["Profile hash must be SHA-256."];
    }

    if (string.IsNullOrWhiteSpace(request.SecuritySnapshotVersion))
    {
        errors[nameof(request.SecuritySnapshotVersion)] =
            ["Security snapshot version is required."];
    }

    if (request.Capabilities.Count == 0
        || request.Capabilities.Any(string.IsNullOrWhiteSpace))
    {
        errors[nameof(request.Capabilities)] =
            ["At least one non-empty capability is required."];
    }

    return errors.Count == 0 ? null : errors;
}

static Dictionary<string, string[]>? ValidateOperation(
    VerseOff.Domain.DataverseOperation operation)
{
    var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
    if (operation.OperationId == Guid.Empty
        || operation.RecordId == Guid.Empty
        || operation.UserObjectId == Guid.Empty)
    {
        errors["identity"] =
            ["Operation, record, and user IDs are required."];
    }

    if (string.IsNullOrWhiteSpace(operation.TableLogicalName)
        || !operation.TableLogicalName.All(character =>
            char.IsAsciiLetterOrDigit(character) || character == '_'))
    {
        errors[nameof(operation.TableLogicalName)] =
            ["Table logical name is invalid."];
    }

    if (string.IsNullOrWhiteSpace(operation.DeviceId)
        || string.IsNullOrWhiteSpace(operation.CorrelationId))
    {
        errors["audit"] =
            ["Device and correlation IDs are required."];
    }

    if (operation.OperationType
            is VerseOff.Domain.DataverseOperationType.Create
            or VerseOff.Domain.DataverseOperationType.Update
        && operation.Payload.ValueKind
            is not System.Text.Json.JsonValueKind.Object)
    {
        errors[nameof(operation.Payload)] =
            ["Create and update payloads must be JSON objects."];
    }

    return errors.Count == 0 ? null : errors;
}

public partial class Program;
