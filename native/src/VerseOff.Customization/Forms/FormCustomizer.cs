using VerseOff.Customization.Customizations;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Forms;

/// <summary>
/// Service for managing form customizations (fields, sections, tabs, visibility rules)
/// </summary>
public class FormCustomizer
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;
    private readonly List<FormCustomization> _formCustomizations;
    private readonly Dictionary<string, FieldVisibilityRule> _visibilityRules;

    public FormCustomizer(Dictionary<string, EntityMetadata> baselineMetadata)
    {
        ArgumentNullException.ThrowIfNull(baselineMetadata);
        _baselineMetadata = baselineMetadata;
        _formCustomizations = new();
        _visibilityRules = new();
    }

    /// <summary>
    /// Add a new field to a form section
    /// </summary>
    public void AddFieldToSection(
        string formId,
        string entityLogicalName,
        string sectionName,
        string fieldName,
        int position = -1)
    {
        if (!_baselineMetadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found");

        if (entity.GetField(fieldName) == null)
            throw new InvalidOperationException($"Field '{fieldName}' not found on entity '{entityLogicalName}'");

        var form = GetOrCreateForm(formId, entityLogicalName);
        var section = form.SectionChanges?.FirstOrDefault(s => s.SectionName == sectionName);

        if (section == null)
        {
            section = new FormSectionChange(
                sectionName,
                FormSectionChangeType.Modify,
                -1,
                new() { fieldName },
                new()
            );
            form.SectionChanges?.Add(section);
        }
        else if (section.FieldsToAdd != null)
        {
            if (!section.FieldsToAdd.Contains(fieldName))
                section.FieldsToAdd.Add(fieldName);
        }
    }

    /// <summary>
    /// Remove a field from a form section
    /// </summary>
    public void RemoveFieldFromSection(
        string formId,
        string entityLogicalName,
        string sectionName,
        string fieldName)
    {
        var form = _formCustomizations.FirstOrDefault(f => f.FormId == formId);
        if (form == null)
            throw new InvalidOperationException($"Form '{formId}' not customized");

        var section = form.SectionChanges?.FirstOrDefault(s => s.SectionName == sectionName);
        if (section == null)
        {
            // Create new section for removal if it doesn't exist
            section = new FormSectionChange(
                sectionName,
                FormSectionChangeType.Modify,
                -1,
                new(),
                new() { fieldName }
            );
            form.SectionChanges?.Add(section);
        }
        else if (section.FieldsToRemove != null)
        {
            if (!section.FieldsToRemove.Contains(fieldName))
                section.FieldsToRemove.Add(fieldName);
        }
    }

    /// <summary>
    /// Add a new section to a form tab
    /// </summary>
    public void AddSectionToTab(
        string formId,
        string entityLogicalName,
        string tabName,
        string sectionName,
        int position = -1)
    {
        var form = GetOrCreateForm(formId, entityLogicalName);
        var tab = form.TabChanges?.FirstOrDefault(t => t.TabName == tabName);

        if (tab == null)
        {
            tab = new FormTabChange(
                tabName,
                FormTabChangeType.Modify,
                -1,
                new() { sectionName },
                new()
            );
            form.TabChanges?.Add(tab);
        }
        else if (tab.SectionsToAdd != null)
        {
            if (!tab.SectionsToAdd.Contains(sectionName))
                tab.SectionsToAdd.Add(sectionName);
        }
    }

    /// <summary>
    /// Reorder sections within a tab
    /// </summary>
    public void ReorderSections(
        string formId,
        string entityLogicalName,
        string tabName,
        Dictionary<string, int> sectionOrder)
    {
        var form = GetOrCreateForm(formId, entityLogicalName);
        var tab = form.TabChanges?.FirstOrDefault(t => t.TabName == tabName);

        if (tab == null)
        {
            tab = new FormTabChange(
                tabName,
                FormTabChangeType.Modify,
                -1,
                null,
                null
            );
            form.TabChanges?.Add(tab);
        }

        foreach (var (sectionName, order) in sectionOrder)
        {
            var section = form.SectionChanges?.FirstOrDefault(s => s.SectionName == sectionName);
            if (section == null)
            {
                section = new FormSectionChange(
                    sectionName,
                    FormSectionChangeType.Reorder,
                    order
                );
                form.SectionChanges?.Add(section);
            }
        }
    }

    /// <summary>
    /// Add a visibility rule for a field
    /// </summary>
    public void SetFieldVisibility(
        string formId,
        string fieldName,
        VisibilityCondition condition)
    {
        ArgumentNullException.ThrowIfNull(condition);
        
        var ruleKey = $"{formId}:{fieldName}";
        _visibilityRules[ruleKey] = new FieldVisibilityRule(fieldName, condition);
    }

    /// <summary>
    /// Get visibility rules for a form
    /// </summary>
    public IEnumerable<FieldVisibilityRule> GetVisibilityRules(string formId)
    {
        return _visibilityRules.Values
            .Where(r => r.FieldName != null);
    }

    /// <summary>
    /// Validate form customizations against baseline metadata
    /// </summary>
    public FormValidationResult ValidateForm(string formId, string entityLogicalName)
    {
        var issues = new List<string>();
        var warnings = new List<string>();

        if (!_baselineMetadata.TryGetValue(entityLogicalName, out var entity))
        {
            issues.Add($"Entity '{entityLogicalName}' not found");
            return new FormValidationResult(false, issues, warnings);
        }

        var form = _formCustomizations.FirstOrDefault(f => f.FormId == formId);
        if (form == null)
            return new FormValidationResult(true, issues, warnings);

        // Validate field references
        var allFieldsReferenced = new HashSet<string>();
        foreach (var section in form.SectionChanges ?? new())
        {
            foreach (var field in section.FieldsToAdd ?? new())
            {
                if (entity.GetField(field) == null)
                    issues.Add($"Field '{field}' not found on entity '{entityLogicalName}'");
                allFieldsReferenced.Add(field);
            }
        }

        // Check for field removal conflicts
        foreach (var section in form.SectionChanges ?? new())
        {
            foreach (var field in section.FieldsToRemove ?? new())
            {
                if (allFieldsReferenced.Contains(field))
                    issues.Add($"Cannot remove field '{field}' - it's used in section '{section.SectionName}'");
            }
        }

        // Warn about duplicate section names
        var sectionNames = (form.SectionChanges ?? new()).Select(s => s.SectionName).ToList();
        var duplicates = sectionNames.GroupBy(x => x).Where(g => g.Count() > 1).Select(g => g.Key);
        foreach (var dup in duplicates)
            warnings.Add($"Multiple changes to section '{dup}' - may cause ordering issues");

        return new FormValidationResult(issues.Count == 0, issues, warnings);
    }

    /// <summary>
    /// Get all form customizations for an entity
    /// </summary>
    public IEnumerable<FormCustomization> GetFormCustomizations(string entityLogicalName)
    {
        return _formCustomizations.Where(f => f.EntityLogicalName == entityLogicalName);
    }

    /// <summary>
    /// Get a specific form customization
    /// </summary>
    public FormCustomization? GetFormCustomization(string formId)
    {
        return _formCustomizations.FirstOrDefault(f => f.FormId == formId);
    }

    /// <summary>
    /// Delete a form customization
    /// </summary>
    public bool DeleteFormCustomization(string formId)
    {
        var form = _formCustomizations.FirstOrDefault(f => f.FormId == formId);
        if (form == null)
            return false;

        _formCustomizations.Remove(form);

        // Clean up visibility rules
        var keysToRemove = _visibilityRules
            .Keys.Where(k => k.StartsWith($"{formId}:", StringComparison.Ordinal))
            .ToList();
        
        foreach (var key in keysToRemove)
            _visibilityRules.Remove(key);

        return true;
    }

    private FormCustomization GetOrCreateForm(string formId, string entityLogicalName)
    {
        var form = _formCustomizations.FirstOrDefault(f => f.FormId == formId);
        if (form == null)
        {
            form = new FormCustomization(
                formId,
                entityLogicalName,
                new(),
                new()
            );
            _formCustomizations.Add(form);
        }
        return form;
    }
}

