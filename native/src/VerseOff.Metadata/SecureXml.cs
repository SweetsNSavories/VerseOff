using System.Xml;
using System.Xml.Linq;

namespace VerseOff.Metadata;

public static class SecureXml
{
    public static XDocument Load(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);

        using var reader = XmlReader.Create(
            stream,
            new XmlReaderSettings
            {
                DtdProcessing = DtdProcessing.Prohibit,
                IgnoreComments = false,
                IgnoreWhitespace = false,
                MaxCharactersFromEntities = 0,
                XmlResolver = null,
            });
        return XDocument.Load(
            reader,
            LoadOptions.PreserveWhitespace | LoadOptions.SetLineInfo);
    }

    public static XDocument Parse(string xml)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(xml);

        using var reader = XmlReader.Create(
            new StringReader(xml),
            new XmlReaderSettings
            {
                DtdProcessing = DtdProcessing.Prohibit,
                IgnoreComments = false,
                IgnoreWhitespace = false,
                MaxCharactersFromEntities = 0,
                XmlResolver = null,
            });
        return XDocument.Load(
            reader,
            LoadOptions.PreserveWhitespace | LoadOptions.SetLineInfo);
    }
}
