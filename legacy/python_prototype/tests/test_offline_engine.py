import hashlib
import pytest
import os
import sys
import json
import shutil
import sqlite3
from copy import deepcopy
from pathlib import Path
import xml.etree.ElementTree as ET
from PyQt6.QtWidgets import (
    QWidget,
    QCheckBox,
    QSpinBox,
    QComboBox,
    QLineEdit,
    QHBoxLayout,
    QGridLayout,
    QTextEdit,
)

generated_app_dir = os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out")
sys.path.append(generated_app_dir)
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "VerseOff"))

import xrm_form_renderer as renderer_module
from xrm_form_renderer import (
    PcfControlWidget,
    SubgridWidget,
    WebResourceWidget,
    XrmFormRenderer,
)
from canvas_parser import CanvasParser
from db import LocalDatabase

@pytest.fixture
def mock_manifest():
    manifest_path = os.path.join(generated_app_dir, "manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)

def test_pcf_translation_registry(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    """
    Tests that the XrmFormRenderer correctly detects PCF controls and 
    translates them into native PyQt6 widgets.
    """
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "app-data"))
    renderer = XrmFormRenderer(mock_manifest, logical_name="account")
    
    # 1. Test ToggleControl -> QCheckBox
    mock_pcf_xml = '''
    <control id="test" classid="{F9A8A302-114E-466A-B582-6771B2AE0D92}">
        <customControl name="MscrmControls.FieldControls.ToggleControl" />
    </control>
    '''
    control_elem = ET.fromstring(mock_pcf_xml)
    widget = renderer._create_widget_for_field("test_bool", "", control_elem=control_elem)
    assert isinstance(widget, QCheckBox)
    
    # 2. Test SliderControl -> QSpinBox
    mock_pcf_xml_slider = '''
    <control id="test" classid="{F9A8A302-114E-466A-B582-6771B2AE0D92}">
        <customControl name="MscrmControls.Slider.SliderControl" />
    </control>
    '''
    control_elem_slider = ET.fromstring(mock_pcf_xml_slider)
    widget2 = renderer._create_widget_for_field("test_int", "", control_elem=control_elem_slider)
    assert isinstance(widget2, QSpinBox)

def test_canvas_app_parser(qtbot):
    """
    Tests that the CanvasParser correctly unpacks Custom Page JSON
    and generates a static PyQt UI structural layout.
    """
    mock_msapp_json = '''
    {
        "Controls": [
            {
                "Name": "HeaderLabel",
                "Template": {"Name": "Label"},
                "Properties": {"Text": "Welcome to Custom Page"}
            },
            {
                "Name": "SubmitBtn",
                "Template": {"Name": "Button"},
                "Properties": {"Text": "Submit"}
            }
        ]
    }
    '''
    
    widget = CanvasParser.parse_canvas_layout(mock_msapp_json)
    assert isinstance(widget, QWidget)
    
    # Verify the layout contains the parsed components
    layout = widget.layout()
    assert layout is not None
    assert layout.count() >= 2 # Label and Button


