import pytest
import os
import sys
import json
import sqlite3
import xml.etree.ElementTree as ET
from PyQt6.QtWidgets import QWidget, QCheckBox, QSpinBox, QComboBox, QLineEdit

generated_app_dir = os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out")
sys.path.append(generated_app_dir)
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "VerseOff"))

from xrm_form_renderer import XrmFormRenderer
from canvas_parser import CanvasParser

@pytest.fixture
def mock_manifest():
    manifest_path = os.path.join(generated_app_dir, "manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)

def test_pcf_translation_registry(qtbot, mock_manifest):
    """
    Tests that the XrmFormRenderer correctly detects PCF controls and 
    translates them into native PyQt6 widgets.
    """
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
