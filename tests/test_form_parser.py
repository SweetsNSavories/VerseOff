import json
import subprocess
from pathlib import Path

import pytest

from VerseOff.client_script_metadata import (
    parse_form_event_handlers,
    parse_form_parameters,
    web_resource_content_dependency_names,
)
from VerseOff.form_parser import parse_form_xml


def test_bridge_exposes_dataverse_like_form_context():
    bridge_path = Path(__file__).resolve().parents[1] / "VerseOff" / "verseoff_bridge.js"
    script = f"""
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync({str(bridge_path)!r}, 'utf8');
const context = {{ console, Promise, setTimeout, clearTimeout }};
context.window = context;
context.globalThis = context;
vm.runInNewContext(src, context);
context.window.verseOffState.attributes.name = {{ value: null }};
context.window.verseOffState.controls.Timeline = {{ visible: true, disabled: false, type: 'timelinewall' }};
const attr = context.window.formContext.getAttribute('name');
attr.setValue('Acme');
const control = context.window.formContext.getControl('Timeline');
if (control.getControlType() !== 'timelinewall') {{ throw new Error('timeline type mismatch'); }}
if (attr.getValue() !== 'Acme') {{ throw new Error('attribute writeback mismatch'); }}
if (!control.getVisible()) {{ throw new Error('timeline visibility failed'); }}
console.log('bridge-ok');
"""
    result = subprocess.run(["node", "-e", script], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    assert "bridge-ok" in result.stdout


def test_form_parser_preserves_columns_rows_cells_and_visibility():
    parsed = parse_form_xml("""
      <form>
        <tabs>
          <tab name="summary">
            <labels><label description="Summary" /></labels>
            <columns>
              <column width="33%">
                <sections>
                  <section name="left" showlabel="true"
                           showbar="false" labelwidth="105">
                    <labels><label description="Left details" /></labels>
                    <rows>
                      <row height="35">
                        <cell colspan="2" rowspan="1" showlabel="true">
                          <labels><label description="Name" /></labels>
                          <control id="name" datafieldname="name"
                                   classid="{4273EDBD-AC1D-40d3-9FB2-095C621B552D}" />
                        </cell>
                      </row>
                    </rows>
                  </section>
                </sections>
              </column>
              <column width="67%">
                <sections>
                  <section name="hidden" visible="false">
                    <rows>
                      <row><cell><control id="description"
                        datafieldname="description" /></cell></row>
                    </rows>
                  </section>
                </sections>
              </column>
            </columns>
          </tab>
        </tabs>
      </form>
    """)

    tab = parsed["tabs"][0]
    assert [column["width"] for column in tab["columns"]] == [
        "33%",
        "67%",
    ]
    section = tab["columns"][0]["sections"][0]
    assert section["show_bar"] is False
    assert section["label_width"] == 105
    cell = section["rows"][0]["cells"][0]
    assert cell["column_span"] == 2
    assert cell["row_span"] == 1
    assert cell["control"]["attribute"] == "name"
    assert tab["columns"][1]["sections"][0]["visible"] is False


def test_form_parser_preserves_separate_pcf_control_description():
    parsed = parse_form_xml("""
      <form>
        <controlDescriptions>
          <controlDescription forControl="name">
            <customControl name="Contoso.Controls.Input"
                           formFactor="0">
              <parameters><value description="name" /></parameters>
            </customControl>
          </controlDescription>
        </controlDescriptions>
        <tabs><tab><columns><column><sections><section><rows>
          <row><cell><control id="name" datafieldname="name" /></cell></row>
        </rows></section></sections></column></columns></tab></tabs>
      </form>
    """)

    control = parsed["tabs"][0]["sections"][0]["controls"][0]
    assert control["pcf_name"] == "Contoso.Controls.Input"
    assert "<customControl" in control["custom_control_xml"]


def test_form_event_metadata_preserves_scope_order_and_parameters():
    handlers = parse_form_event_handlers("""
      <form>
        <events>
          <event name="onload" active="true">
            <Handlers>
              <Handler functionName="Sample.load"
                       libraryName="new_events.js"
                       passExecutionContext="true"
                       parameters="&quot;first, value&quot;, second" />
            </Handlers>
          </event>
          <event name="onchange" attribute="name">
            <Handlers>
              <Handler functionName="Sample.change"
                       libraryName="new_events.js"
                       passExecutionContext="true" />
            </Handlers>
          </event>
        </events>
        <tabs><tab><columns><column><sections><section><rows>
          <row><cell><control id="Contacts">
            <events>
              <event name="onload">
                <Handlers>
                  <Handler functionName="Sample.gridLoad"
                           libraryName="new_events.js"
                           passExecutionContext="true" />
                </Handlers>
              </event>
            </events>
          </control></cell></row>
        </rows></section></sections></column></columns></tab></tabs>
      </form>
    """)

    assert [handler["event"] for handler in handlers] == [
        "onload",
        "onchange",
        "gridonload",
    ]
    assert handlers[0]["parameters"] == ["first, value", "second"]
    assert handlers[0]["order"] == 0
    assert handlers[1]["control"] == "name"
    assert handlers[2]["control"] == "Contacts"
    assert handlers[2]["scope"] == "control"


def test_form_parameters_require_safe_names_and_supported_types():
    parameters = parse_form_parameters("""
      <form><formparameters>
        <querystringparameter name="new_mode" type="SafeString" />
        <querystringparameter name="new_count" type="Integer" />
      </formparameters></form>
    """)

    assert parameters["new_mode"]["type"] == "SafeString"
    assert parameters["new_count"]["type"] == "Integer"

    with pytest.raises(ValueError, match="naming rules"):
        parse_form_parameters("""
          <form><formparameters>
            <querystringparameter name="unsafe" type="SafeString" />
          </formparameters></form>
        """)


def test_webresource_content_dependencies_resolve_relative_paths():
    dependencies = web_resource_content_dependency_names({
        "name": "new_/pages/form.html",
        "type": 1,
        "content": """
          <script src="../../ClientGlobalContext.js.aspx"></script>
          <script src="../scripts/form.js"></script>
          <link rel="stylesheet" href="../styles/form.css">
          <img src="../images/logo.png?cache=1">
          <script src="/WebResources/new_/rooted.js"></script>
          <script src="$webresource:new_/directive.js"></script>
        """,
    })

    assert dependencies == [
        "new_/scripts/form.js",
        "new_/styles/form.css",
        "new_/images/logo.png",
        "new_/rooted.js",
        "new_/directive.js",
    ]


def test_bridge_dispatches_form_save_and_grid_contexts():
    bridge_path = (
        Path(__file__).resolve().parents[1]
        / "VerseOff"
        / "verseoff_bridge.js"
    )
    script = r"""
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(__BRIDGE_PATH__, 'utf8');
const context = { console, Promise, setTimeout, clearTimeout };
context.window = context;
context.globalThis = context;
vm.runInNewContext(src, context);

const trace = [];
context.Sample = {
    firstLoad: function(executionContext, literal) {
        if (executionContext.getDepth() !== 0) {
            throw new Error('first handler depth mismatch');
        }
        if (executionContext.getFormContext()
                .getAttribute('name').getValue() !== '__TOKEN__') {
            throw new Error('event state placeholder corruption');
        }
        executionContext.setSharedVariable('loaded', literal);
        trace.push('configured-1');
    },
    secondLoad: function(executionContext) {
        if (executionContext.getSharedVariable('loaded') !== 'literal') {
            throw new Error('shared variable mismatch');
        }
        trace.push('configured-2');
    },
    save: async function(executionContext) {
        executionContext.getEventArgs().preventDefault();
        await Promise.resolve();
        trace.push('save');
    },
    rowSelect: function(executionContext) {
        const rowContext = executionContext.getFormContext();
        const source = executionContext.getEventSource();
        if (rowContext.data.entity.getId() !== 'row-1') {
            throw new Error('row formContext mismatch');
        }
        if (source.getId() !== 'row-1') {
            throw new Error('row event source mismatch');
        }
        if (rowContext.getAttribute('fullname').getValue() !== 'Ada') {
            throw new Error('row attribute mismatch');
        }
        trace.push('row');
    },
    gridLoad: function(executionContext) {
        if (executionContext.getFormContext() !== context.formContext) {
            throw new Error('subgrid OnLoad form context mismatch');
        }
        if (executionContext.getEventSource().getName() !== 'Contacts') {
            throw new Error('subgrid OnLoad source mismatch');
        }
        trace.push('grid-load');
    },
    gridChange: function(executionContext) {
        if (executionContext.getEventSource().getName() !== 'fullname') {
            throw new Error('grid OnChange source mismatch');
        }
        if (executionContext.getFormContext()
                .getAttribute('fullname').getValue() !== 'Ada') {
            throw new Error('grid OnChange row context mismatch');
        }
        trace.push('grid-change');
    },
    gridSave: function(executionContext) {
        if (executionContext.getEventSource().getId() !== 'row-1') {
            throw new Error('grid OnSave source mismatch');
        }
        executionContext.getEventArgs().preventDefault();
        trace.push('grid-save');
    },
    ribbon: function(
        primaryControl,
        literal,
        selectedControl,
        selectedIds,
        commandProperties
    ) {
        if (primaryControl !== context.formContext) {
            throw new Error('Ribbon PrimaryControl mismatch');
        }
        if (literal !== 'literal-value') {
            throw new Error('Ribbon literal parameter mismatch');
        }
        if (selectedControl.getName() !== 'Contacts') {
            throw new Error('Ribbon SelectedControl mismatch');
        }
        if (selectedIds.join(',') !== 'row-1') {
            throw new Error('Ribbon selected IDs mismatch');
        }
        if (commandProperties.SourceControlId !== 'sample.Button') {
            throw new Error('Ribbon CommandProperties mismatch');
        }
        primaryControl.getAttribute('name').setValue('Ribbon ran');
        trace.push('ribbon');
    },
    rule: function(primaryControl, expected) {
        return (
            primaryControl === context.formContext &&
            expected === 'allow'
        );
    }
};

context.initializeVerseOffState({
    attributes: {
        name: {
            value: '__TOKEN__',
            initialValue: '__TOKEN__',
            submitMode: 'dirty',
            requiredLevel: 'none',
            type: 'string',
            dirty: false
        }
    },
    controls: {
        name: { visible: true, disabled: false, type: 'standard' },
        Contacts: { visible: true, disabled: false, type: 'subgrid' }
    },
    grids: {
        Contacts: {
            entityName: 'contact',
            rows: [{
                id: 'row-1',
                entityName: 'contact',
                primaryName: 'Ada',
                attributes: {
                    fullname: {
                        value: 'Ada',
                        initialValue: 'Ada',
                        dirty: false
                    }
                }
            }],
            selectedIds: ['row-1'],
            totalRecordCount: 1
        }
    },
    entity: { logicalName: 'account', id: 'account-1' },
    eventHandlers: [
        {
            event: 'onload',
            function: 'Sample.firstLoad',
            library: 'new_events.js',
            pass_context: true,
            parameters: ['literal'],
            order: 0,
            enabled: true,
            control: null
        },
        {
            event: 'onload',
            function: 'Sample.secondLoad',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 1,
            enabled: true,
            control: null
        },
        {
            event: 'onsave',
            function: 'Sample.save',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 2,
            enabled: true,
            control: null
        },
        {
            event: 'onrecordselect',
            function: 'Sample.rowSelect',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 3,
            enabled: true,
            control: 'Contacts'
        },
        {
            event: 'gridonload',
            function: 'Sample.gridLoad',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 4,
            enabled: true,
            control: 'Contacts'
        },
        {
            event: 'gridonchange',
            function: 'Sample.gridChange',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 5,
            enabled: true,
            control: 'Contacts'
        },
        {
            event: 'gridonsave',
            function: 'Sample.gridSave',
            library: 'new_events.js',
            pass_context: true,
            parameters: [],
            order: 6,
            enabled: true,
            control: 'Contacts'
        }
    ]
});

context.formContext.ui.addOnLoad(function(executionContext) {
    if (executionContext.getDepth() !== 2) {
        throw new Error('code-added handler was not appended');
    }
    trace.push('dynamic');
});

(async function() {
    const load = await context.executeJsEvent('onload', null, {
        dataLoadState: 1
    });
    if (load.errors.length) {
        throw new Error(JSON.stringify(load.errors));
    }
    if (trace.slice(0, 3).join(',') !==
            'configured-1,configured-2,dynamic') {
        throw new Error('handler order mismatch: ' + trace.join(','));
    }

    const save = await context.executeJsEvent('onsave', null, {
        saveMode: 1
    });
    if (!save.prevented || save.errors.length) {
        throw new Error('save cancellation failed');
    }

    const row = await context.executeJsEvent(
        'onrecordselect',
        'Contacts',
        { rowId: 'row-1' }
    );
    if (row.errors.length || trace[trace.length - 1] !== 'row') {
        throw new Error('grid row context failed: ' + JSON.stringify(row));
    }

    const gridLoad = await context.executeJsEvent(
        'gridonload',
        'Contacts',
        {}
    );
    if (gridLoad.errors.length ||
            trace[trace.length - 1] !== 'grid-load') {
        throw new Error(
            'subgrid OnLoad context failed: ' + JSON.stringify(gridLoad)
        );
    }

    const gridChange = await context.executeJsEvent(
        'gridonchange',
        'Contacts',
        { rowId: 'row-1', attributeName: 'fullname' }
    );
    if (gridChange.errors.length ||
            trace[trace.length - 1] !== 'grid-change') {
        throw new Error(
            'grid OnChange context failed: ' + JSON.stringify(gridChange)
        );
    }

    const gridSave = await context.executeJsEvent(
        'gridonsave',
        'Contacts',
        { rowId: 'row-1', saveMode: 1 }
    );
    if (!gridSave.prevented || gridSave.errors.length ||
            trace[trace.length - 1] !== 'grid-save') {
        throw new Error(
            'grid OnSave context failed: ' + JSON.stringify(gridSave)
        );
    }

    const ribbon = await context.executeRibbonAction({
        type: 'JavaScriptFunction',
        function_name: 'Sample.ribbon',
        children: [
            { type: 'CrmParameter', value: 'PrimaryControl' },
            { type: 'StringParameter', value: 'literal-value' },
            { type: 'CrmParameter', value: 'SelectedControl' },
            {
                type: 'CrmParameter',
                value: 'SelectedControlSelectedItemIds'
            },
            { type: 'CrmParameter', value: 'CommandProperties' }
        ]
    }, {
        controlName: 'Contacts',
        commandProperties: {
            SourceControlId: 'sample.Button'
        }
    });
    if (!ribbon.executed || ribbon.errors.length ||
            context.formContext.getAttribute('name').getValue() !==
                'Ribbon ran') {
        throw new Error(
            'Ribbon parameter binding failed: ' + JSON.stringify(ribbon)
        );
    }

    const rule = await context.evaluateRibbonRule({
        function_name: 'Sample.rule',
        children: [
            { type: 'CrmParameter', value: 'PrimaryControl' },
            { type: 'StringParameter', value: 'allow' }
        ]
    }, {});
    if (!rule.value || rule.errors.length) {
        throw new Error(
            'Ribbon custom rule failed: ' + JSON.stringify(rule)
        );
    }

    let unsupported = false;
    try {
        await context.Xrm.WebApi.execute({});
    } catch (error) {
        unsupported =
            error.name === 'VerseOffUnsupportedClientApiError';
    }
    if (!unsupported) {
        throw new Error('unsupported API did not fail closed');
    }
    console.log('event-runtime-ok');
})().catch(function(error) {
    console.error(error);
    process.exit(1);
});
""".replace(
        "__BRIDGE_PATH__",
        json.dumps(str(bridge_path)),
    )
    result = subprocess.run(
        ["node", "-e", script],
        capture_output=True,
        text=True,
        timeout=20,
    )
    assert result.returncode == 0, result.stderr
    assert "event-runtime-ok" in result.stdout
