namespace VerseOff.Maker;

public class ConsoleFormatter
{
    private readonly bool _verbose;
    private readonly object _lock = new();

    public ConsoleFormatter(bool verbose = false)
    {
        _verbose = verbose;
    }

    public void Step(string message)
    {
        lock (_lock)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("✓ ");
            Console.ResetColor();
            Console.WriteLine(message);
        }
    }

    public void Substep(string message)
    {
        if (!_verbose) return;
        lock (_lock)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write("  • ");
            Console.ResetColor();
            Console.WriteLine(message);
        }
    }

    public void Info(string message)
    {
        if (!_verbose) return;
        lock (_lock)
        {
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine($"    {message}");
            Console.ResetColor();
        }
    }

    public void Error(string message)
    {
        lock (_lock)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("✗ ");
            Console.ResetColor();
            Console.WriteLine(message);
        }
    }

    public void Warning(string message)
    {
        lock (_lock)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write("⚠ ");
            Console.ResetColor();
            Console.WriteLine(message);
        }
    }

    public void Summary(string label, string value)
    {
        lock (_lock)
        {
            Console.Write($"  {label}: ");
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(value);
            Console.ResetColor();
        }
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1822:Mark members as static")]
    public void BlankLine()
    {
        Console.WriteLine();
    }
}