/// <summary>
/// Visibility rule for a form field
/// </summary>
public record FieldVisibilityRule(
    string FieldName,
    VisibilityCondition Condition
);

/// <summary>
/// Condition for field visibility
/// </summary>
public record VisibilityCondition(
    VisibilityOperator Operator,
    string FieldName,
    object TargetValue,
    string? LogicalOperator = null,
    VisibilityCondition? ChainedCondition = null
)
{
    /// <summary>
    /// Evaluate condition against field values
    /// </summary>
    public bool Evaluate(Dictionary<string, object> fieldValues)
    {
        if (!fieldValues.TryGetValue(FieldName, out var value))
            return false;

        var conditionMet = Operator switch
        {
            VisibilityOperator.Equals => value?.Equals(TargetValue) ?? false,
            VisibilityOperator.NotEquals => !value?.Equals(TargetValue) ?? true,
            VisibilityOperator.GreaterThan => CompareValues(value, TargetValue) > 0,
            VisibilityOperator.LessThan => CompareValues(value, TargetValue) < 0,
            VisibilityOperator.Contains => value?.ToString()?.Contains(TargetValue?.ToString() ?? "") ?? false,
            VisibilityOperator.IsEmpty => string.IsNullOrWhiteSpace(value?.ToString()),
            VisibilityOperator.IsNotEmpty => !string.IsNullOrWhiteSpace(value?.ToString()),
            _ => false
        };

        if (ChainedCondition == null)
            return conditionMet;

        return LogicalOperator switch
        {
            "AND" => conditionMet && ChainedCondition.Evaluate(fieldValues),
            "OR" => conditionMet || ChainedCondition.Evaluate(fieldValues),
            _ => conditionMet
        };
    }

    private static int CompareValues(object? a, object? b)
    {
        if (a == null || b == null)
            return 0;

        if (a is IComparable aComparable)
            return aComparable.CompareTo(b);

        return 0;
    }
}

public enum VisibilityOperator
{
    Equals,
    NotEquals,
    GreaterThan,
    LessThan,
    Contains,
    IsEmpty,
    IsNotEmpty
}

/// <summary>
/// Result of form validation
/// </summary>
public record FormValidationResult(
    bool IsValid,
    List<string> Issues,
    List<string> Warnings
);