def test_formxml_columns_form_types_controls_and_subgrid(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "layout-data"))
    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["attributes"].extend([
        {
            "LogicalName": "categorycode",
            "AttributeType": "Picklist",
        },
        {
            "LogicalName": "description",
            "AttributeType": "Memo",
        },
    ])
    account["option_sets"] = {
        "categorycode": [{"label": "Preferred", "value": 1}]
    }
    account["ribbon"] = {
        "buttons": [
            {
                "id": "sample.Form.Button",
                "control_type": "Button",
                "label": "Escalate",
                "tooltip": "Escalate this account",
                "command": "sample.Escalate",
                "location_type": "form",
                "sequence": 10,
                "display_rules": [
                    {"type": "FormStateRule", "state": "Existing"}
                ],
                "enable_rules": [],
                "actions": [],
            }
        ]
    }
    layout_xml = """
      <form><tabs><tab name="summary">
        <labels><label description="Summary" /></labels>
        <columns>
          <column width="30%"><sections>
            <section name="left" showlabel="true" labelwidth="90">
              <labels><label description="Left" /></labels>
              <rows>
                <row>
                  <cell rowspan="2"><labels>
                    <label description="Category" />
                  </labels><control id="categorycode"
                    datafieldname="categorycode" /></cell>
                  <cell><control id="name"
                    datafieldname="name" /></cell>
                </row>
                <row><cell><control id="telephone1"
                  datafieldname="telephone1" /></cell></row>
              </rows>
            </section>
          </sections></column>
          <column width="70%"><sections>
            <section name="right" showlabel="false">
              <rows>
                <row><cell><labels>
                  <label description="Description" />
                </labels><control id="description"
                  datafieldname="description" /></cell></row>
                <row><cell showlabel="false"><control id="contacts_grid"
                  indicationOfSubgrid="true"
                  classid="{F9A8A302-114E-466A-B582-6771B2AE0D92}">
                  <parameters>
                    <TargetEntityType>contact</TargetEntityType>
                    <ViewId>{4444}</ViewId>
                    <RelationshipName>account_contacts</RelationshipName>
                    <RecordsPerPage>5</RecordsPerPage>
                    <EnableQuickFind>true</EnableQuickFind>
                  </parameters>
                </control></cell></row>
                <row><cell><control id="primarycontactid"
                  datafieldname="primarycontactid"
                  classid="{270BD3DB-D9AF-4782-9025-509E298DEC0A}" />
                </cell></row>
                <row><cell showlabel="false"><control id="contact_quick_view"
                  datafieldname="primarycontactid"
                  classid="{5C5600E0-1D6E-4205-A272-BE80DA87FD42}">
                  <parameters><QuickForms>
                    &lt;QuickFormIds&gt;
                      &lt;QuickFormId entityname="contact"&gt;
                        6666
                      &lt;/QuickFormId&gt;
                    &lt;/QuickFormIds&gt;
                  </QuickForms></parameters>
                </control></cell></row>
              </rows>
            </section>
            <section name="hidden" visible="false"><rows>
              <row><cell><control id="hiddenfield"
                datafieldname="hiddenfield" /></cell></row>
            </rows></section>
          </sections></column>
        </columns>
      </tab></tabs></form>
    """
    account["forms"] = [
        {
            "formid": "main-layout",
            "name": "Layout form",
            "type": 2,
            "formxml": layout_xml,
        },
        {
            "formid": "main-secondary",
            "name": "Secondary main form",
            "type": 2,
            "formxml": layout_xml,
        },
        {
            "formid": "quick-view",
            "name": "Quick view",
            "type": 6,
            "formxml": layout_xml,
        },
    ]

    renderer = XrmFormRenderer(
        manifest,
        logical_name="account",
        form_id="main-layout",
    )
    qtbot.addWidget(renderer)

    assert renderer.form_combo.count() == 2
    assert all(
        "Quick view" not in renderer.form_combo.itemText(index)
        for index in range(renderer.form_combo.count())
    )

    tab_layout = renderer.tab_widget.widget(0).layout()
    assert isinstance(tab_layout, QHBoxLayout)
    assert tab_layout.count() == 2
    assert tab_layout.stretch(0) == 300
    assert tab_layout.stretch(1) == 700

    left_group = tab_layout.itemAt(0).widget().layout().itemAt(0).widget()
    assert isinstance(left_group.layout(), QGridLayout)
    assert (
        left_group.layout().itemAtPosition(1, 0)
        is left_group.layout().itemAtPosition(0, 0)
    )
    assert left_group.layout().itemAtPosition(1, 1) is not None
    assert isinstance(renderer.controls["categorycode"], QComboBox)
    assert renderer.controls["categorycode"].property("fluentChevron")
    assert isinstance(renderer.controls["description"], QTextEdit)
    assert type(renderer.controls["contacts_grid"]).__name__ == (
        "SubgridWidget"
    )
    assert "hidden" not in renderer.ui_hierarchy["tabs"]["summary"][
        "sections"
    ]
    assert len(renderer.ribbon_widgets) == 1
    assert renderer.ribbon_widgets[0]["widget"].text() == "Escalate"
    assert not renderer.ribbon_widgets[0]["widget"].isVisible()

    missing_relationship_grid = SubgridWidget(
        renderer,
        "contact",
        relationship_name="missing_relationship",
    )
    qtbot.addWidget(missing_relationship_grid)
    assert "not available" in missing_relationship_grid.status_label.text()

    missing_view_grid = SubgridWidget(
        renderer,
        "contact",
        view_id="missing-view",
    )
    qtbot.addWidget(missing_view_grid)
    assert "View missing-view is not available" in (
        missing_view_grid.status_label.text()
    )

    lookup = renderer.controls["primarycontactid"]
    lookup.current_id = "contact-id"
    lookup.current_logical_name = "contact"
    lookup.setText("Related contact")
    assert renderer.quick_views[0].current_key == (
        "contact",
        "contact-id",
    )

    false_or_rule = {
        "type": "OrRule",
        "children": [
            {
                "type": "Or",
                "children": [
                    {"type": "FormStateRule", "state": "Existing"}
                ],
            },
            {
                "type": "Or",
                "children": [
                    {
                        "type": "ValueRule",
                        "field": "categorycode",
                        "value": "99",
                    }
                ],
            },
        ],
    }
    assert renderer._evaluate_ribbon_rule(false_or_rule) is False
    assert renderer._evaluate_ribbon_rule({
        "type": "UnsupportedRule",
    }) is False


