namespace VerseOff.Domain;

public enum ComponentOrigin
{
    Unknown = 0,
    MicrosoftSystem = 1,
    CustomerOwned = 2,
    ThirdParty = 3,
    VerseOffOwned = 4,
}

public enum ComponentDisposition
{
    Blocked = 0,
    CleanRoomNative = 1,
    CustomerExecutable = 2,
    VendorAdapter = 3,
    VerseOffNative = 4,
}

public sealed record ComponentProvenance(
    string ComponentId,
    string UniqueName,
    ComponentOrigin Origin,
    string SolutionId,
    string PublisherId,
    string Sha256,
    bool IsManaged,
    bool OwnershipVerified);

public sealed record ComponentDecision(
    ComponentDisposition Disposition,
    string Reason)
{
    public bool CanExecuteCustomerCode =>
        Disposition == ComponentDisposition.CustomerExecutable;
}

public static class CleanRoomComponentPolicy
{
    public static ComponentDecision Evaluate(ComponentProvenance provenance)
    {
        ArgumentNullException.ThrowIfNull(provenance);

        return provenance.Origin switch
        {
            ComponentOrigin.MicrosoftSystem => new(
                ComponentDisposition.CleanRoomNative,
                "Microsoft implementation assets are excluded; use documented clean-room behavior."),
            ComponentOrigin.VerseOffOwned => new(
                ComponentDisposition.VerseOffNative,
                "VerseOff-owned native implementation."),
            ComponentOrigin.CustomerOwned
                when provenance.OwnershipVerified
                    && !string.IsNullOrWhiteSpace(provenance.SolutionId)
                    && !string.IsNullOrWhiteSpace(provenance.PublisherId)
                    && IntegrityHash.IsSha256(provenance.Sha256) => new(
                        ComponentDisposition.CustomerExecutable,
                        "Verified customer-authored component."),
            ComponentOrigin.CustomerOwned => new(
                ComponentDisposition.Blocked,
                "Customer ownership, solution provenance, publisher, and hash must be verified."),
            ComponentOrigin.ThirdParty => new(
                ComponentDisposition.VendorAdapter,
                "Third-party code is not transpiled or executed; use a vendor-supported adapter."),
            _ => new(
                ComponentDisposition.Blocked,
                "Unknown component provenance fails closed."),
        };
    }
}
