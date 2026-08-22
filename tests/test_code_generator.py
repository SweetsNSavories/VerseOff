import pytest
import base64
import importlib.util
import json
import os
import py_compile
import sys
from pathlib import Path
from VerseOff.code_generator import CodeGenerator

@pytest.fixture
def dummy_manifest():
    return {
        "app_name": "Test App",
        "org_url": "https://test.crm.dynamics.com",
        "client_id": "test-client-id",
        "sync_interval": 300,
        "auto_sync_on_start": False,
        "source_app": {
            "appmoduleid": "app-id",
            "name": "Test App",
            "uniquename": "test_app",
        },
        "entities": [
            {
                "LogicalName": "account",
                "DisplayName": {"UserLocalizedLabel": {"Label": "Account"}},
                "EntitySetName": "accounts",
                "PrimaryIdAttribute": "accountid",
                "PrimaryNameAttribute": "name",
                "IsAvailableOffline": True,
                "ChangeTrackingEnabled": True,
                "attributes": [
                    {
                        "LogicalName": "accountid",
                        "IsValidForRead": True,
                        "IsValidForCreate": True,
                        "IsValidForUpdate": False,
                    },
                    {
                        "LogicalName": "name",
                        "IsValidForRead": True,
                        "IsValidForCreate": True,
                        "IsValidForUpdate": True,
                    },
                    {
                        "LogicalName": "primarycontactid",
                        "AttributeType": "Lookup",
                        "IsValidForRead": True,
                        "IsValidForCreate": True,
                        "IsValidForUpdate": True,
                    },
                    {
                        "LogicalName": "createdon",
                        "AttributeType": "DateTime",
                        "IsValidForRead": True,
                        "IsValidForCreate": False,
                        "IsValidForUpdate": False,
                    },
                ],
                "lookup_targets": {
                    "primarycontactid": ["contact"],
                },
                "lookup_bindings": {
                    "primarycontactid": {
                        "contact": {
                            "navigation_property": "primarycontactid",
                            "entity_set_name": "contacts",
                        }
                    }
                },
                "saved_queries": [
                    {
                        "savedqueryid": "view-id",
                        "name": "Active Accounts",
                        "returnedtypecode": "account",
                        "querytype": 0,
                        "isdefault": True,
                        "fetchxml": "<fetch />",
                        "layoutxml": "<grid />",
                    }
                ],
            }
        ],
        "sitemap": {
            "areas": [
                {
                    "id": "Sales",
                    "title": "Sales Area",
                    "groups": [
                        {
                            "id": "Customers",
                            "title": "Customers",
                            "subareas": [
                                {"id": "account", "title": "Accounts", "entity": "account"}
                            ]
                        }
                    ]
                }
            ]
        },
        "bpfs": {}
    }

