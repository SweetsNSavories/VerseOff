namespace VerseOff.Domain.Tests;

[TestClass]
public sealed class ApplicationDefinitionValidatorTests
{
    [TestMethod]
    public void ValidDefinitionPassesValidation()
    {
        var definition = CreateDefinition("name");

        var result = ApplicationDefinitionValidator.Validate(definition);

        Assert.IsTrue(result.IsValid);
        Assert.IsEmpty(result.Issues);
    }

    [TestMethod]
    public void UnknownControlColumnFailsValidation()
    {
        var definition = CreateDefinition("missing");

        var result = ApplicationDefinitionValidator.Validate(definition);

        Assert.IsFalse(result.IsValid);
        Assert.IsTrue(result.Issues.Any(issue =>
            string.Equals(
                issue.Code,
                "unknown-control-column",
                StringComparison.Ordinal)));
    }

    private static ApplicationDefinition CreateDefinition(
        string controlColumn)
    {
        var provenance = new ComponentProvenance(
            "form-id",
            "sample_form",
            ComponentOrigin.CustomerOwned,
            "solution-id",
            "publisher-id",
            new string('a', 64),
            IsManaged: false,
            OwnershipVerified: true);
        var table = new TableDefinition(
            "account",
            "accounts",
            "accountid",
            "name",
            IsActivity: false,
            [
                new(
                    "accountid",
                    "Uniqueidentifier",
                    CanRead: true,
                    CanCreate: false,
                    CanUpdate: false,
                    IsSecured: false),
                new(
                    "name",
                    "String",
                    CanRead: true,
                    CanCreate: true,
                    CanUpdate: true,
                    IsSecured: false),
            ]);
        var control = new FormControlDefinition(
            "name-control",
            controlColumn,
            FormControlKind.Text,
            null,
            IsVisible: true,
            IsDisabled: false);
        var form = new FormDefinition(
            Guid.NewGuid(),
            "Main",
            "account",
            FormType: 2,
            [],
            provenance)
        {
            Tabs =
            [
                new(
                    "general",
                    "General",
                    IsVisible: true,
                    IsExpanded: true,
                    Order: 0,
                    [
                        new(
                            100,
                            [
                                new(
                                    "summary",
                                    "Summary",
                                    IsVisible: true,
                                    ShowLabel: true,
                                    Order: 0,
                                    [
                                        new(
                                            0,
                                            [
                                                new(
                                                    "name-cell",
                                                    "Name",
                                                    IsVisible: true,
                                                    ShowLabel: true,
                                                    RowSpan: 1,
                                                    ColumnSpan: 1,
                                                    control),
                                            ]),
                                    ]),
                            ]),
                    ]),
            ],
        };

        return new(
            Guid.NewGuid(),
            "sample_app",
            "Sample app",
            [table],
            [form],
            [],
            new string('b', 64));
    }
}
