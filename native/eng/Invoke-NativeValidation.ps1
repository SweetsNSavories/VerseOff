[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$nativeRoot = Split-Path -Parent $PSScriptRoot
$solution = Join-Path $nativeRoot "VerseOff.Native.sln"

dotnet tool restore --tool-manifest (Join-Path $nativeRoot "dotnet-tools.json")
if ($LASTEXITCODE -ne 0) { throw "Tool restore failed." }

dotnet restore $solution
if ($LASTEXITCODE -ne 0) { throw "Solution restore failed." }

dotnet build $solution -c Release --no-restore
if ($LASTEXITCODE -ne 0) { throw "Release build failed." }

dotnet test $solution -c Release --no-build
if ($LASTEXITCODE -ne 0) { throw "Native tests failed." }

dotnet list $solution package --vulnerable --include-transitive
if ($LASTEXITCODE -ne 0) { throw "Dependency audit failed." }