def test_code_generator_success(tmp_path, dummy_manifest):
    out_dir = str(tmp_path / "GeneratedApp")

    gen = CodeGenerator(out_dir)
    generated_files = gen.generate(dummy_manifest)

    required_files = {
        "main.py",
        "db.py",
        "sync_engine.py",
        "timeline_metadata.py",
        "client_script_metadata.py",
        "pcf_metadata.py",
        "timeline_widget.py",
        "ui_components.py",
        "xrm_form_renderer.py",
        "view_parser.py",
        "manifest.json",
        "requirements.txt",
        "README.md",
        ".gitignore",
        "run_app.bat",
        "build_app.py",
        "verseoff_bridge.js",
        "verseoff_pcf_host.js",
        "webresources/ClientGlobalContext.js.aspx",
        "fluent_chevron.svg",
    }
    assert required_files.issubset(set(generated_files))
    assert all(os.path.exists(os.path.join(out_dir, name)) for name in required_files)

    for filename in [
        "main.py",
        "db.py",
        "sync_engine.py",
        "timeline_metadata.py",
        "client_script_metadata.py",
        "pcf_metadata.py",
        "timeline_widget.py",
        "ui_components.py",
        "xrm_form_renderer.py",
        "view_parser.py",
        "build_app.py",
        "data_providers.py",
    ]:
        py_compile.compile(
            os.path.join(out_dir, filename),
            doraise=True,
        )

    with open(os.path.join(out_dir, "main.py"), encoding="utf-8") as file:
        main_source = file.read()
    assert "class OfflineApp(QMainWindow)" in main_source
    assert "XrmFormRenderer" in main_source
    assert "area_service" not in main_source
    assert "self.config.get(\"sitemap\"" in main_source

    with open(
        os.path.join(out_dir, "sync_engine.py"),
        encoding="utf-8",
    ) as file:
        sync_source = file.read()
    assert "mock_status" not in sync_source
    assert "odata.track-changes" in sync_source
    assert "self.session.patch" in sync_source

    with open(os.path.join(out_dir, "db.py"), encoding="utf-8") as file:
        db_source = file.read()
    assert "_seed_saved_queries" in db_source
    assert "delta_link TEXT" in db_source

    build_source = (
        Path(out_dir) / "build_app.py"
    ).read_text(encoding="utf-8")
    assert "verseoff_pcf_host.js" in build_source
    assert "webresources_path" in build_source

    with open(
        os.path.join(out_dir, "manifest.json"),
        encoding="utf-8",
    ) as file:
        generated_manifest = json.load(file)
    assert generated_manifest["source_app"]["appmoduleid"] == "app-id"


def test_code_generator_materializes_binary_and_resx_resources(
    tmp_path,
    dummy_manifest,
):
    binary = b"\x89PNG\r\n\x1a\nbinary"
    manifest = dict(dummy_manifest)
    manifest["web_resources"] = [
        {
            "name": "new_/images/icon.png",
            "type": 5,
            "content_base64": base64.b64encode(binary).decode("ascii"),
        },
        {
            "name": "new_/strings/app.1033.resx",
            "type": 12,
            "content": (
                '<?xml version="1.0" encoding="utf-8"?>'
                '<root><data name="Greeting"><value>Hello</value>'
                "</data></root>"
            ),
        },
    ]
    output = tmp_path / "GeneratedApp"

    CodeGenerator(str(output)).generate(manifest)

    assert (
        output / "webresources" / "new_" / "images" / "icon.png"
    ).read_bytes() == binary
    generated_manifest = json.loads(
        (output / "manifest.json").read_text(encoding="utf-8")
    )
    resx = next(
        resource
        for resource in generated_manifest["web_resources"]
        if resource["type"] == 12
    )
    assert resx["localized_strings"] == {"Greeting": "Hello"}


def test_code_generator_preserves_custom_events(tmp_path, dummy_manifest):
    out_dir = str(tmp_path / "GeneratedApp")
    generator = CodeGenerator(out_dir)
    generator.generate(dummy_manifest)
    custom_events_path = os.path.join(out_dir, "custom_events.py")
    with open(custom_events_path, "w", encoding="utf-8") as file:
        file.write("CUSTOM_CODE = True\n")

    generator.generate(dummy_manifest)

    with open(custom_events_path, encoding="utf-8") as file:
        assert file.read() == "CUSTOM_CODE = True\n"