def test_qwebengine_loads_form_library_and_blocks_save(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "event-runtime-data"),
    )
    runtime_root = tmp_path / "runtime"
    scripts_dir = runtime_root / "webresources"
    scripts_dir.mkdir(parents=True)
    shutil.copyfile(
        Path(__file__).resolve().parents[1]
        / "VerseOff"
        / "verseoff_bridge.js",
        runtime_root / "verseoff_bridge.js",
    )
    script_text = """
window.RuntimeFixture = {
    onLoad: async function(executionContext) {
        const formContext = executionContext.getFormContext();
        const attribute = formContext.getAttribute("name");
        const grid = formContext.getControl("Contacts");
        grid.addOnLoad(RuntimeFixture.gridLoad);
        grid.addOnRecordSelect(RuntimeFixture.rowSelect);
        await Promise.resolve();
        attribute.setValue("Loaded by V8");
    },
    onSave: async function(executionContext) {
        executionContext.getEventArgs().preventDefault();
        await Promise.resolve();
    },
    gridLoad: function(executionContext) {
        const grid = executionContext.getEventSource();
        window.__gridLoaded = grid.getGrid().getTotalRecordCount();
    },
    rowSelect: function(executionContext) {
        window.__selectedRow =
            executionContext.getEventSource().getId();
    },
    ribbon: function(primaryControl) {
        primaryControl.getAttribute("name").setValue("Ribbon through V8");
    }
};
"""
    script_path = scripts_dir / "new_events.js"
    script_path.write_text(script_text, encoding="utf-8")
    monkeypatch.setattr(
        renderer_module,
        "__file__",
        str(runtime_root / "xrm_form_renderer.py"),
    )

    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "name": "Event runtime form",
        "type": 2,
        "isdefault": True,
        "formxml": """
          <form>
            <formLibraries>
              <Library name="new_events.js" />
            </formLibraries>
            <events>
              <event name="onload">
                <Handlers>
                  <Handler functionName="RuntimeFixture.onLoad"
                           libraryName="new_events.js"
                           passExecutionContext="true" />
                </Handlers>
              </event>
              <event name="onsave">
                <Handlers>
                  <Handler functionName="RuntimeFixture.onSave"
                           libraryName="new_events.js"
                           passExecutionContext="true" />
                </Handlers>
              </event>
            </events>
            <tabs><tab name="general"><labels>
              <label description="General" />
            </labels><columns><column><sections>
              <section name="details"><rows><row><cell>
                <labels><label description="Name" /></labels>
                <control id="name" datafieldname="name" />
              </cell></row><row><cell>
                <labels><label description="Contacts" /></labels>
                <control id="Contacts" indicationOfSubgrid="true">
                  <parameters>
                    <TargetEntityType>contact</TargetEntityType>
                  </parameters>
                </control>
              </cell></row></rows></section>
            </sections></column></columns></tab></tabs>
          </form>
        """,
    }]
    ribbon_action = {
        "type": "JavaScriptFunction",
        "library": "$webresource:new_events.js",
        "function_name": "RuntimeFixture.ribbon",
        "children": [{
            "type": "CrmParameter",
            "value": "PrimaryControl",
        }],
    }
    ribbon_button = {
        "id": "sample.Button",
        "label": "Run sample",
        "command": "sample.Command",
        "location_type": "form",
        "control_type": "Button",
        "sequence": 10,
        "actions": [ribbon_action],
        "display_rules": [],
        "enable_rules": [],
    }
    account["ribbon"] = {
        "commands": {
            "sample.Command": {
                "id": "sample.Command",
                "actions": [ribbon_action],
            },
        },
        "buttons": [ribbon_button],
    }
    account["ribbon_buttons"] = [ribbon_button]
    manifest["web_resources"] = [{
        "name": "new_events.js",
        "type": 3,
        "relative_path": "webresources/new_events.js",
        "sha256": hashlib.sha256(
            script_path.read_bytes()
        ).hexdigest(),
    }]

    LocalDatabase().upsert_record(
        "contact",
        "contact-id",
        {
            "contactid": "contact-id",
            "fullname": "Ada Lovelace",
        },
        sync_status="synced",
    )
    renderer = XrmFormRenderer(manifest, logical_name="account")
    qtbot.addWidget(renderer)
    qtbot.waitUntil(
        lambda: renderer._runtime_ready,
        timeout=10000,
    )
    qtbot.waitUntil(
        lambda: renderer.controls["name"].text() == "Loaded by V8",
        timeout=5000,
    )

    assert "verseoff_client_event_onload" not in renderer.notifications
    grid = renderer.controls["Contacts"]
    assert isinstance(grid, SubgridWidget)
    assert grid.table.rowCount() == 1
    grid.table.selectRow(0)
    python_selected = (
        renderer.form_context.getControl("Contacts")
        .getGrid()
        .getSelectedRows()
        .get(0)
        .getData()
        .getEntity()
    )
    assert python_selected.getId() == "contact-id"
    js_result = []
    renderer.browser.page().runJavaScript(
        "({loaded: window.__gridLoaded, selected: window.__selectedRow})",
        js_result.append,
    )
    qtbot.waitUntil(lambda: bool(js_result), timeout=5000)
    assert js_result[0] == {
        "loaded": 1,
        "selected": "contact-id",
    }
    renderer.execute_ribbon_command(ribbon_button)
    assert renderer.controls["name"].text() == "Ribbon through V8"
    assert "verseoff_client_event_ribbon" not in renderer.notifications
    renderer.browser.page().runJavaScript("""
      formContext.data.save().then(function(result) {
        window.__clientSaveResult = result;
      }).catch(function(error) {
        window.__clientSaveResult = { error: error.message };
      });
    """)
    save_result = []

    def read_save_result():
        renderer.browser.page().runJavaScript(
            "window.__clientSaveResult || null",
            lambda value: save_result.append(value) if value else None,
        )

    save_timer = renderer_module.QTimer(renderer)
    save_timer.timeout.connect(read_save_result)
    save_timer.start(50)
    qtbot.waitUntil(lambda: bool(save_result), timeout=10000)
    save_timer.stop()
    assert save_result[-1] == {"saved": False}
    assert renderer.save_record() is False
    assert "verseoff_client_event_onsave" not in renderer.notifications
    assert renderer.record_id is None


