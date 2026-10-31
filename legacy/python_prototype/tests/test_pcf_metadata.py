from VerseOff.pcf_metadata import (
    bind_pcf_resources,
    custom_control_names_from_form,
    parse_pcf_manifest,
)


def test_parse_pcf_manifest_preserves_properties_resources_and_features():
    definition = parse_pcf_manifest("""
      <manifest>
        <control namespace="Contoso.Controls"
                 constructor="ColorPicker"
                 version="1.2.3"
                 display-name-key="Control_Name"
                 control-type="standard">
          <property name="value" usage="bound"
                    of-type="SingleLine.Text" required="true" />
          <data-set name="Items"
                    cds-data-set-options="displayCommandBar:true;displayQuickFind:false" />
          <resources>
            <code path="bundle.js" order="1" />
            <css path="styles/control.css" order="1" />
            <resx path="strings/Control.1033.resx" version="1.0" />
          </resources>
          <feature-usage>
            <uses-feature name="WebAPI" required="true" />
          </feature-usage>
        </control>
      </manifest>
    """)

    assert definition["name"] == "Contoso.Controls.ColorPicker"
    assert definition["properties"][0]["usage"] == "bound"
    assert definition["datasets"][0]["options"] == {
        "displayCommandBar": True,
        "displayQuickFind": False,
    }
    assert definition["resources"][0] == {
        "type": "code",
        "path": "bundle.js",
        "order": 1,
        "name": "",
        "version": "",
    }
    assert definition["can_host"] is True


def test_pcf_manifest_fails_closed_for_virtual_or_required_device_feature():
    definition = parse_pcf_manifest("""
      <manifest>
        <control namespace="Contoso" constructor="Camera"
                 version="1.0.0" control-type="virtual">
          <property name="value" usage="bound"
                    of-type="SingleLine.Text" required="false" />
          <resources>
            <code path="bundle.js" order="1" />
            <platform-library name="React" version="16.14.0" />
          </resources>
          <feature-usage>
            <uses-feature name="Device.captureImage" required="true" />
          </feature-usage>
        </control>
      </manifest>
    """)

    assert definition["is_virtual"] is True
    assert definition["unsupported_required_features"] == [
        "Device.captureImage"
    ]
    assert definition["can_host"] is False


def test_bind_pcf_resources_matches_manifest_paths_and_detects_missing():
    definition = parse_pcf_manifest("""
      <manifest><control namespace="Contoso" constructor="Input"
        version="1.0.0" control-type="standard">
        <resources>
          <code path="bundle.js" order="1" />
          <css path="styles.css" order="1" />
        </resources>
      </control></manifest>
    """)

    bound = bind_pcf_resources(definition, [{
        "id": "resource-link",
        "path": "bundle.js",
        "web_resource_id": "web-resource",
        "web_resource_name": "new_/controls/bundle.js",
    }])

    assert bound["resources"][0]["web_resource_name"] == (
        "new_/controls/bundle.js"
    )
    assert bound["missing_resources"] == ["styles.css"]
    assert bound["can_host"] is False

    unresolved = bind_pcf_resources(definition, [{
        "id": "resource-link",
        "path": "bundle.js",
        "web_resource_id": "web-resource",
        "web_resource_name": "",
    }])
    assert "bundle.js" in unresolved["missing_resources"]
    assert unresolved["can_host"] is False


def test_custom_control_names_are_read_from_inline_and_descriptions():
    names = custom_control_names_from_form("""
      <form>
        <controlDescriptions>
          <controlDescription forControl="name">
            <customControl name="Contoso.Controls.Input" formFactor="0" />
          </controlDescription>
        </controlDescriptions>
        <tabs><tab><columns><column><sections><section><rows><row><cell>
          <control id="other">
            <customControl name="MscrmControls.Toggle" />
          </control>
        </cell></row></rows></section></sections></column></columns></tab></tabs>
      </form>
    """)

    assert names == [
        "Contoso.Controls.Input",
        "MscrmControls.Toggle",
    ]
