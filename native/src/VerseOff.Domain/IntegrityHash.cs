namespace VerseOff.Domain;

public static class IntegrityHash
{
    public static bool IsSha256(string? value) =>
        value is { Length: 64 }
        && value.All(Uri.IsHexDigit);
}