def test_qwebengine_hosts_packaged_standard_pcf_control(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "pcf-data"),
    )
    runtime_root = tmp_path / "runtime"
    resources = runtime_root / "webresources" / "new_" / "controls"
    resources.mkdir(parents=True)
    for file_name in ("verseoff_bridge.js", "verseoff_pcf_host.js"):
        shutil.copyfile(
            Path(__file__).resolve().parents[1]
            / "VerseOff"
            / file_name,
            runtime_root / file_name,
        )
    bundle = """
window.Contoso = window.Contoso || {};
window.Contoso.Controls = window.Contoso.Controls || {};
window.Contoso.Controls.Input = class {
    init(context, notifyOutputChanged, state, container) {
        if (window.Xrm !== undefined) {
            throw new Error("PCF must not receive Xrm");
        }
        let storageBlocked = false;
        try {
            window.localStorage.setItem("forbidden", "value");
        } catch (error) {
            storageBlocked = true;
        }
        window.__pcfCoverage = {
            client: context.client.getClient(),
            offline: context.client.isOffline(),
            hasNavigation: typeof context.navigation.openForm === "function",
            hasWebApi: typeof context.webAPI.retrieveRecord === "function",
            hasResources: typeof context.resources.getString === "function",
            hasUtility: typeof context.utils.getEntityMetadata === "function",
            unsupportedDeviceIsNull: context.device.captureImage === null,
            directXrm: typeof window.Xrm,
            storageBlocked: storageBlocked,
            resourceLoaded: false
        };
        context.resources.getResource(
            "bundle.js",
            function(content) {
                window.__pcfCoverage.resourceLoaded =
                    content.includes("Contoso.Controls.Input");
            },
            function() {
                window.__pcfCoverage.resourceLoaded = false;
            }
        );
        this.notify = notifyOutputChanged;
        this.input = document.createElement("input");
        this.input.addEventListener("input", () => {
            this.value = this.input.value;
            this.notify();
        });
        container.appendChild(this.input);
    }
    updateView(context) {
        window.__updatedProperties =
            context.updatedProperties.slice();
        this.value = context.parameters.value.raw || "";
        this.input.value = this.value;
    }
    getOutputs() {
        return { value: this.value };
    }
    destroy() {}
};
"""
    bundle_path = resources / "bundle.js"
    bundle_path.write_text(bundle, encoding="utf-8")
    monkeypatch.setattr(
        renderer_module,
        "__file__",
        str(runtime_root / "xrm_form_renderer.py"),
    )

    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "name": "PCF form",
        "type": 2,
        "isdefault": True,
        "formxml": """
          <form>
            <controlDescriptions>
              <controlDescription forControl="name">
                <customControl name="Contoso.Controls.Input"
                               formFactor="0" />
              </controlDescription>
            </controlDescriptions>
            <tabs><tab name="general"><columns><column><sections>
              <section name="details"><rows><row><cell>
                <control id="name" datafieldname="name" />
              </cell></row></rows></section>
            </sections></column></columns></tab></tabs>
          </form>
        """,
    }]
    account["pcf_controls"] = [{
        "name": "Contoso.Controls.Input",
        "namespace": "Contoso.Controls",
        "constructor": "Input",
        "control_type": "standard",
        "can_host": True,
        "is_dataset": False,
        "is_virtual": False,
        "properties": [{
            "name": "value",
            "usage": "bound",
            "of_type": "SingleLine.Text",
            "accepted_types": ["SingleLine.Text"],
        }],
        "datasets": [],
        "features": [],
        "resources": [{
            "type": "code",
            "path": "bundle.js",
            "order": 1,
            "web_resource_name": "new_/controls/bundle.js",
        }],
        "missing_resources": [],
    }]
    manifest["web_resources"] = [{
        "name": "new_/controls/bundle.js",
        "type": 3,
        "relative_path": "webresources/new_/controls/bundle.js",
        "sha256": hashlib.sha256(
            bundle_path.read_bytes()
        ).hexdigest(),
    }]

    renderer = XrmFormRenderer(manifest, logical_name="account")
    qtbot.addWidget(renderer)
    control = renderer.controls["name"]
    assert isinstance(control, PcfControlWidget)
    qtbot.waitUntil(lambda: control._runtime_ready, timeout=10000)
    coverage = []

    def read_coverage():
        control.browser.page().runJavaScript(
            "window.__pcfCoverage",
            lambda value: (
                coverage.append(value)
                if value and value.get("resourceLoaded")
                else None
            ),
        )

    coverage_timer = renderer_module.QTimer(renderer)
    coverage_timer.timeout.connect(read_coverage)
    coverage_timer.start(50)
    qtbot.waitUntil(lambda: bool(coverage), timeout=5000)
    coverage_timer.stop()
    assert coverage[-1] == {
        "client": "Web",
        "offline": True,
        "hasNavigation": True,
        "hasWebApi": True,
        "hasResources": True,
        "hasUtility": True,
        "unsupportedDeviceIsNull": True,
        "directXrm": "undefined",
        "storageBlocked": True,
        "resourceLoaded": True,
    }
    control.setValue("Host update")
    updated_properties = []
    control.browser.page().runJavaScript(
        "window.__updatedProperties",
        updated_properties.append,
    )
    qtbot.waitUntil(
        lambda: bool(updated_properties),
        timeout=5000,
    )
    assert updated_properties[-1] == ["value"]

    control.browser.page().runJavaScript("""
      (function() {
        const input = document.querySelector('#pcf-container input');
        input.value = 'PCF output';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })();
    """)
    qtbot.waitUntil(
        lambda: control.value() == "PCF output",
        timeout=5000,
    )
    assert control.getOutputs() == {"value": "PCF output"}


