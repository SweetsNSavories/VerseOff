using VerseOff.Domain;

namespace VerseOff.Metadata;

public sealed record SolutionIdentity(
    string UniqueName,
    string PublisherUniqueName,
    string Version,
    bool IsManaged);

public sealed class SolutionImportPolicy
{
    private readonly HashSet<string> approvedCustomerSolutions;
    private readonly Dictionary<string, ComponentOrigin> publisherOrigins;

    public SolutionImportPolicy(
        IEnumerable<string> approvedCustomerSolutions,
        IReadOnlyDictionary<string, ComponentOrigin> publisherOrigins)
    {
        ArgumentNullException.ThrowIfNull(approvedCustomerSolutions);
        ArgumentNullException.ThrowIfNull(publisherOrigins);

        this.approvedCustomerSolutions = approvedCustomerSolutions.ToHashSet(
            StringComparer.OrdinalIgnoreCase);
        this.publisherOrigins = new(
            publisherOrigins,
            StringComparer.OrdinalIgnoreCase);
    }

    public static SolutionImportPolicy FailClosed { get; } = new(
        [],
        new Dictionary<string, ComponentOrigin>(
            StringComparer.OrdinalIgnoreCase));

    public ComponentProvenance CreateProvenance(
        SolutionIdentity identity,
        string componentId,
        string uniqueName,
        string sha256)
    {
        ArgumentNullException.ThrowIfNull(identity);
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(uniqueName);
        ArgumentException.ThrowIfNullOrWhiteSpace(sha256);

        var origin = publisherOrigins.TryGetValue(
            identity.PublisherUniqueName,
            out var configuredOrigin)
                ? configuredOrigin
                : ComponentOrigin.Unknown;
        var ownershipVerified =
            origin is ComponentOrigin.CustomerOwned
            or ComponentOrigin.VerseOffOwned
            && approvedCustomerSolutions.Contains(identity.UniqueName);

        return new(
            componentId,
            uniqueName,
            origin,
            identity.UniqueName,
            identity.PublisherUniqueName,
            sha256,
            identity.IsManaged,
            ownershipVerified);
    }
}
