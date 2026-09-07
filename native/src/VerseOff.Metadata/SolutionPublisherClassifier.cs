using VerseOff.Domain;

namespace VerseOff.Metadata;

public static class SolutionPublisherClassifier
{
    private static readonly string[] MicrosoftPublisherPrefixes =
    [
        "microsoft",
        "dynamics365",
        "msdyn",
        "msauto",
    ];

    public static ComponentOrigin Classify(string publisherUniqueName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(publisherUniqueName);

        return MicrosoftPublisherPrefixes.Any(prefix =>
                publisherUniqueName.StartsWith(
                    prefix,
                    StringComparison.OrdinalIgnoreCase))
            ? ComponentOrigin.MicrosoftSystem
            : ComponentOrigin.Unknown;
    }
}
