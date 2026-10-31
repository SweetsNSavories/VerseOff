import pytest
import requests_mock
import base64
import io
import sqlite3
import zipfile
from VerseOff.metadata_fetcher import (
    MetadataFetcher,
    _parse_ribbon_xml,
    _parse_sitemap_hierarchy,
)
from VerseOff.schema_builder import persist_entity_metadata

@pytest.fixture
def mock_env():
    with requests_mock.Mocker() as m:
        fetcher = MetadataFetcher(
            "https://org.crm.dynamics.com",
            "fake_token",
            use_cache=False,
        )
        yield m, fetcher

def test_get_app_modules(mock_env):
    m, fetcher = mock_env
    
    # Mock /appmodules response
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules", json={
        "value": [
            {
                "appmoduleid": "test-id-1",
                "appmoduleidunique": "unique-id-1",
                "name": "Test App 1"
            }
        ]
    })
    
    apps = fetcher.get_app_modules()
    assert len(apps) == 1
    assert apps[0]["appmoduleid"] == "test-id-1"
    assert m.request_history[0].headers["Authorization"] == (
        "Bearer fake_token"
    )

def test_get_client_context_includes_user_org_locale_and_roles(mock_env):
    m, fetcher = mock_env
    base = "https://org.crm.dynamics.com/api/data/v9.2"
    m.get(f"{base}/WhoAmI", json={
        "UserId": "user-id",
        "OrganizationId": "org-id",
    })
    m.get(f"{base}/systemusers(user-id)", json={
        "systemuserid": "user-id",
        "fullname": "Ada Lovelace",
        "_transactioncurrencyid_value": "currency-id",
    })
    m.get(f"{base}/organizations(org-id)", json={
        "organizationid": "org-id",
        "uniquename": "contoso",
        "name": "Contoso",
        "languagecode": 1033,
        "_basecurrencyid_value": "currency-id",
        "isautosaveenabled": True,
    })
    m.get(f"{base}/usersettingscollection", json={"value": [{
        "uilanguageid": 1036,
        "localeid": 1036,
        "timezonecode": 105,
    }]})
    m.get(
        f"{base}/systemusers(user-id)/systemuserroles_association",
        json={"value": [{"roleid": "role-id", "name": "Salesperson"}]},
    )

    context = fetcher.get_client_context()

    assert context["user"]["name"] == "Ada Lovelace"
    assert context["user"]["languageId"] == 1036
    assert context["user"]["roles"] == [{
        "id": "role-id",
        "name": "Salesperson",
    }]
    assert context["organization"]["uniqueName"] == "contoso"
    assert context["organization"]["isAutoSaveEnabled"] is True


def test_get_custom_control_fetches_manifest_and_resource_links(mock_env):
    m, fetcher = mock_env
    base = "https://org.crm.dynamics.com/api/data/v9.2"
    m.get(f"{base}/customcontrols", json={"value": [{
        "customcontrolid": "control-id",
        "name": "Contoso.Controls.Input",
        "manifest": """
          <manifest><control namespace="Contoso.Controls"
            constructor="Input" version="1.0.0"
            control-type="standard">
            <property name="value" usage="bound"
              of-type="SingleLine.Text" required="true" />
            <resources>
              <code path="bundle.js" order="1" />
            </resources>
          </control></manifest>
        """,
        "compatibledatatypes": "SingleLine.Text",
        "supportedplatform": "0",
        "version": "1.0.0",
    }]})
    m.get(f"{base}/customcontrolresources", json={"value": [{
        "customcontrolresourceid": "link-id",
        "customcontrolid": "control-id",
        "webresourceid": "resource-id",
        "name": "bundle.js",
    }]})
    m.get(f"{base}/webresourceset(resource-id)", json={
        "webresourceid": "resource-id",
        "name": "new_/controls/bundle.js",
        "displayname": "Bundle",
        "webresourcetype": 3,
        "content": base64.b64encode(b"window.bundle = true;").decode(
            "ascii"
        ),
    })

    definition = fetcher.get_custom_control(
        "Contoso.Controls.Input"
    )

    assert definition["can_host"] is True
    assert definition["compatible_data_types"] == ["SingleLine.Text"]
    assert definition["resources"][0]["web_resource_name"] == (
        "new_/controls/bundle.js"
    )


