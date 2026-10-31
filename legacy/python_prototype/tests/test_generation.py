import json

import pytest

from VerseOff.generation import (
    MAX_GENERATED_ENTITIES,
    GenerationRequest,
    ModelDrivenApp,
    SourceProjectBuilder,
    form_dependency_names,
    normalize_entity_names,
    project_directory_name,
)


class FakeFetcher:
    def __init__(self, org_url, token):
        assert token == "token"
        self.org_url = org_url.rstrip("/")

    def get_bpf_definitions_for_app(self, app_module_id):
        assert app_module_id == "app-id"
        return {
            "service_process": {
                "primary_entity": "account",
                "stages": [{"entity": "contact"}],
            }
        }

    def get_app_sitemap(self, app_module_id):
        return {
            "areas": [
                {
                    "id": "sales",
                    "title": "Sales",
                    "groups": [
                        {
                            "id": "customers",
                            "title": "Customers",
                            "subareas": [
                                {
                                    "id": "account",
                                    "entity": "account",
                                    "title": "Accounts",
                                }
                            ],
                        }
                    ],
                }
            ]
        }

    def get_timeline_organization_settings(self):
        return {
            "max_upload_file_size": 94371840,
            "blocked_extensions": [],
        }

    def get_client_context(self):
        return {
            "version": "9.2.0.0",
            "user": {
                "id": "user-id",
                "name": "Test User",
                "languageId": 1033,
                "roles": [],
            },
            "organization": {
                "id": "organization-id",
                "uniqueName": "testorg",
                "languageId": 1033,
            },
        }

    def get_entity_definition(self, logical_name):
        definition = {
            "LogicalName": logical_name,
            "DisplayName": {
                "UserLocalizedLabel": {
                    "Label": logical_name.title(),
                }
            },
            "EntitySetName": f"{logical_name}s",
            "PrimaryIdAttribute": f"{logical_name}id",
            "attributes": [],
            "saved_queries": [],
        }
        if logical_name == "account":
            definition["forms"] = [{
                "type": 2,
                "name": "Account form",
                "formxml": """
                  <form><tabs><tab><columns><column><sections>
                    <section><rows><row><cell>
                      <control indicationOfSubgrid="true">
                        <parameters>
                          <TargetEntityType>activitypointer</TargetEntityType>
                        </parameters>
                      </control>
                    </cell></row></rows></section>
                  </sections></column></columns></tab></tabs></form>
                """,
            }]
        elif logical_name == "activitypointer":
            definition["forms"] = [{
                "type": 2,
                "name": "Activity form",
                "formxml": """
                  <form><tabs><tab><columns><column><sections>
                    <section><rows><row><cell>
                      <control indicationOfSubgrid="true">
                        <parameters>
                          <TargetEntityType>annotation</TargetEntityType>
                        </parameters>
                      </control>
                    </cell></row></rows></section>
                  </sections></column></columns></tab></tabs></form>
                """,
            }]
        return definition


class FakeGenerator:
    manifests = []

    def __init__(self, output_dir):
        self.output_dir = output_dir

    def generate(self, manifest):
        self.manifests.append(manifest)
        return ["main.py", "manifest.json"]


def test_source_project_builder_generates_selected_app_manifest(tmp_path):
    app = ModelDrivenApp(
        app_module_id="app-id",
        app_module_id_unique="app-unique-id",
        name="Sales Hub",
        unique_name="msdyn_SalesHub",
    )
    progress = []
    builder = SourceProjectBuilder(FakeFetcher, FakeGenerator)
    result = builder.generate(
        GenerationRequest(
            org_url="https://test.crm.dynamics.com/",
            auth_token="token",
            selected_app=app,
            entity_names=["account"],
            output_dir=tmp_path / "Sales-Hub",
        ),
        progress=lambda current, total, status: progress.append(
            (current, total, status)
        ),
    )

    assert result.output_dir == (tmp_path / "Sales-Hub").resolve()
    assert result.manifest["app_name"] == "Sales Hub"
    assert result.manifest["source_app"]["appmoduleid"] == "app-id"
    assert result.manifest["client_context"]["user"]["id"] == "user-id"
    assert [
        entity["LogicalName"]
        for entity in result.manifest["entities"]
    ] == ["account", "contact", "activitypointer", "annotation"]
    assert all(
        entity["_verseoff_dependency_only"] is True
        for entity in result.manifest["entities"][2:]
    )
    assert result.generated_files == ("main.py", "manifest.json")
    assert progress[-1][0] == progress[-1][1]

    log_text = (
        result.output_dir / "generation_log.txt"
    ).read_text(encoding="utf-8")
    assert "Target app: Sales Hub" in log_text
    assert "- contact" in log_text