def test_generated_database_and_sync_use_real_dataverse_flow(
    tmp_path,
    dummy_manifest,
    monkeypatch,
):
    out_dir = tmp_path / "GeneratedApp"
    CodeGenerator(str(out_dir)).generate(dummy_manifest)
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "app-data"))

    db_spec = importlib.util.spec_from_file_location(
        "db",
        out_dir / "db.py",
    )
    db_module = importlib.util.module_from_spec(db_spec)
    monkeypatch.setitem(sys.modules, "db", db_module)
    db_spec.loader.exec_module(db_module)

    sync_spec = importlib.util.spec_from_file_location(
        "generated_sync_engine",
        out_dir / "sync_engine.py",
    )
    sync_module = importlib.util.module_from_spec(sync_spec)
    sync_spec.loader.exec_module(sync_module)

    database = db_module.LocalDatabase()
    with database.get_connection() as connection:
        saved_query = connection.execute(
            """
            SELECT name
            FROM saved_queries
            WHERE savedqueryid = 'view-id'
            """
        ).fetchone()
    assert saved_query["name"] == "Active Accounts"

    database.upsert_record(
        "account",
        "account-1",
        {
            "accountid": "account-1",
            "name": "Local update",
            "primarycontactid": "contact-1",
            "_primarycontactid_value": "contact-1",
            "_regardingobjectid_value": "parent-1",
            "description": "Timeline searchable content",
            (
                "_primarycontactid_value@"
                "Microsoft.Dynamics.CRM.lookuplogicalname"
            ): "contact",
            "@odata.etag": 'W/"1"',
        },
        sync_status="pending_update",
    )
    database.set_timeline_preferences(
        "timeline-1",
        "account",
        {"order": "ascending"},
    )
    assert database.get_timeline_preferences(
        "timeline-1",
        "account",
    ) == {"order": "ascending"}
    database.set_timeline_pin(
        "timeline-1",
        "account",
        "account-1",
        True,
    )
    assert ("account", "account-1") in database.get_timeline_pins(
        "timeline-1"
    )
    action_id = database.queue_timeline_action(
        "timeline-1",
        "account",
        "account-1",
        "complete",
        {"statecode": 1},
    )
    assert database.list_timeline_actions()[0]["action_id"] == action_id
    assert (
        "account",
        "account-1",
    ) in database.search_timeline_record_ids(
        "parent-1",
        "searchable",
    )

    class FakeResponse:
        def __init__(self, status_code, payload=None):
            self.status_code = status_code
            self._payload = payload
            self.content = b"x" if payload is not None else b""
            self.text = ""
            self.ok = 200 <= status_code < 300

        def json(self):
            return self._payload or {}

        def raise_for_status(self):
            if not self.ok:
                raise AssertionError(f"Unexpected HTTP {self.status_code}")

    class FakeSession:
        def __init__(self):
            self.patch_calls = []
            self.get_calls = []

        def patch(self, url, headers, json, timeout):
            self.patch_calls.append((url, headers, json, timeout))
            return FakeResponse(204)

        def get(self, url, headers, timeout):
            self.get_calls.append((url, headers, timeout))
            return FakeResponse(
                200,
                {
                    "value": [
                        {
                            "accountid": "account-1",
                            "name": "Server value",
                            "_primarycontactid_value": "contact-2",
                            (
                                "_primarycontactid_value@"
                                "Microsoft.Dynamics.CRM.lookuplogicalname"
                            ): "contact",
                            "@odata.etag": 'W/"2"',
                        }
                    ],
                    "@odata.deltaLink": (
                        "https://test.crm.dynamics.com/"
                        "api/data/v9.2/accounts?$deltatoken=2"
                    ),
                },
            )

    session = FakeSession()
    engine = sync_module.SyncEngine(
        str(out_dir / "manifest.json"),
        database=database,
        session=session,
        token_provider=lambda: "access-token",
    )
    summary = engine.sync_all()

    assert summary["pushed"] == 1
    assert summary["pulled"] == 1
    assert session.patch_calls[0][2] == {
        "name": "Local update",
        "primarycontactid@odata.bind": "/contacts(contact-1)",
    }
    assert session.patch_calls[0][1]["If-Match"] == 'W/"1"'
    assert "odata.track-changes" in session.get_calls[0][1]["Prefer"]
    assert "_primarycontactid_value" in session.get_calls[0][0]
    assert "$select=accountid,name,primarycontactid" not in (
        session.get_calls[0][0]
    )
    assert "createdon" in session.get_calls[0][0]
    assert database.get_record("account", "account-1")["name"] == (
        "Server value"
    )
    assert database.get_record(
        "account",
        "account-1",
    )["primarycontactid"] == "contact-2"
    assert database.list_timeline_actions("completed")[0][
        "action_id"
    ] == action_id
