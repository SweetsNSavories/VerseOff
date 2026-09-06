namespace VerseOff.Domain;

public sealed record ModelValidationIssue(
    string Code,
    string Path,
    string Message);

public sealed record ModelValidationResult(
    IReadOnlyList<ModelValidationIssue> Issues)
{
    public bool IsValid => Issues.Count == 0;
}

public static class ApplicationDefinitionValidator
{
    public static ModelValidationResult Validate(ApplicationDefinition app)
    {
        ArgumentNullException.ThrowIfNull(app);

        var issues = new List<ModelValidationIssue>();
        ValidateIdentity(app, issues);

        var tables = app.Tables
            .GroupBy(table => table.LogicalName, StringComparer.OrdinalIgnoreCase)
            .ToArray();
        AddDuplicateIssues(tables, "duplicate-table", "tables", issues);

        var tableMap = tables
            .Where(group => group.Count() == 1)
            .ToDictionary(
                group => group.Key,
                group => group.Single(),
                StringComparer.OrdinalIgnoreCase);

        foreach (var table in app.Tables)
        {
            ValidateTable(table, issues);
        }

        foreach (var form in app.Forms)
        {
            ValidateForm(form, tableMap, issues);
        }

        foreach (var navigation in app.Navigation)
        {
            if (navigation.TableLogicalName is not null
                && !tableMap.ContainsKey(navigation.TableLogicalName))
            {
                issues.Add(new(
                    "unknown-navigation-table",
                    $"navigation/{navigation.Id}",
                    $"Navigation references unknown table '{navigation.TableLogicalName}'."));
            }
        }

        if (app.OfflineProfile is not null)
        {
            foreach (var item in app.OfflineProfile.Items)
            {
                if (!tableMap.ContainsKey(item.TableLogicalName))
                {
                    issues.Add(new(
                        "unknown-profile-table",
                        $"offlineProfile/{item.TableLogicalName}",
                        $"Offline profile references unknown table '{item.TableLogicalName}'."));
                }
            }
        }

        return new(issues);
    }

    private static void ValidateIdentity(
        ApplicationDefinition app,
        List<ModelValidationIssue> issues)
    {
        if (app.AppModuleId == Guid.Empty)
        {
            issues.Add(new(
                "missing-app-id",
                "appModuleId",
                "The model-driven app ID is required."));
        }

        if (string.IsNullOrWhiteSpace(app.UniqueName))
        {
            issues.Add(new(
                "missing-app-name",
                "uniqueName",
                "The model-driven app unique name is required."));
        }

        if (!IntegrityHash.IsSha256(app.SourceHash))
        {
            issues.Add(new(
                "invalid-source-hash",
                "sourceHash",
                "The source hash must be a 64-character SHA-256 value."));
        }
    }

    private static void ValidateTable(
        TableDefinition table,
        List<ModelValidationIssue> issues)
    {
        var path = $"tables/{table.LogicalName}";
        if (string.IsNullOrWhiteSpace(table.LogicalName)
            || string.IsNullOrWhiteSpace(table.EntitySetName)
            || string.IsNullOrWhiteSpace(table.PrimaryIdAttribute))
        {
            issues.Add(new(
                "incomplete-table",
                path,
                "A table requires logical, entity-set, and primary-ID names."));
        }

        AddDuplicateIssues(
            table.Columns.GroupBy(
                column => column.LogicalName,
                StringComparer.OrdinalIgnoreCase),
            "duplicate-column",
            $"{path}/columns",
            issues);

        if (!table.Columns.Any(column =>
                string.Equals(
                    column.LogicalName,
                    table.PrimaryIdAttribute,
                    StringComparison.OrdinalIgnoreCase)))
        {
            issues.Add(new(
                "missing-primary-id-column",
                path,
                $"Primary ID column '{table.PrimaryIdAttribute}' is not defined."));
        }
    }

    private static void ValidateForm(
        FormDefinition form,
        Dictionary<string, TableDefinition> tables,
        List<ModelValidationIssue> issues)
    {
        var path = $"forms/{form.FormId:D}";
        if (!tables.TryGetValue(form.TableLogicalName, out var table))
        {
            issues.Add(new(
                "unknown-form-table",
                path,
                $"Form references unknown table '{form.TableLogicalName}'."));
            return;
        }

        var columns = table.Columns
            .Select(column => column.LogicalName)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        foreach (var control in EnumerateControls(form))
        {
            if (control.DataFieldName is not null
                && !columns.Contains(control.DataFieldName))
            {
                issues.Add(new(
                    "unknown-control-column",
                    $"{path}/controls/{control.Id}",
                    $"Control references unknown column '{control.DataFieldName}'."));
            }
        }
    }

    private static IEnumerable<FormControlDefinition> EnumerateControls(
        FormDefinition form)
    {
        foreach (var control in form.HeaderControls)
        {
            yield return control;
        }

        foreach (var control in form.FooterControls)
        {
            yield return control;
        }

        foreach (var control in form.HiddenControls)
        {
            yield return control;
        }

        foreach (var tab in form.Tabs)
        {
            foreach (var column in tab.Columns)
            {
                foreach (var section in column.Sections)
                {
                    foreach (var row in section.Rows)
                    {
                        foreach (var cell in row.Cells)
                        {
                            if (cell.Control is not null)
                            {
                                yield return cell.Control;
                            }
                        }
                    }
                }
            }
        }
    }

    private static void AddDuplicateIssues<T>(
        IEnumerable<IGrouping<string, T>> groups,
        string code,
        string path,
        List<ModelValidationIssue> issues)
    {
        foreach (var group in groups.Where(group => group.Count() > 1))
        {
            issues.Add(new(
                code,
                $"{path}/{group.Key}",
                $"'{group.Key}' is defined more than once."));
        }
    }
}