def test_builder_expands_relative_webresource_dependencies(tmp_path):
    class ResourceFetcher(FakeFetcher):
        def get_bpf_definitions_for_app(self, app_module_id):
            return {}

        def get_entity_definition(self, logical_name):
            definition = super().get_entity_definition(logical_name)
            definition["forms"] = [{
                "type": 2,
                "name": "Resource form",
                "formxml": """
                  <form><tabs><tab><columns><column><sections>
                    <section><rows><row><cell>
                      <control id="Html"
                        classid="{FD2A7985-3187-444e-a0e2-63b716fbd9d7}">
                        <parameters>
                          <Url>$webresource:new_/pages/page.html</Url>
                        </parameters>
                      </control>
                    </cell></row></rows></section>
                  </sections></column></columns></tab></tabs></form>
                """,
            }]
            return definition

        def get_web_resource(self, name):
            resources = {
                "new_/pages/page.html": {
                    "name": name,
                    "type": 1,
                    "content": (
                        '<script src="../scripts/page.js"></script>'
                        '<img src="../images/logo.png">'
                    ),
                },
                "new_/scripts/page.js": {
                    "name": name,
                    "type": 3,
                    "content": "window.pageLoaded = true;",
                },
                "new_/images/logo.png": {
                    "name": name,
                    "type": 5,
                    "content_base64": "iVBORw0KGgo=",
                },
            }
            return resources.get(name)

    generator = FakeGenerator
    generator.manifests = []
    builder = SourceProjectBuilder(ResourceFetcher, generator)
    result = builder.generate(GenerationRequest(
        org_url="https://test.crm.dynamics.com",
        auth_token="token",
        selected_app=ModelDrivenApp(
            app_module_id="app-id",
            name="Resource App",
        ),
        entity_names=["account"],
        output_dir=tmp_path / "resource-app",
        bpf_definitions={},
    ))

    assert [
        resource["name"]
        for resource in result.manifest["web_resources"]
    ] == [
        "new_/pages/page.html",
        "new_/scripts/page.js",
        "new_/images/logo.png",
    ]


def test_generation_helpers_validate_and_normalize_names():
    assert project_directory_name("  Sales Hub / Mobile  ") == (
        "Sales-Hub-Mobile"
    )
    assert normalize_entity_names(
        ["Account", "contact", "account"]
    ) == ["account", "contact"]


def test_form_dependencies_include_lookups_quick_views_and_subgrids():
    dependencies = form_dependency_names({
        "LogicalName": "incident",
        "lookup_targets": {"customerid": ["account", "contact"]},
        "forms": [
            {
                "type": 2,
                "name": "Case",
                "formxml": """
                  <form><tabs><tab><columns><column><sections>
                    <section><rows>
                      <row><cell><control datafieldname="customerid" /></cell></row>
                      <row><cell><control indicationOfSubgrid="true">
                        <parameters>
                          <TargetEntityType>activitypointer</TargetEntityType>
                        </parameters>
                      </control></cell></row>
                      <row><cell><control>
                        <parameters><QuickForms>
                          &lt;QuickFormIds&gt;
                            &lt;QuickFormId entityname="slakpiinstance"&gt;
                              form-id
                            &lt;/QuickFormId&gt;
                          &lt;/QuickFormIds&gt;
                        </QuickForms></parameters>
                      </control></cell></row>
                    </rows></section>
                  </sections></column></columns></tab></tabs></form>
                """,
            }
        ],
    })

    assert dependencies == [
        "account",
        "contact",
        "activitypointer",
        "slakpiinstance",
    ]


def test_builder_rejects_oversized_initial_selection(tmp_path):
    builder = SourceProjectBuilder(FakeFetcher, FakeGenerator)
    entity_names = [
        f"table_{index}"
        for index in range(MAX_GENERATED_ENTITIES + 1)
    ]

    with pytest.raises(
        ValueError,
        match="Select no more than",
    ):
        builder.generate(GenerationRequest(
            org_url="https://test.crm.dynamics.com",
            auth_token="token",
            selected_app=ModelDrivenApp(
                app_module_id="app-id",
                name="Large App",
            ),
            entity_names=entity_names,
            output_dir=tmp_path / "large-app",
            bpf_definitions={},
        ))


def test_builder_expands_timeline_support_tables(tmp_path):
    class TimelineFetcher(FakeFetcher):
        def get_bpf_definitions_for_app(self, app_module_id):
            return {}

        def get_entity_definition(self, logical_name):
            definition = super().get_entity_definition(logical_name)
            if logical_name == "account":
                definition["forms"] = [{
                    "type": 2,
                    "name": "Account Timeline",
                    "formxml": """
                      <form><tabs><tab><columns><column><sections>
                        <section><rows><row><cell>
                          <control id="notescontrol"
                            classid="{06375649-C143-495E-A496-C962E5B4488E}">
                            <parameters>
                              <UClientUniqueName>Timeline</UClientUniqueName>
                              <UClientModules>Notes</UClientModules>
                            </parameters>
                          </control>
                        </cell></row></rows></section>
                      </sections></column></columns></tab></tabs></form>
                    """,
                }]
            return definition

    builder = SourceProjectBuilder(TimelineFetcher, FakeGenerator)
    result = builder.generate(GenerationRequest(
        org_url="https://test.crm.dynamics.com/",
        auth_token="token",
        selected_app=ModelDrivenApp(
            app_module_id="app-id",
            name="Timeline App",
        ),
        entity_names=["account"],
        output_dir=tmp_path / "Timeline-App",
        bpf_definitions={},
    ))

    entities = {
        item["LogicalName"]: item
        for item in result.manifest["entities"]
    }
    assert {"account", "annotation", "systemuser"}.issubset(entities)
    assert entities["annotation"]["_verseoff_dependency_only"] is True
