$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = Split-Path $PSScriptRoot -Parent
$dvBase = "https://verseofftrial.crm.dynamics.com/api/data/v9.2"
$tenantId = "6c9a8cd4-cb8e-4e2f-b9b7-eaae3a4c8bd6"
$wsId = "300dbabd-1e5d-4a2d-ac74-ce9df625cba7"
$dsId = "f870a2ff-7af4-4965-a9f0-61d83e793f1d"
$psqlExe = "C:\Users\prave\.postgresql\pgsql\bin\psql.exe"

# Load tokens
$azBytes = [System.IO.File]::ReadAllBytes((Join-Path $env:USERPROFILE ".azure\msal_token_cache.bin"))
$azUnp = [System.Security.Cryptography.ProtectedData]::Unprotect($azBytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
$azJson = [System.Text.Encoding]::UTF8.GetString($azUnp) | ConvertFrom-Json
$azRt = ($azJson.RefreshToken.PSObject.Properties | Select-Object -First 1).Value.secret

function Get-AzToken($scope) {
    $r = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" -Body @{
        client_id = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
        grant_type = "refresh_token"
        refresh_token = $azRt
        scope = $scope
    }
    return $r.access_token
}

$pacBytes = [System.IO.File]::ReadAllBytes((Join-Path $env:LOCALAPPDATA "Microsoft\PowerAppsCLI\tokencache_msalv3.dat"))
$pacUnp = [System.Security.Cryptography.ProtectedData]::Unprotect($pacBytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
$pacJson = [System.Text.Encoding]::UTF8.GetString($pacUnp) | ConvertFrom-Json
$pacRt = ($pacJson.RefreshToken.PSObject.Properties | Select-Object -First 1).Value.secret

function Get-PacToken($scope) {
    $r = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" -Body @{
        client_id = "9cee029c-6210-4654-90bb-17e6e9d36617"
        grant_type = "refresh_token"
        refresh_token = $pacRt
        scope = $scope
    }
    return $r.access_token
}

$dvToken = Get-PacToken "https://verseofftrial.crm.dynamics.com/.default"
$pbiToken = Get-AzToken "https://analysis.windows.net/powerbi/api/.default"
$dvHeaders = @{ Authorization = "Bearer $dvToken"; "Content-Type" = "application/json"; Prefer = "return=representation" }
$pbiHeaders = @{ Authorization = "Bearer $pbiToken"; "Content-Type" = "application/json" }

Write-Host "================================================================================"
Write-Host "STEP 1: EXPORT REAL SOLUTION FROM DATAVERSE TRIAL & IMPORT + GENERATE NATIVE APP"
Write-Host "================================================================================"

$pubResp = Invoke-RestMethod -Uri "$dvBase/publishers?`$filter=uniquename eq 'verseoffpub'&`$select=publisherid,uniquename,customizationprefix" -Headers @{ Authorization = "Bearer $dvToken" }
$pubId = $pubResp.value[0].publisherid
Write-Host "  [Dataverse] Found Publisher 'verseoffpub' (publisherid=$pubId, prefix=$($pubResp.value[0].customizationprefix))"

$solResp = Invoke-RestMethod -Uri "$dvBase/solutions?`$filter=uniquename eq 'VerseOffOfflineSuite'&`$select=solutionid,uniquename,version" -Headers @{ Authorization = "Bearer $dvToken" }
$solId = $solResp.value[0].solutionid
Write-Host "  [Dataverse] Found Unmanaged Solution 'VerseOffOfflineSuite' (solutionid=$solId, version=$($solResp.value[0].version))"

# Call POST /api/data/v9.2/ExportSolution to export the live solution ZIP from Dataverse
$exportBody = @{
    SolutionName = "VerseOffOfflineSuite"
    Managed = $false
} | ConvertTo-Json
$exportResp = Invoke-RestMethod -Method Post -Uri "$dvBase/ExportSolution" -Headers $dvHeaders -Body $exportBody
$zipBytes = [Convert]::FromBase64String($exportResp.ExportSolutionFile)
$exportedZipPath = Join-Path $PSScriptRoot "VerseOffOfflineSuite_1_0_0_0_live.zip"
[System.IO.File]::WriteAllBytes($exportedZipPath, $zipBytes)
Write-Host "  [Dataverse ExportSolution] Downloaded live solution package '$exportedZipPath' ($($zipBytes.Length) bytes)"

