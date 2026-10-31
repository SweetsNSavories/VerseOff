@echo off
setlocal
cd /d "%~dp0"
echo Launching VerseOff Native Maker Studio (.NET 10 / WinUI 3)...
dotnet run --project native\src\VerseOff.App\VerseOff.App.csproj -c Release
