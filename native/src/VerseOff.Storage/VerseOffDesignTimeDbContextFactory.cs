using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace VerseOff.Storage;

public sealed class VerseOffDesignTimeDbContextFactory
    : IDesignTimeDbContextFactory<VerseOffDbContext>
{
    public VerseOffDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite("Data Source=verseoff-design.db")
            .Options;
        return new(options);
    }
}