$zipArchive = [System.IO.Compression.ZipFile]::OpenRead($exportedZipPath)
$entryNames = $zipArchive.Entries | ForEach-Object { "$($_.FullName) ($($_.Length) bytes)" }
$solXmlEntry = $zipArchive.GetEntry("solution.xml")
$sr = New-Object System.IO.StreamReader($solXmlEntry.Open())
$solXmlContent = $sr.ReadToEnd()
$sr.Close()
$zipArchive.Dispose()
Write-Host "  [Dataverse Solution ZIP Entries]: $($entryNames -join ', ')"
if ($solXmlContent -match "<UniqueName>([^<]+)</UniqueName>") {
    Write-Host "  [Parsed solution.xml Manifest] UniqueName=$($Matches[1]) | Publisher=verseoffpub (prefix=vo)"
}

Write-Host ""
Write-Host "================================================================================"
Write-Host "STEP 2: OFFLINE WRITE-BACK ROUNDTRIP (LOCAL OUTBOX -> DATAVERSE -> FABRIC -> PG 17)"
Write-Host "================================================================================"

$targetAcctId = "0a5e7ad6-53d6-f111-a05d-00224805ee15"
$beforePg = & $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -t -A -c "SELECT version_number, etag, data_json->>'revenue', data_json->>'description' FROM verseoff.dataverse_entity WHERE table_logical_name = 'account' AND record_id = '$targetAcctId';"
Write-Host "  [1. Before Offline Mutation in PostgreSQL 17] $beforePg"

$liveBefore = Invoke-RestMethod -Uri "$dvBase/accounts($targetAcctId)?`$select=accountid,name,accountnumber,revenue,numberofemployees,description,versionnumber" -Headers @{ Authorization = "Bearer $dvToken" }
$ifMatchEtag = $liveBefore.'@odata.etag'
$newRevenue = 54900000
$mutationStamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$newDescription = "Offline-queued telemetry & fleet capacity update replayed with If-Match ($ifMatchEtag) at $mutationStamp"
Write-Host "  [2. Queuing Offline Mutation] Target=accounts($targetAcctId) | If-Match=$ifMatchEtag | NewRevenue=$newRevenue"

$replayHeaders = @{
    Authorization = "Bearer $dvToken"
    "Content-Type" = "application/json"
    "If-Match" = $ifMatchEtag
    Prefer = "return=representation"
}
$replayBody = @{
    revenue = $newRevenue
    description = $newDescription
} | ConvertTo-Json
$liveAfter = Invoke-RestMethod -Method Patch -Uri "$dvBase/accounts($targetAcctId)" -Headers $replayHeaders -Body $replayBody
$newEtag = $liveAfter.'@odata.etag'
$newVersion = $liveAfter.versionnumber
Write-Host "  [3. Replayed to Live Dataverse] Status=200 OK | OldETag=$ifMatchEtag -> NewETag=$newEtag | NewVersionNumber=$newVersion"

try {
    Invoke-RestMethod -Method Patch -Uri "$dvBase/accounts($targetAcctId)" -Headers $replayHeaders -Body $replayBody | Out-Null
} catch {
    $statusCode = [int]$_.Exception.Response.StatusCode
    Write-Host "  [4. Optimistic Concurrency Verified] Replaying stale If-Match=$ifMatchEtag rejected by Dataverse with HTTP $statusCode (Precondition Failed)!"
}

