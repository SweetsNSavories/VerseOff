using System.Text;
using System.Text.RegularExpressions;
using VerseOff.Domain;

namespace VerseOff.ClientApi;

public sealed record CustomerScriptFinding(
    string Code,
    string Message);

public sealed record CustomerScriptScanResult(
    CompatibilityDisposition Disposition,
    IReadOnlyList<CustomerScriptFinding> Findings)
{
    public bool IsAllowed =>
        Disposition is CompatibilityDisposition.Native
        && Findings.Count == 0;
}

public static partial class CustomerScriptScanner
{
    public static CustomerScriptScanResult Scan(
        CustomerScript script,
        int maximumSourceBytes)
    {
        ArgumentNullException.ThrowIfNull(script);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(
            maximumSourceBytes);

        var findings = new List<CustomerScriptFinding>();
        var decision = CleanRoomComponentPolicy.Evaluate(script.Provenance);
        if (!decision.CanExecuteCustomerCode)
        {
            findings.Add(new(
                "provenance",
                decision.Reason));
        }

        var sourceBytes = Encoding.UTF8.GetByteCount(script.Source);
        if (sourceBytes > maximumSourceBytes)
        {
            findings.Add(new(
                "source-size",
                $"Script exceeds the {maximumSourceBytes} byte source limit."));
        }

        var actualHash = Convert.ToHexString(
                System.Security.Cryptography.SHA256.HashData(
                    Encoding.UTF8.GetBytes(script.Source)))
            .ToLowerInvariant();
        if (!string.Equals(
                actualHash,
                script.Provenance.Sha256,
                StringComparison.OrdinalIgnoreCase))
        {
            findings.Add(new(
                "integrity",
                "Script content does not match its approved SHA-256 hash."));
        }

        foreach (Match match in ProhibitedCapabilityRegex()
            .Matches(script.Source))
        {
            var capability = match.Groups["capability"].Value;
            if (findings.Any(finding =>
                    string.Equals(
                        finding.Code,
                        capability,
                        StringComparison.OrdinalIgnoreCase)))
            {
                continue;
            }

            findings.Add(new(
                capability,
                $"Script uses prohibited capability '{capability}'."));
        }

        return new(
            findings.Count == 0
                ? CompatibilityDisposition.Native
                : CompatibilityDisposition.Blocked,
            findings);
    }

    public static bool IsValidFunctionName(string functionName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(functionName);
        return FunctionNameRegex().IsMatch(functionName);
    }

    [GeneratedRegex(
        """
        (?x)
        (?:
          \b(?<capability>
            eval|Function|fetch|XMLHttpRequest|WebSocket|EventSource|
            document|window|navigator|location|localStorage|sessionStorage|
            indexedDB|Worker|SharedWorker|ServiceWorker|WebAssembly|Atomics|
            SharedArrayBuffer|setTimeout|setInterval|require|importNamespace|
            ActiveXObject|globalThis|import|__proto__|prototype|constructor|
            __verseoff
          )\b
          |
          Math\s*\.\s*(?<capability>random)\s*\(
        )
        """,
        RegexOptions.CultureInvariant)]
    private static partial Regex ProhibitedCapabilityRegex();

    [GeneratedRegex(
        """^[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*$""",
        RegexOptions.CultureInvariant)]
    private static partial Regex FunctionNameRegex();
}