def test_get_entities_for_app(mock_env):
    m, fetcher = mock_env
    
    # Mock fetching appmoduleunique
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules(test-app-id)", json={
        "appmoduleidunique": "test-uid-123"
    })
    
    # Mock fetching components
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodulecomponents", json={
        "value": [
            {"objectid": "entity-id-1"}
        ]
    })
    
    # Mock fetching EntityDefinition
    m.get("https://org.crm.dynamics.com/api/data/v9.2/EntityDefinitions(entity-id-1)", json={
        "LogicalName": "account",
        "DataProviderId": None # Not virtual
    })
    
    entities = fetcher.get_entities_for_app("test-app-id")
    assert len(entities) == 1
    assert entities[0]["LogicalName"] == "account"

def test_get_sitemap(mock_env):
    m, fetcher = mock_env
    
    # Mock appmoduleidunique
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules(test-app)", json={
        "appmoduleidunique": "uid-sitemap"
    })
    
    # Mock components for sitemap
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodulecomponents", json={
        "value": [{"objectid": "sitemap-id"}]
    })
    
    # Mock sitemap XML
    m.get("https://org.crm.dynamics.com/api/data/v9.2/sitemaps(sitemap-id)", json={
        "sitemapxml": "<SiteMap><Area Id='Sales'><Group Id='Accounts'><SubArea Id='account' Entity='account' /></Group></Area></SiteMap>"
    })
    
    sitemap = fetcher.get_app_sitemap("test-app")
    assert len(sitemap["areas"]) == 1
    assert sitemap["areas"][0]["id"] == "Sales"
    assert sitemap["areas"][0]["groups"][0]["id"] == "Accounts"
    assert sitemap["areas"][0]["groups"][0]["subareas"][0]["entity"] == "account"


def test_sitemap_preserves_localization_and_non_entity_destinations():
    sitemap = _parse_sitemap_hierarchy("""
        <SiteMap>
          <Area Id="Service" ShowGroups="true">
            <Titles>
              <Title LCID="1033" Title="Service area" />
            </Titles>
            <Group Id="Work">
              <Titles>
                <Title LCID="1033" Title="My work" />
              </Titles>
              <SubArea Id="Cases" Entity="incident"
                       AvailableOffline="true" />
              <SubArea Id="Dashboard" DefaultDashboard="dashboard-id">
                <Titles>
                  <Title LCID="1033" Title="Dashboard" />
                </Titles>
              </SubArea>
            </Group>
          </Area>
        </SiteMap>
    """)

    area = sitemap["areas"][0]
    assert area["title"] == "Service area"
    assert area["groups"][0]["title"] == "My work"
    cases, dashboard = area["groups"][0]["subareas"]
    assert cases["destination_type"] == "entity"
    assert cases["available_offline"] is True
    assert dashboard["destination_type"] == "dashboard"
    assert dashboard["default_dashboard"] == "dashboard-id"


def test_get_bpf_entities_for_app_deduplicates_dependencies(
    mock_env,
    monkeypatch,
):
    _, fetcher = mock_env
    monkeypatch.setattr(
        fetcher,
        "get_bpf_definitions_for_app",
        lambda _: {
            "case_process": {
                "primary_entity": "incident",
                "stages": [
                    {"entity": "incident"},
                    {"entity": "account"},
                    {"entity": "contact"},
                ],
            }
        },
    )

    assert fetcher.get_bpf_entities_for_app("app-id") == [
        "incident",
        "account",
        "contact",
    ]


