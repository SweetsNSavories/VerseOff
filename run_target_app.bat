@echo off
setlocal
cd /d "%~dp0"
if not exist "C:\vo-target\ContosoService.csproj" (
    echo Generating sample offline target in C:\vo-target...
    dotnet run --project scratch\GenerateSample\GenerateSample.csproj -c Release
)
echo Launching generated native offline client (ContosoService)...
dotnet run --project C:\vo-target\ContosoService.csproj -c Release