def test_form_parameters_are_validated_injected_and_applied(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "form-parameter-data"),
    )
    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "name": "Parameterized form",
        "type": 2,
        "isdefault": True,
        "formxml": """
          <form>
            <formparameters>
              <querystringparameter name="new_mode"
                                    type="SafeString" />
            </formparameters>
            <tabs><tab name="general"><columns><column><sections>
              <section name="details"><rows><row><cell>
                <control id="name" datafieldname="name" />
              </cell></row></rows></section>
            </sections></column></columns></tab></tabs>
          </form>
        """,
    }]
    manifest["bpfs"] = {
        "process-1": {
            "name": "Account process",
            "primary_entity": "account",
            "stages": [
                {"id": "stage-1", "name": "One", "entity": "account"},
                {"id": "stage-2", "name": "Two", "entity": "account"},
            ],
        }
    }
    renderer = XrmFormRenderer(
        manifest,
        logical_name="account",
        form_parameters={
            "name": "Preset account",
            "new_mode": "compact",
        },
    )
    qtbot.addWidget(renderer)
    qtbot.waitUntil(lambda: renderer._runtime_ready, timeout=10000)

    assert renderer.controls["name"].text() == "Preset account"
    assert renderer.form_context.getAttribute("new_mode") is None
    assert (
        renderer.form_context.data.attributes.get("new_mode").getValue()
        == "compact"
    )
    result = []
    renderer.browser.page().runJavaScript("""
      ({
        mode: formContext.data.attributes.get('new_mode').getValue(),
        query: Xrm.Utility.getGlobalContext()
          .getQueryStringParameters().new_mode
      })
    """, result.append)
    qtbot.waitUntil(lambda: bool(result), timeout=5000)
    assert result[0] == {"mode": "compact", "query": "compact"}
    renderer.browser.page().runJavaScript("""
      formContext.data.process.setActiveStage(
        'stage-2',
        function(status) {
          window.__stageStatus = status;
        }
      );
    """)
    qtbot.waitUntil(
        lambda: (
            renderer._client_process_state["activeStageId"]
            == "stage-2"
        ),
        timeout=10000,
    )
    assert renderer._build_js_state()["process"]["activeStageId"] == (
        "stage-2"
    )

    with pytest.raises(ValueError, match="does not accept"):
        XrmFormRenderer(
            manifest,
            logical_name="account",
            form_parameters={"unapproved_parameter": "blocked"},
        )


