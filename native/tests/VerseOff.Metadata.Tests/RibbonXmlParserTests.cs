using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class RibbonXmlParserTests
{
    [TestMethod]
    public void ParsesCommandPresentationActionAndCrmParameters()
    {
        var document = SecureXml.Parse("""
            <RibbonDiffXml>
              <CustomActions>
                <CustomAction Id="contoso.Action"
                              Location="Mscrm.Form.account.MainTab"
                              Sequence="20">
                  <CommandUIDefinition>
                    <Button Id="contoso.Button"
                            Command="contoso.Command"
                            LabelText="Run offline" />
                  </CommandUIDefinition>
                </CustomAction>
              </CustomActions>
              <CommandDefinitions>
                <CommandDefinition Id="contoso.Command">
                  <EnableRules>
                    <EnableRule Id="contoso.Enabled" />
                  </EnableRules>
                  <Actions>
                    <JavaScriptFunction FunctionName="Contoso.run"
                                        Library="$webresource:contoso_command.js">
                      <CrmParameter Value="PrimaryControl" />
                      <StringParameter Value="offline" />
                    </JavaScriptFunction>
                  </Actions>
                </CommandDefinition>
              </CommandDefinitions>
            </RibbonDiffXml>
            """);
        var provenance = new ComponentProvenance(
            "ribbon",
            "contoso_ribbon",
            ComponentOrigin.CustomerOwned,
            "contoso_solution",
            "contoso",
            new string('a', 64),
            IsManaged: false,
            OwnershipVerified: true);

        var commands = RibbonXmlParser.Parse(document, provenance);

        Assert.HasCount(1, commands);
        Assert.AreEqual("Run offline", commands[0].Label);
        Assert.AreEqual(20, commands[0].Order);
        Assert.AreEqual(
            CommandActionKind.CustomerJavaScript,
            commands[0].Action.Kind);
        Assert.AreEqual(
            "contoso_command.js::Contoso.run",
            commands[0].Action.Target);
        Assert.AreEqual(
            HandlerParameterKind.PrimaryControl,
            commands[0].Action.Parameters[0].Kind);
    }
}
