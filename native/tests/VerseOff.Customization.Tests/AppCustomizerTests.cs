using Xunit;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Customizations;

namespace VerseOff.Customization.Tests;

public class AppCustomizerTests
{
    private static Dictionary<string, EntityMetadata> CreateTestMetadata()
    {
        var entityFields = new List<FieldMetadata>
        {
            new("AccountNumber", "Account Number", "String", null, 50, true, false, new()),
            new("Name", "Name", "String", null, 160, true, false, new()),
            new("CreditLimit", "Credit Limit", "Decimal", null, -1, false, false, new())
        };

        var accountEntity = new EntityMetadata(
            "account",
            "Account",
            "Accounts",
            entityFields,
            new List<string> { "OnCreate", "OnUpdate", "OnDelete" },
            new List<string> { "AccountForm" },
            new List<string> { "AccountView" }
        );

        return new Dictionary<string, EntityMetadata> { { "account", accountEntity } };
    }

    [Fact]
    public void ValidateAddFieldSucceeds()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var newField = new FieldMetadata("Status", "Status", "String", null, 100, false, true, new());
        var result = customizer.AddField("account", newField);
        Assert.NotNull(result);
    }

    [Fact]
    public void ValidateAddFieldExistingThrows()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var existingField = new FieldMetadata("Name", "Name", "String", null, 160, true, false, new());
        var ex = Assert.Throws<InvalidOperationException>(() => customizer.AddField("account", existingField));
        Assert.Contains("already exists", ex.Message);
    }

    [Fact]
    public void ValidateRemoveFieldSucceeds()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var result = customizer.RemoveField("account", "Name");
        Assert.NotNull(result);
    }

    [Fact]
    public void ValidateEventHandlerSucceeds()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var result = customizer.AddEventHandler("account", "OnCreate", "Handler", "code", EventHandlerType.JavaScript);
        Assert.NotNull(result);
    }

    [Fact]
    public void ValidateEventHandlerInvalidEntityThrows()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var ex = Assert.Throws<InvalidOperationException>(() =>
            customizer.AddEventHandler("invalid", "OnCreate", "Handler", "code")
        );
        Assert.Contains("not found", ex.Message);
    }

    [Fact]
    public void ValidateEventHandlerInvalidHookThrows()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var ex = Assert.Throws<InvalidOperationException>(() =>
            customizer.AddEventHandler("account", "OnInvalid", "Handler", "code")
        );
        Assert.Contains("not supported", ex.Message);
    }

    [Fact]
    public void GenerateJsonReturnsValidJson()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var field = new FieldMetadata("Status", "Status", "String", null, 100, false, true, new());
        customizer.AddField("account", field);
        var json = customizer.GenerateJson();
        Assert.NotNull(json);
        Assert.NotEmpty(json);
        Assert.Contains("\"Version\":", json);
    }

    [Fact]
    public void GenerateYamlReturnsValidYaml()
    {
        var metadata = CreateTestMetadata();
        var customizer = new AppCustomizer(metadata);
        var field = new FieldMetadata("Status", "Status", "String", null, 100, false, true, new());
        customizer.AddField("account", field);
        var yaml = customizer.GenerateYaml();
        Assert.NotNull(yaml);
        Assert.NotEmpty(yaml);
        Assert.Contains("version:", yaml);
    }

    [Fact]
    public void FromJsonRoundTripSucceeds()
    {
        var metadata = CreateTestMetadata();
        var customizer1 = new AppCustomizer(metadata);
        var field = new FieldMetadata("Status", "Status", "String", null, 100, false, true, new());
        customizer1.AddField("account", field);
        var json = customizer1.GenerateJson();

        var customizer2 = AppCustomizer.FromJson(json, metadata);
        var json2 = customizer2.GenerateJson();

        Assert.NotNull(json2);
        Assert.NotEmpty(json2);
    }

    [Fact]
    public void FromYamlRoundTripSucceeds()
    {
        var metadata = CreateTestMetadata();
        var customizer1 = new AppCustomizer(metadata);
        var field = new FieldMetadata("Status", "Status", "String", null, 100, false, true, new());
        customizer1.AddField("account", field);
        var yaml = customizer1.GenerateYaml();

        var customizer2 = AppCustomizer.FromYaml(yaml, metadata);
        var yaml2 = customizer2.GenerateYaml();

        Assert.NotNull(yaml2);
        Assert.NotEmpty(yaml2);
        Assert.Contains("version:", yaml2);
    }
}