def test_local_webapi_applies_safe_odata_and_rejects_unknown_columns(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "webapi-data"),
    )
    database = LocalDatabase()
    database.upsert_record(
        "contact",
        "contact-1",
        {"contactid": "contact-1", "fullname": "Ada Lovelace"},
        sync_status="synced",
    )
    database.upsert_record(
        "contact",
        "contact-2",
        {"contactid": "contact-2", "fullname": "Grace Hopper"},
        sync_status="synced",
    )
    database.upsert_record(
        "contact",
        "contact-3",
        {"contactid": "contact-3", "fullname": "Katherine Johnson"},
        sync_status="synced",
    )
    renderer = XrmFormRenderer(mock_manifest, logical_name="account")
    qtbot.addWidget(renderer)

    response = json.loads(
        renderer.bridge.webApiRetrieveMultipleFromJS(
            "contact",
            "?$filter=contains(fullname,'Ada')"
            "&$orderby=fullname desc&$select=fullname&$top=1",
            "1",
        )
    )
    assert response["entities"] == [{"fullname": "Ada Lovelace"}]
    assert response["@odata.count"] == 1

    first_page = json.loads(
        renderer.bridge.webApiRetrieveMultipleFromJS(
            "contact",
            "?$orderby=fullname asc&$top=2",
            "1",
        )
    )
    second_page = json.loads(
        renderer.bridge.webApiRetrieveMultipleFromJS(
            "contact",
            first_page["nextLink"],
            "1",
        )
    )
    assert len(first_page["entities"]) == 1
    assert len(second_page["entities"]) == 1
    assert second_page["nextLink"] is None

    invalid_filter = json.loads(
        renderer.bridge.webApiRetrieveMultipleFromJS(
            "contact",
            "?$filter=fullname eq 'Ada' or fullname eq 'Grace'",
            "",
        )
    )
    assert "OR expressions" in invalid_filter["error"]

    invalid_create = json.loads(
        renderer.bridge.webApiCreateFromJS(
            "contact",
            json.dumps({"not_a_column": "blocked"}),
        )
    )
    assert "does not exist" in invalid_create["error"]

    created = json.loads(
        renderer.bridge.webApiCreateFromJS(
            "contact",
            json.dumps({"fullname": "Offline create"}),
        )
    )
    updated = json.loads(
        renderer.bridge.webApiUpdateFromJS(
            "contact",
            created["id"],
            json.dumps({"fullname": "Edited before sync"}),
        )
    )
    assert updated["id"] == created["id"]
    stored = database.get_record("contact", created["id"])
    assert stored["_sync_status"] == "pending_create"