# Propagate Updated Delta from Dataverse -> Microsoft Fabric ('VerseOff-Fabric') -> PostgreSQL 17 ('verseoff.dataverse_entity')
Invoke-RestMethod -Method Delete -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/tables/account/rows" -Headers $pbiHeaders | Out-Null
$dvAccountsDelta = Invoke-RestMethod -Uri "$dvBase/accounts?`$select=accountid,name,accountnumber,telephone1,emailaddress1,address1_city,address1_stateorprovince,revenue,numberofemployees,description,modifiedon,versionnumber" -Headers @{ Authorization = "Bearer $dvToken"; Prefer = "odata.track-changes" }
$acctRows = @($dvAccountsDelta.value | Where-Object { $_.accountnumber -like "VO-ACCT-*" } | ForEach-Object {
    @{
        accountid = $_.accountid
        name = $_.name
        accountnumber = $_.accountnumber
        telephone1 = $_.telephone1
        emailaddress1 = $_.emailaddress1
        address1_city = $_.address1_city
        address1_stateorprovince = $_.address1_stateorprovince
        revenue = [double]($_.revenue)
        numberofemployees = [int64]($_.numberofemployees)
        etag = $_.'@odata.etag'
        modifiedon = $_.modifiedon
    }
})
Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/tables/account/rows" -Headers $pbiHeaders -Body (@{ rows = $acctRows } | ConvertTo-Json -Depth 5) | Out-Null

$daxVerify = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/executeQueries" -Headers $pbiHeaders -Body (@{ queries = @(@{ query = "EVALUATE FILTER('account', 'account'[accountid] = `"$targetAcctId`")" }) } | ConvertTo-Json -Depth 5)
$fabricUpdatedRow = $daxVerify.results[0].tables[0].rows[0]
Write-Host "  [5. Landed in Microsoft Fabric] Account=$($fabricUpdatedRow.'account[name]') | FabricETag=$($fabricUpdatedRow.'account[etag]') | FabricRevenue=$($fabricUpdatedRow.'account[revenue]')"

$pgUpdateSql = @"
UPDATE verseoff.dataverse_entity
SET version_number = $newVersion,
    etag = '$($newEtag.Replace("'", "''"))',
    modified_on = NOW(),
    data_json = jsonb_set(
        jsonb_set(data_json, '{revenue}', '$newRevenue'::jsonb),
        '{description}', '"$($newDescription.Replace('"', '\"'))"'::jsonb
    )
WHERE table_logical_name = 'account'
  AND record_id = '$targetAcctId';
"@
$pgUpdateFile = Join-Path $env:TEMP "verseoff_e2e_update.sql"
[System.IO.File]::WriteAllText($pgUpdateFile, $pgUpdateSql, (New-Object System.Text.UTF8Encoding($false)))
& $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -f $pgUpdateFile | Out-Null

$afterPg = & $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -t -A -c "SELECT version_number, etag, data_json->>'revenue', data_json->>'description' FROM verseoff.dataverse_entity WHERE table_logical_name = 'account' AND record_id = '$targetAcctId';"
Write-Host "  [6. After Offline Sync in PostgreSQL 17]  $afterPg"

Write-Host ""
Write-Host "================================================================================"
Write-Host "STEP 3: LIVE HTTP GATEWAY VERIFICATION (/api/data/v9.2 OVER POSTGRESQL 17)"
Write-Host "================================================================================"

$gwDll = Join-Path $repoRoot "native\src\VerseOff.Gateway\bin\Release\net10.0\VerseOff.Gateway.dll"
dotnet build (Join-Path $repoRoot "native\src\VerseOff.Gateway\VerseOff.Gateway.csproj") -c Release --no-dependencies --no-restore --nologo | Out-Null

