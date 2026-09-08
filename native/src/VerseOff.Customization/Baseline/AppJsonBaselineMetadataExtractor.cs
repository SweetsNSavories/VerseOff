using VerseOff.Customization.Metadata;
using VerseOff.Domain;

namespace VerseOff.Customization.Baseline;

/// <summary>
/// Extracts baseline metadata from an ApplicationDefinition (parsed from app.json).
/// Converts Dataverse table/column structures into VerseOff EntityMetadata records.
/// </summary>
public static class AppJsonBaselineMetadataExtractor
{
    /// <summary>
    /// Extract all entity metadata from an application definition.
    /// </summary>
    /// <param name="appDefinition">The parsed application definition from app.json</param>
    /// <returns>Dictionary of entity logical names to EntityMetadata</returns>
    public static Dictionary<string, EntityMetadata> ExtractEntityMetadata(ApplicationDefinition appDefinition)
    {
        ArgumentNullException.ThrowIfNull(appDefinition);
        ArgumentNullException.ThrowIfNull(appDefinition.Tables);

        var result = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

        foreach (var tableDefinition in appDefinition.Tables)
        {
            var entityMetadata = ConvertTableToEntityMetadata(tableDefinition, appDefinition);
            result[entityMetadata.LogicalName] = entityMetadata;
        }

        return result;
    }

    /// <summary>
    /// Convert a single table definition to entity metadata.
    /// </summary>
    private static EntityMetadata ConvertTableToEntityMetadata(
        TableDefinition tableDefinition,
        ApplicationDefinition appDefinition)
    {
        var fields = tableDefinition.Columns
            .Select(col => ConvertColumnToFieldMetadata(col))
            .ToList();

        var associatedForms = appDefinition.Forms
            .Where(f => f.TableLogicalName == tableDefinition.LogicalName)
            .Select(f => f.Name)
            .ToList();

        var associatedViews = appDefinition.Views
            .Where(v => v.TableLogicalName == tableDefinition.LogicalName)
            .Select(v => v.Name)
            .ToList();

        // Extract available event handlers (entity form events in this application)
        var availableEventHandlers = new List<string>();
        
        foreach (var form in appDefinition.Forms.Where(f => f.TableLogicalName == tableDefinition.LogicalName))
        {
            foreach (var evt in form.Events)
            {
                if (!availableEventHandlers.Contains(evt.EventName, StringComparer.OrdinalIgnoreCase))
                {
                    availableEventHandlers.Add(evt.EventName);
                }
            }
        }

        return new EntityMetadata(
            LogicalName: tableDefinition.LogicalName,
            DisplayName: tableDefinition.DisplayName ?? tableDefinition.LogicalName,
            PluralName: tableDefinition.DisplayCollectionName ?? tableDefinition.EntitySetName,
            Fields: fields,
            AvailableEventHandlers: availableEventHandlers,
            AssociatedForms: associatedForms,
            AssociatedViews: associatedViews,
            ExtendedMetadata: BuildExtendedMetadata(tableDefinition)
        );
    }

    /// <summary>
    /// Convert a column definition to field metadata.
    /// </summary>
    private static FieldMetadata ConvertColumnToFieldMetadata(ColumnDefinition columnDefinition)
    {
        return new FieldMetadata(
            LogicalName: columnDefinition.LogicalName,
            DisplayName: columnDefinition.DisplayName ?? columnDefinition.LogicalName,
            AttributeType: columnDefinition.AttributeType,
            Format: columnDefinition.Format,
            MaxLength: columnDefinition.MaxLength ?? -1,
            Required: columnDefinition.RequiredLevel == ColumnRequiredLevel.Required ||
                      columnDefinition.RequiredLevel == ColumnRequiredLevel.SystemRequired,
            IsCustom: false, // From app.json we can't easily determine this, default to false
            ExtendedProperties: BuildFieldExtendedProperties(columnDefinition)
        );
    }

    /// <summary>
    /// Build extended metadata properties for a table.
    /// </summary>
    private static Dictionary<string, string> BuildExtendedMetadata(TableDefinition tableDefinition)
    {
        var extended = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        if (!string.IsNullOrEmpty(tableDefinition.EntitySetName))
            extended["EntitySetName"] = tableDefinition.EntitySetName;

        extended["PrimaryIdAttribute"] = tableDefinition.PrimaryIdAttribute;

        if (!string.IsNullOrEmpty(tableDefinition.PrimaryNameAttribute))
            extended["PrimaryNameAttribute"] = tableDefinition.PrimaryNameAttribute;

        extended["IsActivity"] = tableDefinition.IsActivity.ToString();
        extended["ObjectTypeCode"] = tableDefinition.ObjectTypeCode.ToString(System.Globalization.CultureInfo.InvariantCulture);
        extended["IsCustomizable"] = tableDefinition.IsCustomizable.ToString();

        return extended;
    }

    /// <summary>
    /// Build extended properties for a field.
    /// </summary>
    private static Dictionary<string, object>? BuildFieldExtendedProperties(ColumnDefinition columnDefinition)
    {
        var extended = new Dictionary<string, object>();

        extended["CanRead"] = columnDefinition.CanRead;
        extended["CanCreate"] = columnDefinition.CanCreate;
        extended["CanUpdate"] = columnDefinition.CanUpdate;
        extended["IsSecured"] = columnDefinition.IsSecured;
        extended["RequiredLevel"] = columnDefinition.RequiredLevel.ToString();

        if (columnDefinition.Precision.HasValue)
            extended["Precision"] = columnDefinition.Precision.Value;

        if (columnDefinition.MinimumValue.HasValue)
            extended["MinimumValue"] = columnDefinition.MinimumValue.Value;

        if (columnDefinition.MaximumValue.HasValue)
            extended["MaximumValue"] = columnDefinition.MaximumValue.Value;

        if (columnDefinition.DefaultValue != null)
            extended["DefaultValue"] = columnDefinition.DefaultValue;

        if (columnDefinition.Options.Count > 0)
        {
            var options = columnDefinition.Options.ToDictionary(
                o => o.Value.ToString(System.Globalization.CultureInfo.InvariantCulture),
                o => o.Label as object
            );
            extended["Options"] = options;
        }

        if (columnDefinition.LookupTargets.Count > 0)
            extended["LookupTargets"] = columnDefinition.LookupTargets.ToList();

        return extended.Count > 0 ? extended : null;
    }
}
