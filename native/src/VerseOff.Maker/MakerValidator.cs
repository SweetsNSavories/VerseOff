namespace VerseOff.Maker;

public class MakerValidator
{
    public static (bool IsValid, List<string> Errors) Validate(MakerOptions options)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(options.InputPath))
        {
            errors.Add("--input is required");
        }
        else if (!File.Exists(options.InputPath))
        {
            errors.Add($"Input file not found: {options.InputPath}");
        }
        else if (!options.InputPath.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Input must be a .zip file (solution package)");
        }
        else
        {
            var fileInfo = new FileInfo(options.InputPath);
            if (fileInfo.Length == 0)
            {
                errors.Add("Input file is empty");
            }
            else if (fileInfo.Length > 500 * 1024 * 1024) // 500 MB limit
            {
                errors.Add($"Input file is too large ({fileInfo.Length / 1024 / 1024} MB, max 500 MB)");
            }
        }

        if (string.IsNullOrWhiteSpace(options.OutputPath))
        {
            options.OutputPath = "./dist";
        }

        try
        {
            var dir = Path.GetDirectoryName(options.OutputPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
        }
        catch (Exception ex)
        {
            errors.Add($"Cannot create output directory: {ex.Message}");
        }

        if (!string.IsNullOrWhiteSpace(options.ConfigPath) && !File.Exists(options.ConfigPath))
        {
            errors.Add($"Domain config file not found: {options.ConfigPath}");
        }

        return (errors.Count == 0, errors);
    }
}