def test_get_lookup_bindings_uses_navigation_property_and_entity_set(
    mock_env,
    monkeypatch,
):
    _, fetcher = mock_env
    monkeypatch.setattr(
        fetcher,
        "get_entity_set_name",
        lambda logical_name: f"{logical_name}s",
    )

    bindings = fetcher.get_lookup_bindings([
        {
            "ReferencingAttribute": "parentcustomerid",
            "ReferencedEntity": "account",
            "ReferencingEntityNavigationPropertyName": (
                "parentcustomerid_account"
            ),
        },
        {
            "ReferencingAttribute": "parentcustomerid",
            "ReferencedEntity": "contact",
            "ReferencingEntityNavigationPropertyName": (
                "parentcustomerid_contact"
            ),
        },
    ])

    assert bindings["parentcustomerid"]["account"] == {
        "navigation_property": "parentcustomerid_account",
        "entity_set_name": "accounts",
    }
    assert bindings["parentcustomerid"]["contact"] == {
        "navigation_property": "parentcustomerid_contact",
        "entity_set_name": "contacts",
    }


def test_persist_entity_metadata_stores_relationship_graph(tmp_path):
    db_path = tmp_path / "entity_metadata.db"
    entity_def = {
        "LogicalName": "account",
        "PrimaryIdAttribute": "accountid",
        "attributes": [
            {"LogicalName": "accountid", "AttributeType": "UniqueIdentifier"},
            {"LogicalName": "parentaccountid", "AttributeType": "Lookup"},
        ],
        "relationships": {
            "many_to_one": [
                {
                    "SchemaName": "account_parent_account",
                    "ReferencedEntity": "account",
                    "ReferencingEntity": "account",
                    "ReferencedAttribute": "accountid",
                    "ReferencingAttribute": "parentaccountid",
                    "CascadeConfiguration": {"Assign": "NoCascade", "Delete": "Cascade"},
                }
            ]
        },
    }

    persist_entity_metadata(entity_def, str(db_path))
    with sqlite3.connect(db_path) as conn:
        row = conn.execute(
            "SELECT relationship_name, relationship_type, referenced_entity, referencing_entity FROM entity_relationships"
        ).fetchone()

    assert row == (
        "account_parent_account",
        "many_to_one",
        "account",
        "account",
    )


def test_ribbon_parser_preserves_locations_rules_and_actions():
    ribbon = _parse_ribbon_xml("""
      <RibbonDefinitions>
        <RibbonDefinition>
          <CustomActions>
            <CustomAction Id="sample.Action"
                          Location="Mscrm.Form.account.MainTab._children"
                          Sequence="42">
              <CommandUIDefinition>
                <Button Id="sample.Button"
                        Command="sample.Command"
                        LabelText="$LocLabels:sample.Label"
                        ToolTipTitle="$LocLabels:sample.Tooltip"
                        TemplateAlias="o1" />
              </CommandUIDefinition>
            </CustomAction>
          </CustomActions>
          <CommandDefinitions>
            <CommandDefinition Id="sample.Command">
              <EnableRules>
                <EnableRule Id="sample.SelectionRule" />
              </EnableRules>
              <DisplayRules>
                <DisplayRule Id="sample.StateRule" />
              </DisplayRules>
              <Actions>
                <JavaScriptFunction Library="$webresource:sample.js"
                                    FunctionName="sample.execute">
                  <StringParameter Value="value" />
                </JavaScriptFunction>
              </Actions>
            </CommandDefinition>
          </CommandDefinitions>
          <RuleDefinitions>
            <DisplayRules>
              <DisplayRule Id="sample.StateRule">
                <FormStateRule State="Existing" />
              </DisplayRule>
            </DisplayRules>
            <EnableRules>
              <EnableRule Id="sample.SelectionRule">
                <SelectionCountRule Minimum="1" Maximum="1" />
              </EnableRule>
            </EnableRules>
          </RuleDefinitions>
          <LocLabels>
            <LocLabel Id="sample.Label">
              <Titles>
                <Title languagecode="1033" description="Run sample" />
              </Titles>
            </LocLabel>
            <LocLabel Id="sample.Tooltip">
              <Titles>
                <Title languagecode="1033" description="Runs sample logic" />
              </Titles>
            </LocLabel>
          </LocLabels>
        </RibbonDefinition>
      </RibbonDefinitions>
    """)

    button = ribbon["buttons"][0]
    assert button["label"] == "Run sample"
    assert button["tooltip"] == "Runs sample logic"
    assert button["location_type"] == "form"
    assert button["sequence"] == 42
    assert button["display_rules"][0] == {
        "type": "FormStateRule",
        "state": "Existing",
    }
    assert button["enable_rules"][0]["minimum"] == "1"
    assert button["actions"][0]["function_name"] == "sample.execute"