def test_embedded_html_webresource_gets_parent_xrm_and_global_context(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "webresource-data"),
    )
    runtime_root = tmp_path / "runtime"
    resource_dir = runtime_root / "webresources" / "new_" / "web"
    resource_dir.mkdir(parents=True)
    shutil.copyfile(
        Path(__file__).resolve().parents[1]
        / "VerseOff"
        / "verseoff_bridge.js",
        runtime_root / "verseoff_bridge.js",
    )
    (runtime_root / "webresources" / "ClientGlobalContext.js.aspx").write_text(
        """
window.GetGlobalContext = function() {
    return window.parent.__verseOffGlobalContext;
};
""",
        encoding="utf-8",
    )
    html_text = """
<!doctype html>
<html><head>
  <script src="../../ClientGlobalContext.js.aspx"></script>
</head><body>
<script>
window.__result = {
  directXrm: typeof window.Xrm,
  parentXrm: typeof window.parent.Xrm,
  data: new URLSearchParams(location.search).get("data"),
  appName: null
};
window.multiply = function(left, right) {
  return left * right;
};
GetGlobalContext().getCurrentAppName().then(function(value) {
  window.__result.appName = value;
});
window.parent.Xrm.Page.getAttribute("name").addOnChange(
  function(executionContext) {
    window.__changeSource =
      executionContext.getEventSource().getName();
  }
);
window.parent.Xrm.Page.getAttribute("name").setValue("HTML resource ran");
</script>
</body></html>
"""
    html_path = resource_dir / "page.html"
    html_path.write_text(html_text, encoding="utf-8")
    monkeypatch.setattr(
        renderer_module,
        "__file__",
        str(runtime_root / "xrm_form_renderer.py"),
    )

    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "name": "Web resource form",
        "type": 2,
        "isdefault": True,
        "formxml": """
          <form><tabs><tab name="general"><columns><column><sections>
            <section name="details"><rows>
              <row><cell><control id="name" datafieldname="name" /></cell></row>
              <row><cell><control id="EmbeddedHtml"
                classid="{FD2A7985-3187-444e-A0E2-63B716FBD9D7}">
                <parameters>
                  <Url>$webresource:new_/web/page.html</Url>
                  <Data>hello world</Data>
                </parameters>
              </control></cell></row>
            </rows></section>
          </sections></column></columns></tab></tabs></form>
        """,
    }]
    manifest["web_resources"] = [{
        "name": "new_/web/page.html",
        "type": 1,
        "relative_path": "webresources/new_/web/page.html",
        "sha256": hashlib.sha256(
            html_path.read_bytes()
        ).hexdigest(),
    }]

    renderer = XrmFormRenderer(manifest, logical_name="account")
    qtbot.addWidget(renderer)
    resource = renderer.controls["EmbeddedHtml"]
    assert isinstance(resource, WebResourceWidget)
    qtbot.waitUntil(
        lambda: renderer.controls["name"].text() == "HTML resource ran",
        timeout=10000,
    )
    def read_result():
        resource.browser.page().runJavaScript("""
      (function() {
        const value = document.getElementById('resource-frame')
          .contentWindow.__result;
        if (!value || value.appName === null) {
          return null;
        }
        return {
          directXrm: value.directXrm,
          parentXrm: value.parentXrm,
          data: value.data,
          appName: value.appName
        };
      })();
        """, lambda value: result.append(value) if value else None)

    result = []
    timer = renderer_module.QTimer(renderer)
    timer.timeout.connect(read_result)
    timer.start(50)
    qtbot.waitUntil(lambda: bool(result), timeout=5000)
    timer.stop()
    assert result[-1] == {
        "directXrm": "undefined",
        "parentXrm": "object",
        "data": "hello world",
        "appName": manifest["app_name"],
    }
    renderer._fire_events("onchange", "name")
    change_result = []
    resource.browser.page().runJavaScript("""
      document.getElementById('resource-frame')
        .contentWindow.__changeSource || null
    """, change_result.append)
    qtbot.waitUntil(
        lambda: bool(change_result) and change_result[-1] == "name",
        timeout=5000,
    )
    renderer.browser.page().runJavaScript("""
      formContext.getControl('EmbeddedHtml').getContentWindow()
        .then(function(contentWindow) {
          return contentWindow.multiply(6, 7);
        })
        .then(function(value) {
          window.__webResourceInvocation = value;
        });
    """)
    invocation_result = []

    def read_invocation():
        renderer.browser.page().runJavaScript(
            "window.__webResourceInvocation || null",
            lambda value: (
                invocation_result.append(value) if value else None
            ),
        )

    invocation_timer = renderer_module.QTimer(renderer)
    invocation_timer.timeout.connect(read_invocation)
    invocation_timer.start(50)
    qtbot.waitUntil(lambda: bool(invocation_result), timeout=5000)
    invocation_timer.stop()
    assert invocation_result[-1] == 42


