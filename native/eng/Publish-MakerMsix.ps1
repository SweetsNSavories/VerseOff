[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidatePattern("^[A-Fa-f0-9]{40}$")]
    [string] $CertificateThumbprint,

    [ValidateSet("win-x64", "win-arm64")]
    [string] $RuntimeIdentifier = "win-x64"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$certificate = Get-ChildItem -LiteralPath (
    "Cert:\CurrentUser\My\" + $CertificateThumbprint
)
if ($null -eq $certificate -or -not $certificate.HasPrivateKey) {
    throw "The requested signing certificate is unavailable or has no private key."
}

$nativeRoot = Split-Path -Parent $PSScriptRoot
$project = Join-Path $nativeRoot "src\VerseOff.App\VerseOff.App.csproj"

dotnet publish $project `
    -f net10.0-windows10.0.19041.0 `
    -c Release `
    -p:RuntimeIdentifierOverride=$RuntimeIdentifier `
    -p:WindowsPackageType=Package `
    -p:AppxPackageSigningEnabled=true `
    -p:PackageCertificateThumbprint=$CertificateThumbprint

if ($LASTEXITCODE -ne 0) {
    throw "Signed MSIX publication failed."
}
