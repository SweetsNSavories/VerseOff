using System.Globalization;
using System.Xml.Linq;

namespace VerseOff.Metadata;

internal static class XmlElementExtensions
{
    public static IEnumerable<XElement> ElementsNamed(
        this XContainer container,
        string localName) =>
        container.Elements().Where(element =>
            string.Equals(
                element.Name.LocalName,
                localName,
                StringComparison.OrdinalIgnoreCase));

    public static IEnumerable<XElement> DescendantsNamed(
        this XContainer container,
        string localName) =>
        container.Descendants().Where(element =>
            string.Equals(
                element.Name.LocalName,
                localName,
                StringComparison.OrdinalIgnoreCase));

    public static XElement? ElementNamed(
        this XContainer container,
        string localName) =>
        container.ElementsNamed(localName).FirstOrDefault();

    public static string? AttributeValue(
        this XElement element,
        string localName) =>
        element.Attributes()
            .FirstOrDefault(attribute =>
                string.Equals(
                    attribute.Name.LocalName,
                    localName,
                    StringComparison.OrdinalIgnoreCase))
            ?.Value;

    public static string? ChildValue(
        this XContainer container,
        string localName) =>
        container.ElementNamed(localName)?.Value.Trim();

    public static bool BooleanAttribute(
        this XElement element,
        string localName,
        bool defaultValue)
    {
        var value = element.AttributeValue(localName);
        return value is null
            ? defaultValue
            : string.Equals(value, "true", StringComparison.OrdinalIgnoreCase)
                || string.Equals(value, "1", StringComparison.Ordinal);
    }

    public static int IntegerAttribute(
        this XElement element,
        string localName,
        int defaultValue)
    {
        var value = element.AttributeValue(localName);
        return int.TryParse(
            value,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : defaultValue;
    }
}