def test_json_form_fallback_preserves_rows_cells_and_visibility(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "json-data"))
    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "formid": "parsed-form",
        "name": "Parsed form",
        "type": 2,
        "tabs": [{
            "name": "general",
            "label": "General",
            "visible": True,
            "columns": [
                {
                    "width": "40%",
                    "sections": [{
                        "label": "Visible",
                        "visible": True,
                        "show_label": True,
                        "label_width": 90,
                        "label_position": "Left",
                        "controls": [],
                        "rows": [{
                            "cells": [
                                {
                                    "visible": True,
                                    "show_label": True,
                                    "column_span": 2,
                                    "row_span": 1,
                                    "control": {
                                        "attribute": "name",
                                        "label": "Account name",
                                        "class_id": "",
                                        "disabled": False,
                                    },
                                },
                                {
                                    "visible": False,
                                    "show_label": True,
                                    "column_span": 1,
                                    "row_span": 1,
                                    "control": {
                                        "attribute": "telephone1",
                                        "label": "Hidden phone",
                                        "class_id": "",
                                        "disabled": False,
                                    },
                                },
                            ]
                        }],
                    }],
                },
                {"width": "60%", "sections": []},
            ],
        }],
    }]

    renderer = XrmFormRenderer(
        manifest,
        logical_name="account",
        form_id="parsed-form",
    )
    qtbot.addWidget(renderer)

    layout = renderer.tab_widget.widget(0).layout()
    assert layout.stretch(0) == 400
    assert layout.stretch(1) == 600
    assert "name" in renderer.controls
    assert "telephone1" not in renderer.controls


def test_formxml_timeline_control_is_rendered_as_timelinewall(
    qtbot,
    mock_manifest,
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv(
        "VERSEOFF_DATA_DIR",
        str(tmp_path / "timeline-control-data"),
    )
    manifest = deepcopy(mock_manifest)
    account = next(
        entity
        for entity in manifest["entities"]
        if entity["LogicalName"] == "account"
    )
    account["forms"] = [{
        "formid": "timeline-form",
        "name": "Timeline form",
        "type": 2,
        "formxml": """
          <form><tabs><tab name="timeline">
            <labels><label description="Timeline" /></labels>
            <columns><column width="100%"><sections>
              <section name="timeline_section"><rows><row><cell
                showlabel="false">
                <control id="notescontrol"
                  classid="{06375649-C143-495E-A496-C962E5B4488E}">
                  <parameters>
                    <UClientUniqueName>Timeline</UClientUniqueName>
                    <UClientModules>Notes</UClientModules>
                    <UClientRecordPerPage>10</UClientRecordPerPage>
                  </parameters>
                </control>
              </cell></row></rows></section>
            </sections></column></columns>
          </tab></tabs></form>
        """,
    }]

    renderer = XrmFormRenderer(
        manifest,
        logical_name="account",
        form_id="timeline-form",
    )
    qtbot.addWidget(renderer)

    assert len(renderer.timelines) == 1
    assert type(renderer.controls["notescontrol"]).__name__ == (
        "TimelineWidget"
    )
    control = renderer.form_context.getControl("notescontrol")
    assert control.getControlType() == "timelinewall"