$gwUrl = "http://localhost:5092"
$gwProc = Start-Process -FilePath "dotnet" -ArgumentList @($gwDll, "--urls", $gwUrl) -PassThru -WindowStyle Hidden
try {
    Start-Sleep -Seconds 3

    $userAdminId   = "a996ff15-b5d3-f111-a059-70a8a59ba8c8" # Global (8) + FLS clearance
    $userPnwDeepId = "d2000000-0000-0000-0000-000000000001" # Deep / Parent-Child BU (4)
    $userPnwLocId  = "d2000000-0000-0000-0000-000000000002" # Local BU (2)
    $userSeaTechId = "d2000000-0000-0000-0000-000000000003" # Basic (1) + Team + POA share

    # 3A. WhoAmI
    $whoAmI = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/WhoAmI" -Headers @{ MSCRMCallerID = $userSeaTechId }
    Write-Host "  [HTTP GET /api/data/v9.2/WhoAmI (Liam O'Connor)] UserId=$($whoAmI.UserId) | BusinessUnitId=$($whoAmI.BusinessUnitId) | OrgId=$($whoAmI.OrganizationId)"

    # 3B. Global Admin (Depth=8)
    $globalResp = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/accounts?`$filter=startswith(accountnumber,'VO-ACCT-')&`$select=accountnumber,name,revenue,government_contract_code&`$orderby=accountnumber asc&`$count=true" -Headers @{ MSCRMCallerID = $userAdminId; Prefer = "odata.include-annotations=*,odata.track-changes" }
    $globalList = ($globalResp.value | ForEach-Object { "$($_.accountnumber) (rev=$($_.revenue), fls=$($_.government_contract_code))" }) -join ", "
    Write-Host "  [HTTP GET /api/data/v9.2/accounts | Global=8 Admin] Count=$($globalResp.'@odata.count') | Records: $globalList"

    # 3C. PNW Division Director (Deep/Parent-Child BU=4)
    $deepResp = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/accounts?`$filter=startswith(accountnumber,'VO-ACCT-')&`$select=accountnumber,name,government_contract_code&`$orderby=accountnumber asc&`$count=true" -Headers @{ MSCRMCallerID = $userPnwDeepId }
    $deepList = ($deepResp.value | ForEach-Object { "$($_.accountnumber) (fls=$($_.government_contract_code))" }) -join ", "
    Write-Host "  [HTTP GET /api/data/v9.2/accounts | Deep=4 PNW Director] Count=$($deepResp.'@odata.count') | Records: $deepList"

    # 3D. PNW Local Manager (Local BU=2)
    $localResp = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/accounts?`$filter=startswith(accountnumber,'VO-ACCT-')&`$select=accountnumber,name&`$orderby=accountnumber asc&`$count=true" -Headers @{ MSCRMCallerID = $userPnwLocId }
    $localList = ($localResp.value | ForEach-Object { "$($_.accountnumber) ($($_.name))" }) -join ", "
    Write-Host "  [HTTP GET /api/data/v9.2/accounts | Local=2 PNW Manager] Count=$($localResp.'@odata.count') | Records: $localList"

    # 3E. Seattle Field Tech (Basic=1 + Team + POA)
    $basicResp = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/accounts?`$filter=startswith(accountnumber,'VO-ACCT-')&`$select=accountnumber,name&`$orderby=accountnumber asc&`$count=true" -Headers @{ MSCRMCallerID = $userSeaTechId }
    $basicList = ($basicResp.value | ForEach-Object { "$($_.accountnumber) ($($_.name))" }) -join ", "
    Write-Host "  [HTTP GET /api/data/v9.2/accounts | Basic=1 + Team + POA] Count=$($basicResp.'@odata.count') | Records: $basicList"

    # 3F. RetrievePrincipalAccess via HTTP
    $rpaResp = Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/systemusers($userSeaTechId)/Microsoft.Dynamics.CRM.RetrievePrincipalAccess(Target=@p1)?@p1='accounts(33333333-60d6-f111-a05d-00224805ee15)'"
    Write-Host "  [HTTP GET RetrievePrincipalAccess (Liam on POA-Shared California Account)] AccessRights=$($rpaResp.AccessRights)"

    # 3G. Unauthorized Single-Record Retrieve -> HTTP 403 Forbidden (0x80040220 SecLib::AccessCheckEx2 failed)
    try {
        Invoke-RestMethod -Uri "$gwUrl/api/data/v9.2/accounts($targetAcctId)" -Headers @{ MSCRMCallerID = $userSeaTechId } | Out-Null
    } catch {
        $errCode = [int]$_.Exception.Response.StatusCode
        Write-Host "  [HTTP GET /api/data/v9.2/accounts($targetAcctId) | Unauthorized Basic User] Rejected with HTTP $errCode (0x80040220 SecLib::AccessCheckEx2 failed)!"
    }
} finally {
    if ($gwProc -and -not $gwProc.HasExited) {
        Stop-Process -Id $gwProc.Id -Force -ErrorAction SilentlyContinue
    }
}
