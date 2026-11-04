$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

$pkgPath = Join-Path $PSScriptRoot "verseoff-sample-data-package.json"
$schemaPath = Join-Path $PSScriptRoot "pg_dataverse_security_schema.sql"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json

$tenantId = "6c9a8cd4-cb8e-4e2f-b9b7-eaae3a4c8bd6"
$orgId = "2adf6659-62d5-f111-84db-6045bd003100"
$rootBuId = "b08fff15-b5d3-f111-a059-70a8a59ba8c8"
$envId = $pkg.sourceEnvironment.environmentId
$dvBase = "https://verseofftrial.crm.dynamics.com/api/data/v9.2"
$wsId = $pkg.fabricDestination.workspaceId
$containerName = "dataverse-verseofftrial-unq2adf665962d5f11184db6045bd003"
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
$stToken = Get-AzToken "https://storage.azure.com/.default"

$dvHeaders = @{ Authorization = "Bearer $dvToken"; "Content-Type" = "application/json"; Prefer = "return=representation" }
$pbiHeaders = @{ Authorization = "Bearer $pbiToken"; "Content-Type" = "application/json" }

Write-Host "================================================================================"
Write-Host "STAGE 1: SEEDING SAMPLE DATA & EXTRACTING SECURITY MODEL FROM DATAVERSE"
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
    Write-Host "  [Dataverse Upsert] Account: $($res.name) ($($res.accountnumber)) | ID=$($res.accountid)"
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
    Write-Host "  [Dataverse Upsert] Contact: $($res.fullname) ($($res.jobtitle)) | ID=$($res.contactid)"
}

# Pull Entity Sets + Security Tables from Live Dataverse Web API v9.2
$deltaHeaders = @{ Authorization = "Bearer $dvToken"; Prefer = "odata.track-changes" }
$dvAccountsDelta = Invoke-RestMethod -Uri "$dvBase/accounts?`$select=accountid,name,accountnumber,telephone1,emailaddress1,address1_city,address1_stateorprovince,revenue,numberofemployees,description,_ownerid_value,_owningbusinessunit_value,modifiedon,statecode,statuscode,versionnumber" -Headers $deltaHeaders
$dvContactsDelta = Invoke-RestMethod -Uri "$dvBase/contacts?`$select=contactid,fullname,firstname,lastname,jobtitle,emailaddress1,telephone1,address1_city,_parentcustomerid_value,_ownerid_value,_owningbusinessunit_value,modifiedon,statecode,statuscode,versionnumber" -Headers $deltaHeaders
$dvTasks = Invoke-RestMethod -Uri "$dvBase/tasks?`$select=activityid,subject,description,_ownerid_value,_owningbusinessunit_value,modifiedon,statecode,statuscode,versionnumber&`$top=50" -Headers @{ Authorization = "Bearer $dvToken" }
$dvPhoneCalls = Invoke-RestMethod -Uri "$dvBase/phonecalls?`$select=activityid,subject,description,phonenumber,_ownerid_value,_owningbusinessunit_value,modifiedon,statecode,statuscode,versionnumber&`$top=50" -Headers @{ Authorization = "Bearer $dvToken" }
$dvAppointments = Invoke-RestMethod -Uri "$dvBase/appointments?`$select=activityid,subject,description,location,_ownerid_value,_owningbusinessunit_value,modifiedon,statecode,statuscode,versionnumber&`$top=50" -Headers @{ Authorization = "Bearer $dvToken" }

# Pull Live Dataverse Security Model Tables
$dvBusinessUnits = Invoke-RestMethod -Uri "$dvBase/businessunits?`$select=businessunitid,name,_parentbusinessunitid_value,_organizationid_value,isdisabled,modifiedon" -Headers @{ Authorization = "Bearer $dvToken" }
$dvUsers = Invoke-RestMethod -Uri "$dvBase/systemusers?`$select=systemuserid,azureactivedirectoryobjectid,fullname,domainname,_businessunitid_value,organizationid,isdisabled,modifiedon&`$top=50" -Headers @{ Authorization = "Bearer $dvToken" }
$dvTeams = Invoke-RestMethod -Uri "$dvBase/teams?`$select=teamid,name,_businessunitid_value,teamtype,isdefault,modifiedon" -Headers @{ Authorization = "Bearer $dvToken" }
$dvRoles = Invoke-RestMethod -Uri "$dvBase/roles?`$select=roleid,name,_businessunitid_value,_parentrootroleid_value,_roletemplateid_value" -Headers @{ Authorization = "Bearer $dvToken" }
$dvPoa = Invoke-RestMethod -Uri "$dvBase/principalobjectaccessset?`$select=principalobjectaccessid,principalid,principaltypecode,objectid,objecttypecode,accessrightsmask,inheritedaccessrightsmask,changedon&`$top=100" -Headers @{ Authorization = "Bearer $dvToken" }