def test_long_metadata_endpoints_have_distinct_cache_keys(
    mock_env,
):
    _, fetcher = mock_env
    form_path = fetcher._get_cache_path(
        "/RetrieveEntityRibbon("
        "EntityName='incident',RibbonLocationFilter="
        "Microsoft.Dynamics.CRM.RibbonLocationFilters'Form')"
    )
    all_path = fetcher._get_cache_path(
        "/RetrieveEntityRibbon("
        "EntityName='incident',RibbonLocationFilter="
        "Microsoft.Dynamics.CRM.RibbonLocationFilters'All')"
    )

    assert form_path != all_path


def test_ribbon_fetch_requests_all_locations(mock_env, monkeypatch):
    _, fetcher = mock_env
    archive_stream = io.BytesIO()
    with zipfile.ZipFile(archive_stream, "w") as archive:
        archive.writestr(
            "RibbonXml.xml",
            """
            <RibbonDefinitions>
              <RibbonDefinition>
                <CommandDefinitions>
                  <CommandDefinition Id="command" />
                </CommandDefinitions>
                <Button Id="Mscrm.HomepageGrid.account.Button"
                        Command="command" LabelText="Run" />
              </RibbonDefinition>
            </RibbonDefinitions>
            """,
        )
    requested = {}

    def fake_get(endpoint, timeout=30, params=None):
        requested["endpoint"] = endpoint
        return {
            "CompressedEntityXml": base64.b64encode(
                archive_stream.getvalue()
            ).decode("ascii")
        }

    monkeypatch.setattr(fetcher, "_get", fake_get)
    ribbon = fetcher._fetch_ribbon_metadata("account")

    assert "RibbonLocationFilters'All'" in requested["endpoint"]
    assert ribbon["buttons"][0]["location_type"] == "homepage_grid"


def test_ribbon_hide_custom_action_removes_target_button():
    ribbon = _parse_ribbon_xml("""
      <RibbonDefinitions><RibbonDefinition>
        <HideCustomActions>
          <HideCustomAction HideActionId="hide.sample"
                            Location="sample.Button" />
        </HideCustomActions>
        <CommandDefinitions>
          <CommandDefinition Id="sample.Command" />
        </CommandDefinitions>
        <Button Id="sample.Button" Command="sample.Command"
                LabelText="Hidden" />
      </RibbonDefinition></RibbonDefinitions>
    """)

    assert ribbon["hidden_actions"] == [{
        "id": "hide.sample",
        "location": "sample.Button",
    }]
    assert ribbon["buttons"] == []


def test_form_fetch_includes_main_quick_create_quick_view_and_card(
    mock_env,
):
    mocker, fetcher = mock_env
    mocker.get(
        "https://org.crm.dynamics.com/api/data/v9.2/systemforms",
        json={
            "value": [
                {"name": "Main", "type": 2},
                {"name": "Quick View", "type": 6},
                {"name": "Quick Create", "type": 7},
                {"name": "Card", "type": 11},
            ]
        },
    )

    forms = fetcher.get_main_and_quick_forms("account")

    assert {form["type"] for form in forms} == {2, 6, 7, 11}
    requested_filter = mocker.request_history[-1].qs["$filter"][0]
    assert "type eq 7" in requested_filter
    assert "type eq 11" in requested_filter


def test_timeline_organization_settings_parse_attachment_limits(
    mock_env,
):
    mocker, fetcher = mock_env
    mocker.get(
        "https://org.crm.dynamics.com/api/data/v9.2/organizations",
        json={
            "value": [{
                "maxuploadfilesize": 1048576,
                "blockedattachments": "exe; js; .bat",
            }]
        },
    )

    settings = fetcher.get_timeline_organization_settings()

    assert settings == {
        "max_upload_file_size": 1048576,
        "blocked_extensions": ["exe", "js", "bat"],
    }
