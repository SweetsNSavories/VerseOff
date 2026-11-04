-- ================================================================================
-- VerseOff On-Premises PostgreSQL 17 Schema for Dataverse Web API v9.2 OData + Security Model
-- Mirrors Dataverse Business Units, SystemUsers, Teams, TeamMemberships, Roles,
-- Privileges, RolePrivileges (Basic=1, Local=2, Deep=4, Global=8),
-- PrincipalObjectAccess (POA record sharing), Field-Level Security (FLS),
-- and the Unified OData v4 Entity Table (verseoff.dataverse_entity).
-- ================================================================================

CREATE SCHEMA IF NOT EXISTS verseoff;

CREATE TABLE IF NOT EXISTS verseoff.businessunit (
    businessunitid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    parentbusinessunitid UUID NULL REFERENCES verseoff.businessunit(businessunitid),
    organizationid UUID NOT NULL,
    isdisabled BOOLEAN NOT NULL DEFAULT FALSE,
    modifiedon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_verseoff_businessunit_parent
    ON verseoff.businessunit(parentbusinessunitid);

CREATE TABLE IF NOT EXISTS verseoff.systemuser (
    systemuserid UUID PRIMARY KEY,
    azureactivedirectoryobjectid UUID NULL,
    fullname TEXT NOT NULL,
    domainname TEXT NOT NULL,
    businessunitid UUID NOT NULL REFERENCES verseoff.businessunit(businessunitid),
    organizationid UUID NOT NULL,
    isdisabled BOOLEAN NOT NULL DEFAULT FALSE,
    modifiedon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_verseoff_systemuser_aad
    ON verseoff.systemuser(azureactivedirectoryobjectid);
CREATE INDEX IF NOT EXISTS ix_verseoff_systemuser_bu
    ON verseoff.systemuser(businessunitid);

CREATE TABLE IF NOT EXISTS verseoff.team (
    teamid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    businessunitid UUID NOT NULL REFERENCES verseoff.businessunit(businessunitid),
    teamtype INT NOT NULL DEFAULT 0,
    isdefault BOOLEAN NOT NULL DEFAULT FALSE,
    modifiedon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_verseoff_team_bu
    ON verseoff.team(businessunitid);

CREATE TABLE IF NOT EXISTS verseoff.teammembership (
    teamid UUID NOT NULL REFERENCES verseoff.team(teamid) ON DELETE CASCADE,
    systemuserid UUID NOT NULL REFERENCES verseoff.systemuser(systemuserid) ON DELETE CASCADE,
    PRIMARY KEY (teamid, systemuserid)
);

CREATE INDEX IF NOT EXISTS ix_verseoff_teammembership_user
    ON verseoff.teammembership(systemuserid);

CREATE TABLE IF NOT EXISTS verseoff.role (
    roleid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    businessunitid UUID NOT NULL REFERENCES verseoff.businessunit(businessunitid),
    parentrootroleid UUID NULL,
    roletemplateid UUID NULL
);

CREATE INDEX IF NOT EXISTS ix_verseoff_role_bu
    ON verseoff.role(businessunitid);
CREATE INDEX IF NOT EXISTS ix_verseoff_role_parentroot
    ON verseoff.role(parentrootroleid);

CREATE TABLE IF NOT EXISTS verseoff.systemuserroles (
    systemuserid UUID NOT NULL REFERENCES verseoff.systemuser(systemuserid) ON DELETE CASCADE,
    roleid UUID NOT NULL REFERENCES verseoff.role(roleid) ON DELETE CASCADE,
    PRIMARY KEY (systemuserid, roleid)
);

CREATE TABLE IF NOT EXISTS verseoff.teamroles (
    teamid UUID NOT NULL REFERENCES verseoff.team(teamid) ON DELETE CASCADE,
    roleid UUID NOT NULL REFERENCES verseoff.role(roleid) ON DELETE CASCADE,
    PRIMARY KEY (teamid, roleid)
);

CREATE TABLE IF NOT EXISTS verseoff.privilege (
    privilegeid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    table_logical_name TEXT NOT NULL,
    privilege_type TEXT NOT NULL,
    accessright INT NOT NULL DEFAULT 1,
    canbebasic BOOLEAN NOT NULL DEFAULT TRUE,
    canbelocal BOOLEAN NOT NULL DEFAULT TRUE,
    canbedeep BOOLEAN NOT NULL DEFAULT TRUE,
    canbeglobal BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS ix_verseoff_privilege_table_type
    ON verseoff.privilege(LOWER(table_logical_name), LOWER(privilege_type));

CREATE TABLE IF NOT EXISTS verseoff.roleprivileges (
    roleid UUID NOT NULL,
    privilegeid UUID NOT NULL REFERENCES verseoff.privilege(privilegeid) ON DELETE CASCADE,
    privilegedepthmask INT NOT NULL,
    PRIMARY KEY (roleid, privilegeid)
);

CREATE INDEX IF NOT EXISTS ix_verseoff_roleprivileges_priv
    ON verseoff.roleprivileges(privilegeid);

CREATE TABLE IF NOT EXISTS verseoff.principalobjectaccess (
    principalobjectaccessid UUID PRIMARY KEY,
    principalid UUID NOT NULL,
    principaltypecode TEXT NOT NULL,
    objectid UUID NOT NULL,
    objecttypecode TEXT NOT NULL,
    accessrightsmask INT NOT NULL DEFAULT 0,
    inheritedaccessrightsmask INT NOT NULL DEFAULT 0,
    changedon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_verseoff_poa_principal_object
    ON verseoff.principalobjectaccess(principalid, LOWER(objecttypecode), objectid);

CREATE TABLE IF NOT EXISTS verseoff.fieldsecurityprofile (
    fieldsecurityprofileid UUID PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verseoff.fieldpermission (
    fieldpermissionid UUID PRIMARY KEY,
    fieldsecurityprofileid UUID NOT NULL REFERENCES verseoff.fieldsecurityprofile(fieldsecurityprofileid) ON DELETE CASCADE,
    entityname TEXT NOT NULL,
    attributelogicalname TEXT NOT NULL,
    canread INT NOT NULL DEFAULT 0,
    canupdate INT NOT NULL DEFAULT 0,
    cancreate INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_verseoff_fieldpermission_entity
    ON verseoff.fieldpermission(LOWER(entityname));

CREATE TABLE IF NOT EXISTS verseoff.systemuserprofiles (
    systemuserid UUID NOT NULL REFERENCES verseoff.systemuser(systemuserid) ON DELETE CASCADE,
    fieldsecurityprofileid UUID NOT NULL REFERENCES verseoff.fieldsecurityprofile(fieldsecurityprofileid) ON DELETE CASCADE,
    PRIMARY KEY (systemuserid, fieldsecurityprofileid)
);

CREATE TABLE IF NOT EXISTS verseoff.teamprofiles (
    teamid UUID NOT NULL REFERENCES verseoff.team(teamid) ON DELETE CASCADE,
    fieldsecurityprofileid UUID NOT NULL REFERENCES verseoff.fieldsecurityprofile(fieldsecurityprofileid) ON DELETE CASCADE,
    PRIMARY KEY (teamid, fieldsecurityprofileid)
);

CREATE TABLE IF NOT EXISTS verseoff.dataverse_entity (
    table_logical_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    owner_type TEXT NOT NULL DEFAULT 'systemuser',
    owning_business_unit_id UUID NOT NULL REFERENCES verseoff.businessunit(businessunitid),
    statecode INT NOT NULL DEFAULT 0,
    statuscode INT NOT NULL DEFAULT 1,
    version_number BIGINT NOT NULL DEFAULT 1,
    etag TEXT NOT NULL,
    modified_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    data_json JSONB NOT NULL,
    PRIMARY KEY (table_logical_name, record_id)
);

CREATE INDEX IF NOT EXISTS ix_verseoff_dataverse_entity_lookup
    ON verseoff.dataverse_entity(LOWER(table_logical_name), owning_business_unit_id, owner_id)
    WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_verseoff_dataverse_entity_version
    ON verseoff.dataverse_entity(LOWER(table_logical_name), version_number);
