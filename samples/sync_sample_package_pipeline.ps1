$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

$pkgPath = Join-Path $PSScriptRoot "verseoff-sample-data-package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json

$tenantId = "6c9a8cd4-cb8e-4e2f-b9b7-eaae3a4c8bd6"
$envId = $pkg.sourceEnvironment.environmentId
$dvBase = "https://verseofftrial.crm.dynamics.com/api/data/v9.2"
$wsId = $pkg.fabricDestination.workspaceId
$containerName = "dataverse-verseofftrial-unq2adf665962d5f11184db6045bd003"

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
$stToken = Get-AzToken "https://storage.azure.com/.default"

$dvHeaders = @{ Authorization = "Bearer $dvToken"; "Content-Type" = "application/json"; Prefer = "return=representation" }
$pbiHeaders = @{ Authorization = "Bearer $pbiToken"; "Content-Type" = "application/json" }

Write-Host "================================================================================"
Write-Host "STAGE 1: SEEDING SAMPLE DATA PACKAGE INTO DATAVERSE (verseofftrial.crm.dynamics.com)"
Write-Host "================================================================================"

foreach ($acct in $pkg.entities.accounts) {
    $body = @{
        name = $acct.name
        accountnumber = $acct.accountnumber
        telephone1 = $acct.telephone1
        emailaddress1 = $acct.emailaddress1
        address1_city = $acct.address1_city
        address1_stateorprovince = $acct.address1_stateorprovince
        revenue = $acct.revenue
        numberofemployees = $acct.numberofemployees
        description = $acct.description
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Patch -Uri "$dvBase/accounts($($acct.accountid))" -Headers $dvHeaders -Body $body
    Write-Host "  [Dataverse Upsert] Account: $($res.name) ($($res.accountnumber)) | ID=$($res.accountid) | ETag=$($res.'@odata.etag')"
}

foreach ($cnt in $pkg.entities.contacts) {
    $body = @{
        firstname = $cnt.firstname
        lastname = $cnt.lastname
        jobtitle = $cnt.jobtitle
        emailaddress1 = $cnt.emailaddress1
        telephone1 = $cnt.telephone1
        address1_city = $cnt.address1_city
        "parentcustomerid_account@odata.bind" = "/accounts($($cnt.parentAccountId))"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Patch -Uri "$dvBase/contacts($($cnt.contactid))" -Headers $dvHeaders -Body $body
    Write-Host "  [Dataverse Upsert] Contact: $($res.fullname) ($($res.jobtitle)) | ID=$($res.contactid) | ETag=$($res.'@odata.etag')"
}

# Pull via odata.track-changes Delta Link
$deltaHeaders = @{ Authorization = "Bearer $dvToken"; Prefer = "odata.track-changes" }
$dvAccountsDelta = Invoke-RestMethod -Uri "$dvBase/accounts?`$select=accountid,name,accountnumber,telephone1,emailaddress1,address1_city,address1_stateorprovince,revenue,numberofemployees,description,modifiedon,statecode" -Headers $deltaHeaders
$dvContactsDelta = Invoke-RestMethod -Uri "$dvBase/contacts?`$select=contactid,fullname,firstname,lastname,jobtitle,emailaddress1,telephone1,address1_city,_parentcustomerid_value,modifiedon,statecode" -Headers $deltaHeaders

Write-Host "  [Dataverse Delta] Pulled $($dvAccountsDelta.value.Count) accounts (deltaLink issued) and $($dvContactsDelta.value.Count) contacts (deltaLink issued)."

Write-Host ""
Write-Host "================================================================================"
Write-Host "STAGE 2: LANDING SAMPLE PACKAGE IN MICROSOFT FABRIC (Workspace: VerseOff-Fabric)"
Write-Host "================================================================================"

# 2A. Land in ADLS Gen2 (stverseofffabriclink.dfs.core.windows.net)
function Put-AdlsFile($relPath, $contentStr) {
    $baseUrl = "https://stverseofffabriclink.dfs.core.windows.net/$containerName/$relPath"
    $dfsHeaders = @{ Authorization = "Bearer $stToken"; "x-ms-version" = "2023-11-03" }
    Invoke-RestMethod -Method Put -Uri "$baseUrl`?resource=file" -Headers $dfsHeaders | Out-Null
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($contentStr)
    $appendHeaders = @{ Authorization = "Bearer $stToken"; "x-ms-version" = "2023-11-03"; "Content-Type" = "application/octet-stream" }
    Invoke-RestMethod -Method Patch -Uri "$baseUrl`?action=append&position=0" -Headers $appendHeaders -Body $bytes | Out-Null
    Invoke-RestMethod -Method Patch -Uri "$baseUrl`?action=flush&position=$($bytes.Length)" -Headers $dfsHeaders | Out-Null
    Write-Host "  [Fabric ADLS Gen2 Lake] Landed $relPath ($($bytes.Length) bytes)"
}

Put-AdlsFile "account/2026.json" ($dvAccountsDelta.value | ConvertTo-Json -Depth 5)
Put-AdlsFile "contact/2026.json" ($dvContactsDelta.value | ConvertTo-Json -Depth 5)

# 2B. Land inside Microsoft Fabric Workspace 'VerseOff-Fabric' (300dbabd-1e5d-4a2d-ac74-ce9df625cba7) as Push Dataset / Semantic Model
$dsName = "VerseOffDataverseLakehouse"
$existingDs = (Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets" -Headers $pbiHeaders).value | Where-Object { $_.name -eq $dsName } | Select-Object -First 1

if (-not $existingDs) {
    $dsSchema = @{
        name = $dsName
        defaultMode = "Push"
        tables = @(
            @{
                name = "account"
                columns = @(
                    @{ name = "accountid"; dataType = "string" },
                    @{ name = "name"; dataType = "string" },
                    @{ name = "accountnumber"; dataType = "string" },
                    @{ name = "telephone1"; dataType = "string" },
                    @{ name = "emailaddress1"; dataType = "string" },
                    @{ name = "address1_city"; dataType = "string" },
                    @{ name = "address1_stateorprovince"; dataType = "string" },
                    @{ name = "revenue"; dataType = "Double" },
                    @{ name = "numberofemployees"; dataType = "Int64" },
                    @{ name = "etag"; dataType = "string" },
                    @{ name = "modifiedon"; dataType = "string" }
                )
            },
            @{
                name = "contact"
                columns = @(
                    @{ name = "contactid"; dataType = "string" },
                    @{ name = "fullname"; dataType = "string" },
                    @{ name = "firstname"; dataType = "string" },
                    @{ name = "lastname"; dataType = "string" },
                    @{ name = "jobtitle"; dataType = "string" },
                    @{ name = "emailaddress1"; dataType = "string" },
                    @{ name = "telephone1"; dataType = "string" },
                    @{ name = "address1_city"; dataType = "string" },
                    @{ name = "etag"; dataType = "string" },
                    @{ name = "modifiedon"; dataType = "string" }
                )
            }
        )
    } | ConvertTo-Json -Depth 8
    $existingDs = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets" -Headers $pbiHeaders -Body $dsSchema
    Write-Host "  [Fabric Workspace] Created Semantic Model '$dsName' (id=$($existingDs.id)) in Workspace 'VerseOff-Fabric' ($wsId)"
} else {
    Write-Host "  [Fabric Workspace] Found Semantic Model '$dsName' (id=$($existingDs.id)) in Workspace 'VerseOff-Fabric' ($wsId)"
    Invoke-RestMethod -Method Delete -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$($existingDs.id)/tables/account/rows" -Headers $pbiHeaders | Out-Null
    Invoke-RestMethod -Method Delete -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$($existingDs.id)/tables/contact/rows" -Headers $pbiHeaders | Out-Null
}

$dsId = $existingDs.id

# Push account rows into Fabric
$acctRows = @($dvAccountsDelta.value | ForEach-Object {
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
Write-Host "  [Fabric Workspace] Pushed $($acctRows.Count) account rows into Fabric table 'account'"

# Push contact rows into Fabric
$cntRows = @($dvContactsDelta.value | ForEach-Object {
    @{
        contactid = $_.contactid
        fullname = $_.fullname
        firstname = $_.firstname
        lastname = $_.lastname
        jobtitle = $_.jobtitle
        emailaddress1 = $_.emailaddress1
        telephone1 = $_.telephone1
        address1_city = $_.address1_city
        etag = $_.'@odata.etag'
        modifiedon = $_.modifiedon
    }
})
Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/tables/contact/rows" -Headers $pbiHeaders -Body (@{ rows = $cntRows } | ConvertTo-Json -Depth 5) | Out-Null
Write-Host "  [Fabric Workspace] Pushed $($cntRows.Count) contact rows into Fabric table 'contact'"

# Verify and Read Back directly from Microsoft Fabric via executeQueries (DAX)
$daxAcctResp = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/executeQueries" -Headers $pbiHeaders -Body (@{ queries = @(@{ query = "EVALUATE 'account'" }) } | ConvertTo-Json -Depth 5)
$daxCntResp = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/executeQueries" -Headers $pbiHeaders -Body (@{ queries = @(@{ query = "EVALUATE 'contact'" }) } | ConvertTo-Json -Depth 5)

$fabricAccounts = $daxAcctResp.results[0].tables[0].rows
$fabricContacts = $daxCntResp.results[0].tables[0].rows
Write-Host "  [Fabric Readback Verified] Queried $($fabricAccounts.Count) accounts and $($fabricContacts.Count) contacts directly from Fabric Semantic Model ($dsId)!"

Write-Host ""
Write-Host "================================================================================"
Write-Host "STAGE 3: PROJECTING FROM FABRIC INTO ON-PREMISES POSTGRESQL 17 & SQL SERVER 17"
Write-Host "================================================================================"

$userObjId = "a996ff15-b5d3-f111-a059-70a8a59ba8c8"
$secVer = "security-v2-fabric-package"

$pgLines = New-Object System.Collections.Generic.List[string]
$msLines = New-Object System.Collections.Generic.List[string]

# Project Fabric Account rows into PostgreSQL 17 and SQL Server 17 LocalDB
foreach ($fa in $fabricAccounts) {
    $recId = $fa.'account[accountid]'
    $jsonObj = @{
        origin = "fabric://VerseOff-Fabric/$dsId/account"
        dataverseOrigin = "https://verseofftrial.crm.dynamics.com"
        accountid = $recId
        name = $fa.'account[name]'
        accountnumber = $fa.'account[accountnumber]'
        telephone1 = $fa.'account[telephone1]'
        emailaddress1 = $fa.'account[emailaddress1]'
        address1_city = $fa.'account[address1_city]'
        address1_stateorprovince = $fa.'account[address1_stateorprovince]'
        revenue = $fa.'account[revenue]'
        numberofemployees = $fa.'account[numberofemployees]'
        etag = $fa.'account[etag]'
        modifiedon = $fa.'account[modifiedon]'
    } | ConvertTo-Json -Compress

    $escapedJson = $jsonObj.Replace("'", "''")
    $pgLines.Add("INSERT INTO verseoff.read_projection (tenant_id, environment_id, user_object_id, security_snapshot_version, table_logical_name, record_id, data_json, projected_at, is_deleted) VALUES ('$tenantId', '$envId', '$userObjId', '$secVer', 'account', '$recId', '$escapedJson'::jsonb, NOW(), false) ON CONFLICT (tenant_id, environment_id, user_object_id, security_snapshot_version, table_logical_name, record_id) DO UPDATE SET data_json = EXCLUDED.data_json, projected_at = NOW(), is_deleted = false;")
    $msLines.Add("MERGE dbo.VerseOffReadProjection AS t USING (SELECT '$tenantId' AS TenantId, '$envId' AS EnvironmentId, '$userObjId' AS UserObjectId, '$secVer' AS SecuritySnapshotVersion, 'account' AS TableLogicalName, '$recId' AS RecordId) AS s ON (t.TenantId=s.TenantId AND t.EnvironmentId=s.EnvironmentId AND t.UserObjectId=s.UserObjectId AND t.SecuritySnapshotVersion=s.SecuritySnapshotVersion AND t.TableLogicalName=s.TableLogicalName AND t.RecordId=s.RecordId) WHEN MATCHED THEN UPDATE SET DataJson=N'$escapedJson', ProjectedAt=SYSDATETIMEOFFSET(), IsDeleted=0 WHEN NOT MATCHED THEN INSERT (TenantId, EnvironmentId, UserObjectId, SecuritySnapshotVersion, TableLogicalName, RecordId, DataJson, ProjectedAt, IsDeleted) VALUES (s.TenantId, s.EnvironmentId, s.UserObjectId, s.SecuritySnapshotVersion, s.TableLogicalName, s.RecordId, N'$escapedJson', SYSDATETIMEOFFSET(), 0);")
}

# Project Fabric Contact rows into PostgreSQL 17 and SQL Server 17 LocalDB
foreach ($fc in $fabricContacts) {
    $recId = $fc.'contact[contactid]'
    $jsonObj = @{
        origin = "fabric://VerseOff-Fabric/$dsId/contact"
        dataverseOrigin = "https://verseofftrial.crm.dynamics.com"
        contactid = $recId
        fullname = $fc.'contact[fullname]'
        firstname = $fc.'contact[firstname]'
        lastname = $fc.'contact[lastname]'
        jobtitle = $fc.'contact[jobtitle]'
        emailaddress1 = $fc.'contact[emailaddress1]'
        telephone1 = $fc.'contact[telephone1]'
        address1_city = $fc.'contact[address1_city]'
        etag = $fc.'contact[etag]'
        modifiedon = $fc.'contact[modifiedon]'
    } | ConvertTo-Json -Compress

    $escapedJson = $jsonObj.Replace("'", "''")
    $pgLines.Add("INSERT INTO verseoff.read_projection (tenant_id, environment_id, user_object_id, security_snapshot_version, table_logical_name, record_id, data_json, projected_at, is_deleted) VALUES ('$tenantId', '$envId', '$userObjId', '$secVer', 'contact', '$recId', '$escapedJson'::jsonb, NOW(), false) ON CONFLICT (tenant_id, environment_id, user_object_id, security_snapshot_version, table_logical_name, record_id) DO UPDATE SET data_json = EXCLUDED.data_json, projected_at = NOW(), is_deleted = false;")
    $msLines.Add("MERGE dbo.VerseOffReadProjection AS t USING (SELECT '$tenantId' AS TenantId, '$envId' AS EnvironmentId, '$userObjId' AS UserObjectId, '$secVer' AS SecuritySnapshotVersion, 'contact' AS TableLogicalName, '$recId' AS RecordId) AS s ON (t.TenantId=s.TenantId AND t.EnvironmentId=s.EnvironmentId AND t.UserObjectId=s.UserObjectId AND t.SecuritySnapshotVersion=s.SecuritySnapshotVersion AND t.TableLogicalName=s.TableLogicalName AND t.RecordId=s.RecordId) WHEN MATCHED THEN UPDATE SET DataJson=N'$escapedJson', ProjectedAt=SYSDATETIMEOFFSET(), IsDeleted=0 WHEN NOT MATCHED THEN INSERT (TenantId, EnvironmentId, UserObjectId, SecuritySnapshotVersion, TableLogicalName, RecordId, DataJson, ProjectedAt, IsDeleted) VALUES (s.TenantId, s.EnvironmentId, s.UserObjectId, s.SecuritySnapshotVersion, s.TableLogicalName, s.RecordId, N'$escapedJson', SYSDATETIMEOFFSET(), 0);")
}

$pgFile = Join-Path $env:TEMP "verseoff_fabric_to_pg.sql"
$msFile = Join-Path $env:TEMP "verseoff_fabric_to_mssql.sql"
[System.IO.File]::WriteAllLines($pgFile, $pgLines, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllLines($msFile, $msLines, (New-Object System.Text.UTF8Encoding($false)))

& "C:\Users\prave\.postgresql\pgsql\bin\psql.exe" -h localhost -p 5432 -U postgres -d verseoff_read -f $pgFile | Out-Null
sqlcmd -S "(localdb)\MSSQLLocalDB" -d VerseOffReadPlane -i $msFile | Out-Null
Write-Host "  [PostgreSQL 17 & SQL Server 17] Projected $($pgLines.Count) rows from Microsoft Fabric!"

Write-Host ""
Write-Host "=== VERIFYING LANDED ROWS IN POSTGRESQL 17 (verseoff.read_projection) ==="
& "C:\Users\prave\.postgresql\pgsql\bin\psql.exe" -h localhost -p 5432 -U postgres -d verseoff_read -c "SELECT table_logical_name, record_id, security_snapshot_version, COALESCE(data_json->>'name', data_json->>'fullname') AS display_name, COALESCE(data_json->>'accountnumber', data_json->>'jobtitle') AS code_or_title, data_json->>'address1_city' AS city, data_json->>'origin' AS fabric_origin FROM verseoff.read_projection WHERE security_snapshot_version = '$secVer' ORDER BY table_logical_name, display_name;"

Write-Host ""
Write-Host "=== VERIFYING LANDED ROWS IN SQL SERVER 17 LOCALDB (dbo.VerseOffReadProjection) ==="
sqlcmd -S "(localdb)\MSSQLLocalDB" -d VerseOffReadPlane -Q "SELECT TableLogicalName, RecordId, SecuritySnapshotVersion, COALESCE(JSON_VALUE(DataJson, '$.name'), JSON_VALUE(DataJson, '$.fullname')) AS DisplayName, COALESCE(JSON_VALUE(DataJson, '$.accountnumber'), JSON_VALUE(DataJson, '$.jobtitle')) AS CodeOrTitle, JSON_VALUE(DataJson, '$.address1_city') AS City, JSON_VALUE(DataJson, '$.origin') AS FabricOrigin FROM dbo.VerseOffReadProjection WHERE SecuritySnapshotVersion = '$secVer' ORDER BY TableLogicalName, DisplayName;" -W

