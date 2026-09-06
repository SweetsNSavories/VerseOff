using Microsoft.Extensions.Logging;
using VerseOff.Generator;

namespace VerseOff.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        builder.Services.AddSingleton<INativeSourceGenerator, NativeSourceGenerator>();
        builder.Services.AddSingleton<IMakerWorkflow, MakerWorkflow>();
        builder.Services.AddSingleton<MakerViewModel>();
        builder.Services.AddSingleton<MainPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