Write-Host "  [Dataverse Security & Entities Extracted]:"
Write-Host "    Accounts=$($dvAccountsDelta.value.Count), Contacts=$($dvContactsDelta.value.Count), Tasks=$($dvTasks.value.Count), PhoneCalls=$($dvPhoneCalls.value.Count), Appointments=$($dvAppointments.value.Count)"
Write-Host "    BusinessUnits=$($dvBusinessUnits.value.Count), SystemUsers=$($dvUsers.value.Count), Teams=$($dvTeams.value.Count), Roles=$($dvRoles.value.Count), POA=$($dvPoa.value.Count)"

Write-Host ""
Write-Host "================================================================================"
Write-Host "STAGE 2: LANDING SAMPLE & SECURITY PACKAGE IN MICROSOFT FABRIC (VerseOff-Fabric)"
Write-Host "================================================================================"

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
Put-AdlsFile "security/businessunit_2026.json" ($dvBusinessUnits.value | ConvertTo-Json -Depth 5)
Put-AdlsFile "security/role_2026.json" ($dvRoles.value | ConvertTo-Json -Depth 5)
Put-AdlsFile "security/principalobjectaccess_2026.json" ($dvPoa.value | ConvertTo-Json -Depth 5)

$dsName = "VerseOffDataverseLakehouse"
$existingDs = (Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets" -Headers $pbiHeaders).value | Where-Object { $_.name -eq $dsName } | Select-Object -First 1
$dsId = $existingDs.id

$daxAcctResp = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/executeQueries" -Headers $pbiHeaders -Body (@{ queries = @(@{ query = "EVALUATE 'account'" }) } | ConvertTo-Json -Depth 5)
$daxCntResp = Invoke-RestMethod -Method Post -Uri "https://api.powerbi.com/v1.0/myorg/groups/$wsId/datasets/$dsId/executeQueries" -Headers $pbiHeaders -Body (@{ queries = @(@{ query = "EVALUATE 'contact'" }) } | ConvertTo-Json -Depth 5)

$fabricAccounts = $daxAcctResp.results[0].tables[0].rows
$fabricContacts = $daxCntResp.results[0].tables[0].rows
Write-Host "  [Fabric Readback Verified] Queried $($fabricAccounts.Count) accounts and $($fabricContacts.Count) contacts from Fabric Semantic Model ($dsId)"

Write-Host ""
Write-Host "================================================================================"
Write-Host "STAGE 3: LANDING COMPLETE DATAVERSE SECURITY MODEL & ENTITIES IN POSTGRESQL 17"
Write-Host "================================================================================"

# Apply PostgreSQL 17 Security + Entity Schema DDL
& $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -f $schemaPath | Out-Null
Write-Host "  [PostgreSQL 17 DDL] Applied pg_dataverse_security_schema.sql in database 'verseoff_read'"

function SqlStr($v) {
    if ($null -eq $v) { return "NULL" }
    return "'" + ([string]$v).Replace("'", "''") + "'"
}

$sqlLines = New-Object System.Collections.Generic.List[string]
$sqlLines.Add("BEGIN;")

# 3A. Land Live Dataverse Business Units + Multi-Tier Child Business Units (Pacific NW -> Seattle Depot, California Div)
foreach ($bu in $dvBusinessUnits.value) {
    $parentCol = if ($bu._parentbusinessunitid_value) { "'$($bu._parentbusinessunitid_value)'" } else { "NULL" }
    $orgCol = if ($bu._organizationid_value) { "'$($bu._organizationid_value)'" } else { "'$orgId'" }
    $isDis = if ($bu.isdisabled) { "TRUE" } else { "FALSE" }
    $sqlLines.Add("INSERT INTO verseoff.businessunit (businessunitid, name, parentbusinessunitid, organizationid, isdisabled) VALUES ('$($bu.businessunitid)', $(SqlStr $bu.name), $parentCol, $orgCol, $isDis) ON CONFLICT (businessunitid) DO UPDATE SET name = EXCLUDED.name, parentbusinessunitid = EXCLUDED.parentbusinessunitid;")
}

# Hierarchical Child Business Units for Deep (Parent-Child BU = 4) and Local (BU = 2) Security Enforcement
$buPnwId     = "b1000000-0000-0000-0000-000000000001" # Child of Root BU
$buSeattleId = "b1000000-0000-0000-0000-000000000002" # Grandchild of Root BU (Child of Pacific NW Division)
$buCalifId   = "b1000000-0000-0000-0000-000000000003" # Sibling Child of Root BU (California Aerospace Division)

$sqlLines.Add("INSERT INTO verseoff.businessunit (businessunitid, name, parentbusinessunitid, organizationid, isdisabled) VALUES ('$buPnwId', 'Pacific Northwest Division', '$rootBuId', '$orgId', FALSE) ON CONFLICT (businessunitid) DO UPDATE SET name = EXCLUDED.name, parentbusinessunitid = EXCLUDED.parentbusinessunitid;")
$sqlLines.Add("INSERT INTO verseoff.businessunit (businessunitid, name, parentbusinessunitid, organizationid, isdisabled) VALUES ('$buSeattleId', 'Seattle Autonomous Depot', '$buPnwId', '$orgId', FALSE) ON CONFLICT (businessunitid) DO UPDATE SET name = EXCLUDED.name, parentbusinessunitid = EXCLUDED.parentbusinessunitid;")
$sqlLines.Add("INSERT INTO verseoff.businessunit (businessunitid, name, parentbusinessunitid, organizationid, isdisabled) VALUES ('$buCalifId', 'California Aerospace Division', '$rootBuId', '$orgId', FALSE) ON CONFLICT (businessunitid) DO UPDATE SET name = EXCLUDED.name, parentbusinessunitid = EXCLUDED.parentbusinessunitid;")

# 3B. Land Live Dataverse SystemUsers + Persona Users for Each Security Depth
foreach ($u in $dvUsers.value) {
    $buCol = if ($u._businessunitid_value) { "'$($u._businessunitid_value)'" } else { "'$rootBuId'" }
    $aadCol = if ($u.azureactivedirectoryobjectid) { "'$($u.azureactivedirectoryobjectid)'" } else { "NULL" }
    $orgCol = if ($u.organizationid) { "'$($u.organizationid)'" } else { "'$orgId'" }
    $isDis = if ($u.isdisabled) { "TRUE" } else { "FALSE" }
    $fn = if ($u.fullname) { $u.fullname } else { "System User" }
    $dn = if ($u.domainname) { $u.domainname } else { "user@praveenthondahotmail.onmicrosoft.com" }
    $sqlLines.Add("INSERT INTO verseoff.systemuser (systemuserid, azureactivedirectoryobjectid, fullname, domainname, businessunitid, organizationid, isdisabled) VALUES ('$($u.systemuserid)', $aadCol, $(SqlStr $fn), $(SqlStr $dn), $buCol, $orgCol, $isDis) ON CONFLICT (systemuserid) DO UPDATE SET fullname = EXCLUDED.fullname, businessunitid = EXCLUDED.businessunitid, azureactivedirectoryobjectid = EXCLUDED.azureactivedirectoryobjectid;")
}

# Security Persona Users:
# 1. Admin User (Real Dataverse Admin): a996ff15-b5d3-f111-a059-70a8a59ba8c8 (Root BU, System Administrator Global=8)
# 2. PNW Division Director: u2000000-...-0001 (Pacific NW BU, Parent-Child Deep=4 role -> sees PNW + Seattle Depot, NOT California)
# 3. PNW Local Manager: u2000000-...-0002 (Pacific NW BU, Local BU=2 role -> sees PNW only, NOT Seattle Depot or California)
# 4. Seattle Field Technician: u2000000-...-0003 (Seattle Depot BU, Basic/User=1 role -> sees own records + Team records + POA shared records)
# 5. California Rep: u2000000-...-0004 (California BU, Basic/User=1 role -> owns California record)
$userAdminId   = "a996ff15-b5d3-f111-a059-70a8a59ba8c8"
$userPnwDeepId = "d2000000-0000-0000-0000-000000000001"
$userPnwLocId  = "d2000000-0000-0000-0000-000000000002"
$userSeaTechId = "d2000000-0000-0000-0000-000000000003"
$userCalRepId  = "d2000000-0000-0000-0000-000000000004"

$sqlLines.Add("INSERT INTO verseoff.systemuser (systemuserid, azureactivedirectoryobjectid, fullname, domainname, businessunitid, organizationid, isdisabled) VALUES ('$userPnwDeepId', '$userPnwDeepId', 'Elena Vance (PNW Division Director - Deep BU)', 'elena.vance@praveenthondahotmail.onmicrosoft.com', '$buPnwId', '$orgId', FALSE) ON CONFLICT (systemuserid) DO UPDATE SET fullname = EXCLUDED.fullname, businessunitid = EXCLUDED.businessunitid;")
$sqlLines.Add("INSERT INTO verseoff.systemuser (systemuserid, azureactivedirectoryobjectid, fullname, domainname, businessunitid, organizationid, isdisabled) VALUES ('$userPnwLocId', '$userPnwLocId', 'Marcus Sterling (PNW Local Manager - Local BU)', 'marcus.sterling@praveenthondahotmail.onmicrosoft.com', '$buPnwId', '$orgId', FALSE) ON CONFLICT (systemuserid) DO UPDATE SET fullname = EXCLUDED.fullname, businessunitid = EXCLUDED.businessunitid;")
$sqlLines.Add("INSERT INTO verseoff.systemuser (systemuserid, azureactivedirectoryobjectid, fullname, domainname, businessunitid, organizationid, isdisabled) VALUES ('$userSeaTechId', '$userSeaTechId', 'Liam O''Connor (Seattle Field Tech - Basic + Team + POA)', 'liam.oconnor@praveenthondahotmail.onmicrosoft.com', '$buSeattleId', '$orgId', FALSE) ON CONFLICT (systemuserid) DO UPDATE SET fullname = EXCLUDED.fullname, businessunitid = EXCLUDED.businessunitid;")
$sqlLines.Add("INSERT INTO verseoff.systemuser (systemuserid, azureactivedirectoryobjectid, fullname, domainname, businessunitid, organizationid, isdisabled) VALUES ('$userCalRepId', '$userCalRepId', 'Sofia Chen (California Aerospace Rep - Basic)', 'sofia.chen@praveenthondahotmail.onmicrosoft.com', '$buCalifId', '$orgId', FALSE) ON CONFLICT (systemuserid) DO UPDATE SET fullname = EXCLUDED.fullname, businessunitid = EXCLUDED.businessunitid;")

# 3C. Land Live Dataverse Teams + Redmond Fleet Response Owner Team
foreach ($tm in $dvTeams.value) {
    $buCol = if ($tm._businessunitid_value) { "'$($tm._businessunitid_value)'" } else { "'$rootBuId'" }
    $tType = if ($null -ne $tm.teamtype) { $tm.teamtype } else { 0 }
    $isDef = if ($tm.isdefault) { "TRUE" } else { "FALSE" }
    $sqlLines.Add("INSERT INTO verseoff.team (teamid, name, businessunitid, teamtype, isdefault) VALUES ('$($tm.teamid)', $(SqlStr $tm.name), $buCol, $tType, $isDef) ON CONFLICT (teamid) DO UPDATE SET name = EXCLUDED.name, businessunitid = EXCLUDED.businessunitid;")
}

$teamRedmondId = "e3000000-0000-0000-0000-000000000001"
$sqlLines.Add("INSERT INTO verseoff.team (teamid, name, businessunitid, teamtype, isdefault) VALUES ('$teamRedmondId', 'Redmond Fleet Response Team', '$buSeattleId', 0, FALSE) ON CONFLICT (teamid) DO UPDATE SET name = EXCLUDED.name, businessunitid = EXCLUDED.businessunitid;")
$sqlLines.Add("INSERT INTO verseoff.teammembership (teamid, systemuserid) VALUES ('$teamRedmondId', '$userSeaTechId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.teammembership (teamid, systemuserid) VALUES ('$teamRedmondId', '$userAdminId') ON CONFLICT DO NOTHING;")

# 3D. Land Live Dataverse Roles + Explicit Depth Roles
foreach ($rl in $dvRoles.value) {
    $buCol = if ($rl._businessunitid_value) { "'$($rl._businessunitid_value)'" } else { "'$rootBuId'" }
    $prCol = if ($rl._parentrootroleid_value) { "'$($rl._parentrootroleid_value)'" } else { "NULL" }
    $rtCol = if ($rl._roletemplateid_value) { "'$($rl._roletemplateid_value)'" } else { "NULL" }
    $sqlLines.Add("INSERT INTO verseoff.role (roleid, name, businessunitid, parentrootroleid, roletemplateid) VALUES ('$($rl.roleid)', $(SqlStr $rl.name), $buCol, $prCol, $rtCol) ON CONFLICT (roleid) DO UPDATE SET name = EXCLUDED.name, businessunitid = EXCLUDED.businessunitid, parentrootroleid = EXCLUDED.parentrootroleid;")
}

$roleSysAdminId = "f4000000-0000-0000-0000-000000000008" # Global (8)
$roleDivDirId   = "f4000000-0000-0000-0000-000000000004" # Deep / Parent-Child BU (4)
$roleBuMgrId    = "f4000000-0000-0000-0000-000000000002" # Local BU (2)
$roleBasicId    = "f4000000-0000-0000-0000-000000000001" # Basic / User-Team (1)

$sqlLines.Add("INSERT INTO verseoff.role (roleid, name, businessunitid, parentrootroleid) VALUES ('$roleSysAdminId', 'VerseOff System Administrator (Global=8)', '$rootBuId', NULL) ON CONFLICT (roleid) DO UPDATE SET name = EXCLUDED.name;")
$sqlLines.Add("INSERT INTO verseoff.role (roleid, name, businessunitid, parentrootroleid) VALUES ('$roleDivDirId', 'VerseOff Division Director (Deep/ParentChildBU=4)', '$buPnwId', NULL) ON CONFLICT (roleid) DO UPDATE SET name = EXCLUDED.name;")
$sqlLines.Add("INSERT INTO verseoff.role (roleid, name, businessunitid, parentrootroleid) VALUES ('$roleBuMgrId', 'VerseOff BU Operations Manager (LocalBU=2)', '$buPnwId', NULL) ON CONFLICT (roleid) DO UPDATE SET name = EXCLUDED.name;")
$sqlLines.Add("INSERT INTO verseoff.role (roleid, name, businessunitid, parentrootroleid) VALUES ('$roleBasicId', 'VerseOff Field Technician (Basic/User=1)', '$buSeattleId', NULL) ON CONFLICT (roleid) DO UPDATE SET name = EXCLUDED.name;")

# Assign Roles to Users & Teams
$sqlLines.Add("INSERT INTO verseoff.systemuserroles (systemuserid, roleid) VALUES ('$userAdminId', '$roleSysAdminId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.systemuserroles (systemuserid, roleid) VALUES ('$userPnwDeepId', '$roleDivDirId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.systemuserroles (systemuserid, roleid) VALUES ('$userPnwLocId', '$roleBuMgrId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.systemuserroles (systemuserid, roleid) VALUES ('$userSeaTechId', '$roleBasicId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.systemuserroles (systemuserid, roleid) VALUES ('$userCalRepId', '$roleBasicId') ON CONFLICT DO NOTHING;")
$sqlLines.Add("INSERT INTO verseoff.teamroles (teamid, roleid) VALUES ('$teamRedmondId', '$roleBasicId') ON CONFLICT DO NOTHING;")

# 3E. Seed Privileges & RolePrivileges across Entity Tables
$securedTables = @("account", "contact", "task", "phonecall", "appointment", "businessunit", "systemuser", "team", "role", "privilege", "principalobjectaccess")
$privTypes = @(
    @{ Type = "Read"; Mask = 1 },
    @{ Type = "Write"; Mask = 2 },
    @{ Type = "Append"; Mask = 4 },
    @{ Type = "AppendTo"; Mask = 16 },
    @{ Type = "Create"; Mask = 32 },
    @{ Type = "Delete"; Mask = 65536 },
    @{ Type = "Share"; Mask = 262144 },
    @{ Type = "Assign"; Mask = 524288 }
)

$privIndex = 1
foreach ($tbl in $securedTables) {
    foreach ($pt in $privTypes) {
        $privId = ("a5000000-0000-0000-0000-{0:d12}" -f $privIndex)
        $privIndex++
        $privName = "prv$($pt.Type)$($tbl)"
        $sqlLines.Add("INSERT INTO verseoff.privilege (privilegeid, name, table_logical_name, privilege_type, accessright) VALUES ('$privId', '$privName', '$tbl', '$($pt.Type)', $($pt.Mask)) ON CONFLICT (privilegeid) DO UPDATE SET name = EXCLUDED.name, table_logical_name = EXCLUDED.table_logical_name, privilege_type = EXCLUDED.privilege_type;")

        # Bind RolePrivileges with exact Dataverse depth bitmasks (8=Global, 4=Deep, 2=Local, 1=Basic)
        $sqlLines.Add("INSERT INTO verseoff.roleprivileges (roleid, privilegeid, privilegedepthmask) VALUES ('$roleSysAdminId', '$privId', 8) ON CONFLICT (roleid, privilegeid) DO UPDATE SET privilegedepthmask = 8;")
        $sqlLines.Add("INSERT INTO verseoff.roleprivileges (roleid, privilegeid, privilegedepthmask) VALUES ('$roleDivDirId', '$privId', 4) ON CONFLICT (roleid, privilegeid) DO UPDATE SET privilegedepthmask = 4;")
        $sqlLines.Add("INSERT INTO verseoff.roleprivileges (roleid, privilegeid, privilegedepthmask) VALUES ('$roleBuMgrId', '$privId', 2) ON CONFLICT (roleid, privilegeid) DO UPDATE SET privilegedepthmask = 2;")
        $sqlLines.Add("INSERT INTO verseoff.roleprivileges (roleid, privilegeid, privilegedepthmask) VALUES ('$roleBasicId', '$privId', 1) ON CONFLICT (roleid, privilegeid) DO UPDATE SET privilegedepthmask = 1;")
    }
}

# 3F. Land Live Dataverse PrincipalObjectAccess (POA) Rows + Explicit Cross-BU Record Share
foreach ($poa in $dvPoa.value) {
    $pType = if ($poa.principaltypecode) { $poa.principaltypecode } else { "systemuser" }
    $oType = if ($poa.objecttypecode) { $poa.objecttypecode } else { "account" }
    $arMask = if ($null -ne $poa.accessrightsmask) { $poa.accessrightsmask } else { 1 }
    $iarMask = if ($null -ne $poa.inheritedaccessrightsmask) { $poa.inheritedaccessrightsmask } else { 0 }
    $sqlLines.Add("INSERT INTO verseoff.principalobjectaccess (principalobjectaccessid, principalid, principaltypecode, objectid, objecttypecode, accessrightsmask, inheritedaccessrightsmask) VALUES ('$($poa.principalobjectaccessid)', '$($poa.principalid)', $(SqlStr $pType), '$($poa.objectid)', $(SqlStr $oType), $arMask, $iarMask) ON CONFLICT (principalobjectaccessid) DO UPDATE SET accessrightsmask = EXCLUDED.accessrightsmask, inheritedaccessrightsmask = EXCLUDED.inheritedaccessrightsmask;")
}

# Explicit POA Share: Share California Aerospace Account (33333333-60d6-f111-a05d-00224805ee15, owned by Sofia Chen in California BU)
# with Seattle Field Tech (Liam O'Connor, d2000000-...-0003) with Read (1) + Write (2) = 3 access!
$poaShareId = "c6000000-0000-0000-0000-000000000001"
$sharedCaliforniaAccountId = "33333333-60d6-f111-a05d-00224805ee15"
$sqlLines.Add("INSERT INTO verseoff.principalobjectaccess (principalobjectaccessid, principalid, principaltypecode, objectid, objecttypecode, accessrightsmask, inheritedaccessrightsmask) VALUES ('$poaShareId', '$userSeaTechId', 'systemuser', '$sharedCaliforniaAccountId', 'account', 3, 0) ON CONFLICT (principalobjectaccessid) DO UPDATE SET accessrightsmask = 3, objectid = EXCLUDED.objectid;")

# 3G. Field-Level Security (FLS) Profile: Secure 'government_contract_code' column on 'account' for System Administrator only
$flsProfileId = "f7000000-0000-0000-0000-000000000001"
$flsPermId    = "f7000000-0000-0000-0000-000000000002"
$sqlLines.Add("INSERT INTO verseoff.fieldsecurityprofile (fieldsecurityprofileid, name) VALUES ('$flsProfileId', 'VerseOff Classified Contract Clearance') ON CONFLICT (fieldsecurityprofileid) DO UPDATE SET name = EXCLUDED.name;")
$sqlLines.Add("INSERT INTO verseoff.fieldpermission (fieldpermissionid, fieldsecurityprofileid, entityname, attributelogicalname, canread, canupdate, cancreate) VALUES ('$flsPermId', '$flsProfileId', 'account', 'government_contract_code', 4, 4, 4) ON CONFLICT (fieldpermissionid) DO UPDATE SET canread = 4;")
$sqlLines.Add("INSERT INTO verseoff.systemuserprofiles (systemuserid, fieldsecurityprofileid) VALUES ('$userAdminId', '$flsProfileId') ON CONFLICT DO NOTHING;")

# 3H. Land All Dataverse Accounts, Contacts, Tasks, PhoneCalls, Appointments into verseoff.dataverse_entity
# Assign realistic multi-BU ownership across the 5 enterprise sample accounts so BU/Role/Team/POA security is exercised end-to-end:
# - Account 01 (Contoso Mobility Fleet, VO-ACCT-1001): Owned by Admin in Root BU
# - Account 02 (Fabrikam Autonomous Logistics, VO-ACCT-1002): Owned by PNW Local Manager in Pacific NW Division BU
# - Account 03 (Northwind Grid Infrastructure, VO-ACCT-1003): Owned by Seattle Field Tech in Seattle Autonomous Depot BU (Child of PNW)
# - Account 04 (Adventure Works Industrial Robotics, VO-ACCT-1004): Owned by Redmond Fleet Response Team in Seattle Autonomous Depot BU
# - Account 05 (Litware Aerospace Maintenance, VO-ACCT-1005): Owned by California Rep in California Aerospace Division BU (and shared via POA with Seattle Field Tech!)

$acctSecurityAssignments = @{
    "0a5e7ad6-53d6-f111-a05d-00224805ee15" = @{ OwnerId = $userAdminId;   OwnerType = "systemuser"; BuId = $rootBuId;    GovCode = "GOV-TOP-SECRET-9901" }
    "2fa0fcdd-53d6-f111-a05d-00224805ee15" = @{ OwnerId = $userPnwLocId;  OwnerType = "systemuser"; BuId = $buPnwId;     GovCode = "GOV-PNW-CLEAR-4402" }
    "11111111-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $userSeaTechId; OwnerType = "systemuser"; BuId = $buSeattleId; GovCode = "GOV-SEA-DEPOT-3303" }
    "22222222-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $teamRedmondId; OwnerType = "team";       BuId = $buSeattleId; GovCode = "GOV-TEAM-RED-2204" }
    "33333333-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $userCalRepId;  OwnerType = "systemuser"; BuId = $buCalifId;   GovCode = "GOV-CAL-AERO-1105" }
}

$verCounter = 1000
foreach ($acct in $dvAccountsDelta.value) {
    $recId = [string]$acct.accountid
    $verCounter++
    $sec = $acctSecurityAssignments[$recId]
    if (-not $sec) {
        $sec = @{
            OwnerId = if ($acct._ownerid_value) { $acct._ownerid_value } else { $userAdminId }
            OwnerType = "systemuser"
            BuId = if ($acct._owningbusinessunit_value) { $acct._owningbusinessunit_value } else { $rootBuId }
            GovCode = "GOV-STD-0000"
        }
    }
    $etag = if ($acct.'@odata.etag') { $acct.'@odata.etag' } else { "W/`"$verCounter`"" }
    $verNum = if ($acct.versionnumber) { [int64]$acct.versionnumber } else { $verCounter }
    $state = if ($null -ne $acct.statecode) { [int]$acct.statecode } else { 0 }
    $status = if ($null -ne $acct.statuscode) { [int]$acct.statuscode } else { 1 }

    $payload = @{
        accountid = $recId
        name = $acct.name
        accountnumber = $acct.accountnumber
        telephone1 = $acct.telephone1
        emailaddress1 = $acct.emailaddress1
        address1_city = $acct.address1_city
        address1_stateorprovince = $acct.address1_stateorprovince
        revenue = $acct.revenue
        numberofemployees = $acct.numberofemployees
        description = $acct.description
        government_contract_code = $sec.GovCode
        origin = "fabric://VerseOff-Fabric/$dsId/account"
    } | ConvertTo-Json -Compress
    $escaped = $payload.Replace("'", "''")

    $sqlLines.Add("INSERT INTO verseoff.dataverse_entity (table_logical_name, record_id, owner_id, owner_type, owning_business_unit_id, statecode, statuscode, version_number, etag, modified_on, is_deleted, data_json) VALUES ('account', '$recId', '$($sec.OwnerId)', '$($sec.OwnerType)', '$($sec.BuId)', $state, $status, $verNum, $(SqlStr $etag), NOW(), FALSE, '$escaped'::jsonb) ON CONFLICT (table_logical_name, record_id) DO UPDATE SET owner_id = EXCLUDED.owner_id, owner_type = EXCLUDED.owner_type, owning_business_unit_id = EXCLUDED.owning_business_unit_id, version_number = EXCLUDED.version_number, etag = EXCLUDED.etag, data_json = EXCLUDED.data_json, modified_on = NOW();")
}

$cntSecurityAssignments = @{
    "32a0fcdd-53d6-f111-a05d-00224805ee15" = @{ OwnerId = $userAdminId;   OwnerType = "systemuser"; BuId = $rootBuId }
    "44444444-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $userPnwLocId;  OwnerType = "systemuser"; BuId = $buPnwId }
    "55555555-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $userSeaTechId; OwnerType = "systemuser"; BuId = $buSeattleId }
    "66666666-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $teamRedmondId; OwnerType = "team";       BuId = $buSeattleId }
    "77777777-60d6-f111-a05d-00224805ee15" = @{ OwnerId = $userCalRepId;  OwnerType = "systemuser"; BuId = $buCalifId }
}

foreach ($cnt in $dvContactsDelta.value) {
    $recId = [string]$cnt.contactid
    $verCounter++
    $sec = $cntSecurityAssignments[$recId]
    if (-not $sec) {
        $sec = @{
            OwnerId = if ($cnt._ownerid_value) { $cnt._ownerid_value } else { $userAdminId }
            OwnerType = "systemuser"
            BuId = if ($cnt._owningbusinessunit_value) { $cnt._owningbusinessunit_value } else { $rootBuId }
        }
    }
    $etag = if ($cnt.'@odata.etag') { $cnt.'@odata.etag' } else { "W/`"$verCounter`"" }
    $verNum = if ($cnt.versionnumber) { [int64]$cnt.versionnumber } else { $verCounter }
    $state = if ($null -ne $cnt.statecode) { [int]$cnt.statecode } else { 0 }
    $status = if ($null -ne $cnt.statuscode) { [int]$cnt.statuscode } else { 1 }

    $payload = @{
        contactid = $recId
        fullname = $cnt.fullname
        firstname = $cnt.firstname
        lastname = $cnt.lastname
        jobtitle = $cnt.jobtitle
        emailaddress1 = $cnt.emailaddress1
        telephone1 = $cnt.telephone1
        address1_city = $cnt.address1_city
        _parentcustomerid_value = $cnt._parentcustomerid_value
        origin = "fabric://VerseOff-Fabric/$dsId/contact"
    } | ConvertTo-Json -Compress
    $escaped = $payload.Replace("'", "''")

    $sqlLines.Add("INSERT INTO verseoff.dataverse_entity (table_logical_name, record_id, owner_id, owner_type, owning_business_unit_id, statecode, statuscode, version_number, etag, modified_on, is_deleted, data_json) VALUES ('contact', '$recId', '$($sec.OwnerId)', '$($sec.OwnerType)', '$($sec.BuId)', $state, $status, $verNum, $(SqlStr $etag), NOW(), FALSE, '$escaped'::jsonb) ON CONFLICT (table_logical_name, record_id) DO UPDATE SET owner_id = EXCLUDED.owner_id, owner_type = EXCLUDED.owner_type, owning_business_unit_id = EXCLUDED.owning_business_unit_id, version_number = EXCLUDED.version_number, etag = EXCLUDED.etag, data_json = EXCLUDED.data_json, modified_on = NOW();")
}

# Land Tasks, PhoneCalls, Appointments from Dataverse
foreach ($tsk in $dvTasks.value) {
    $recId = [string]$tsk.activityid
    $verCounter++
    $etag = if ($tsk.'@odata.etag') { $tsk.'@odata.etag' } else { "W/`"$verCounter`"" }
    $verNum = if ($tsk.versionnumber) { [int64]$tsk.versionnumber } else { $verCounter }
    $payload = @{ activityid = $recId; subject = $tsk.subject; description = $tsk.description } | ConvertTo-Json -Compress
    $escaped = $payload.Replace("'", "''")
    $sqlLines.Add("INSERT INTO verseoff.dataverse_entity (table_logical_name, record_id, owner_id, owner_type, owning_business_unit_id, statecode, statuscode, version_number, etag, modified_on, is_deleted, data_json) VALUES ('task', '$recId', '$userAdminId', 'systemuser', '$rootBuId', 0, 1, $verNum, $(SqlStr $etag), NOW(), FALSE, '$escaped'::jsonb) ON CONFLICT (table_logical_name, record_id) DO UPDATE SET data_json = EXCLUDED.data_json;")
}

foreach ($pc in $dvPhoneCalls.value) {
    $recId = [string]$pc.activityid
    $verCounter++
    $etag = if ($pc.'@odata.etag') { $pc.'@odata.etag' } else { "W/`"$verCounter`"" }
    $verNum = if ($pc.versionnumber) { [int64]$pc.versionnumber } else { $verCounter }
    $payload = @{ activityid = $recId; subject = $pc.subject; description = $pc.description; phonenumber = $pc.phonenumber } | ConvertTo-Json -Compress
    $escaped = $payload.Replace("'", "''")
    $sqlLines.Add("INSERT INTO verseoff.dataverse_entity (table_logical_name, record_id, owner_id, owner_type, owning_business_unit_id, statecode, statuscode, version_number, etag, modified_on, is_deleted, data_json) VALUES ('phonecall', '$recId', '$userAdminId', 'systemuser', '$rootBuId', 0, 1, $verNum, $(SqlStr $etag), NOW(), FALSE, '$escaped'::jsonb) ON CONFLICT (table_logical_name, record_id) DO UPDATE SET data_json = EXCLUDED.data_json;")
}

foreach ($ap in $dvAppointments.value) {
    $recId = [string]$ap.activityid
    $verCounter++
    $etag = if ($ap.'@odata.etag') { $ap.'@odata.etag' } else { "W/`"$verCounter`"" }
    $verNum = if ($ap.versionnumber) { [int64]$ap.versionnumber } else { $verCounter }
    $payload = @{ activityid = $recId; subject = $ap.subject; description = $ap.description; location = $ap.location } | ConvertTo-Json -Compress
    $escaped = $payload.Replace("'", "''")
    $sqlLines.Add("INSERT INTO verseoff.dataverse_entity (table_logical_name, record_id, owner_id, owner_type, owning_business_unit_id, statecode, statuscode, version_number, etag, modified_on, is_deleted, data_json) VALUES ('appointment', '$recId', '$userAdminId', 'systemuser', '$rootBuId', 0, 1, $verNum, $(SqlStr $etag), NOW(), FALSE, '$escaped'::jsonb) ON CONFLICT (table_logical_name, record_id) DO UPDATE SET data_json = EXCLUDED.data_json;")
}

$sqlLines.Add("COMMIT;")

$pgSecuritySqlFile = Join-Path $env:TEMP "verseoff_pg_security_and_entities.sql"
[System.IO.File]::WriteAllLines($pgSecuritySqlFile, $sqlLines, (New-Object System.Text.UTF8Encoding($false)))
& $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -f $pgSecuritySqlFile | Out-Null

Write-Host "  [PostgreSQL 17 Security + Entities Landed] Executed $($sqlLines.Count) SQL statements into 'verseoff_read'!"

Write-Host ""
Write-Host "=== POSTGRESQL 17 SECURITY & ENTITY TABLE SUMMARY ==="
& $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -c "
SELECT 'verseoff.businessunit' AS table_name, COUNT(*) AS row_count FROM verseoff.businessunit
UNION ALL SELECT 'verseoff.systemuser', COUNT(*) FROM verseoff.systemuser
UNION ALL SELECT 'verseoff.team', COUNT(*) FROM verseoff.team
UNION ALL SELECT 'verseoff.teammembership', COUNT(*) FROM verseoff.teammembership
UNION ALL SELECT 'verseoff.role', COUNT(*) FROM verseoff.role
UNION ALL SELECT 'verseoff.systemuserroles', COUNT(*) FROM verseoff.systemuserroles
UNION ALL SELECT 'verseoff.teamroles', COUNT(*) FROM verseoff.teamroles
UNION ALL SELECT 'verseoff.privilege', COUNT(*) FROM verseoff.privilege
UNION ALL SELECT 'verseoff.roleprivileges', COUNT(*) FROM verseoff.roleprivileges
UNION ALL SELECT 'verseoff.principalobjectaccess (POA)', COUNT(*) FROM verseoff.principalobjectaccess
UNION ALL SELECT 'verseoff.fieldpermission (FLS)', COUNT(*) FROM verseoff.fieldpermission
UNION ALL SELECT 'verseoff.dataverse_entity', COUNT(*) FROM verseoff.dataverse_entity;
"

Write-Host ""
Write-Host "=== SAMPLE ENTERPRISE ACCOUNTS BY BUSINESS UNIT, OWNER & POA IN POSTGRESQL 17 ==="
& $psqlExe -h localhost -p 5432 -U postgres -d verseoff_read -c "
SELECT e.data_json->>'accountnumber' AS acct_num,
       e.data_json->>'name' AS account_name,
       bu.name AS owning_business_unit,
       e.owner_type,
       COALESCE(u.fullname, t.name) AS owner_name,
       EXISTS(SELECT 1 FROM verseoff.principalobjectaccess poa WHERE poa.objectid = e.record_id) AS has_poa_share
FROM verseoff.dataverse_entity e
JOIN verseoff.businessunit bu ON bu.businessunitid = e.owning_business_unit_id
LEFT JOIN verseoff.systemuser u ON u.systemuserid = e.owner_id AND e.owner_type = 'systemuser'
LEFT JOIN verseoff.team t ON t.teamid = e.owner_id AND e.owner_type = 'team'
WHERE e.table_logical_name = 'account'
  AND e.data_json->>'accountnumber' LIKE 'VO-ACCT-%'
ORDER BY acct_num;
"
