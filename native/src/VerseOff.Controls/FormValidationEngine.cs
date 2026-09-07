using VerseOff.ClientApi;
using VerseOff.Domain;

namespace VerseOff.Controls;

public sealed record FormValidationError(
    string AttributeName,
    string DisplayName,
    string Message);

public sealed record FormValidationResult(
    bool IsValid,
    IReadOnlyList<FormValidationError> Errors)
{
    public static FormValidationResult Success { get; } = new(true, []);

    public string Summary => IsValid
        ? "Form is valid."
        : string.Join(Environment.NewLine, Errors.Select(e => $"• {e.DisplayName}: {e.Message}"));
}

public static class FormValidationEngine
{
    public static FormValidationResult Validate(
        TableDefinition table,
        FormDefinition form,
        FormBindingManager bindingManager)
    {
        ArgumentNullException.ThrowIfNull(table);
        ArgumentNullException.ThrowIfNull(form);
        ArgumentNullException.ThrowIfNull(bindingManager);

        var errors = new List<FormValidationError>();
        var columns = table.Columns.ToDictionary(c => c.LogicalName, StringComparer.OrdinalIgnoreCase);

        foreach (var (attributeName, column) in columns)
        {
            var value = bindingManager.GetValue(attributeName);
            var displayName = column.DisplayName ?? attributeName;

            // 1. Required Level check
            if (column.RequiredLevel is ColumnRequiredLevel.Required or ColumnRequiredLevel.SystemRequired)
            {
                if (value is null || (value is string str && string.IsNullOrWhiteSpace(str)))
                {
                    errors.Add(new FormValidationError(
                        attributeName,
                        displayName,
                        "This field is required."));
                    continue;
                }
            }

            if (value is null)
            {
                continue;
            }

            // 2. Max length check for strings
            if (column.MaxLength.HasValue && value is string s && s.Length > column.MaxLength.Value)
            {
                errors.Add(new FormValidationError(
                    attributeName,
                    displayName,
                    $"Value exceeds maximum length of {column.MaxLength.Value} characters."));
            }

            // 3. Range check for numeric values
            if (value is decimal decVal)
            {
                if (column.MinimumValue.HasValue && decVal < column.MinimumValue.Value)
                {
                    errors.Add(new FormValidationError(
                        attributeName,
                        displayName,
                        $"Value cannot be less than {column.MinimumValue.Value}."));
                }

                if (column.MaximumValue.HasValue && decVal > column.MaximumValue.Value)
                {
                    errors.Add(new FormValidationError(
                        attributeName,
                        displayName,
                        $"Value cannot be greater than {column.MaximumValue.Value}."));
                }
            }
            else if (value is int intVal)
            {
                if (column.MinimumValue.HasValue && intVal < column.MinimumValue.Value)
                {
                    errors.Add(new FormValidationError(
                        attributeName,
                        displayName,
                        $"Value cannot be less than {column.MinimumValue.Value}."));
                }

                if (column.MaximumValue.HasValue && intVal > column.MaximumValue.Value)
                {
                    errors.Add(new FormValidationError(
                        attributeName,
                        displayName,
                        $"Value cannot be greater than {column.MaximumValue.Value}."));
                }
            }
        }

        return errors.Count == 0
            ? FormValidationResult.Success
            : new FormValidationResult(false, errors);
    }
}
