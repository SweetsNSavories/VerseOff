"""
test_schema_compliance.py
Comprehensive test suite verifying that all 12 Microsoft Power Platform XSD schemas
are loaded, indexed, and validated, and that the generator supports all elements.
"""

import os
import sys
import unittest
from lxml import etree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from schema_manager import SchemaManager, KNOWN_CONTROL_CLASSIDS
from form_parser import parse_form_xml


class TestPowerPlatformSchemaCompliance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sm = SchemaManager()

    def test_01_all_12_schemas_loaded(self):
        """Verify all 12 Power Platform schemas are indexed in the catalog."""
        summary = self.sm.summary()
        self.assertGreater(summary["elements_count"], 500, "Catalog should have >500 elements")
        self.assertGreater(summary["complex_types_count"], 100, "Catalog should have >100 complex types")
        self.assertGreater(summary["simple_types_count"], 50, "Catalog should have >50 simple types")

        # Check core expected schemas
        expected_schemas = [
            "CustomizationsSolution.xsd",
            "FormXml.xsd",
            "SiteMap.xsd",
            "SiteMapType.xsd",
            "RibbonCore.xsd",
            "RibbonTypes.xsd",
            "RibbonWSS.xsd",
            "Fetch.xsd",
            "ParameterXml.xsd",
            "VisualizationDataDescription.xsd",
            "isv.config.xsd",
            "reports.config.xsd",
        ]
        found_schemas = set(el["schema"] for el in self.sm._element_catalog.values())
        for exp in expected_schemas:
            self.assertTrue(
                exp in found_schemas or any(ct["schema"] == exp for ct in self.sm._complex_types.values()),
                f"Schema {exp} must be loaded in the catalog"
            )

    def test_02_sitemap_schema_validation(self):
        """Test SiteMap.xsd validation."""
        valid_sitemap = """<SiteMap xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <Area Id="Workplace" Title="Workplace">
            <Group Id="MyWork" Title="My Work">
              <SubArea Id="nav_cases" Entity="incident" Title="Cases" />
            </Group>
          </Area>
        </SiteMap>"""
        valid, errors = self.sm.validate_sitemap_xml(valid_sitemap)
        self.assertTrue(valid, f"SiteMap should validate without errors: {errors}")

    def test_03_fetch_schema_validation(self):
        """Test Fetch.xsd validation."""
        valid_fetch = """<fetch mapping="logical">
          <entity name="account">
            <attribute name="name" />
            <attribute name="telephone1" />
            <filter type="and">
              <condition attribute="statecode" operator="eq" value="0" />
            </filter>
            <order attribute="name" descending="false" />
          </entity>
        </fetch>"""
        valid, errors = self.sm.validate_fetch_xml(valid_fetch)
        self.assertTrue(valid, f"FetchXML should validate without errors: {errors}")

    def test_04_control_classids_coverage(self):
        """Verify that all major Power Platform control ClassIDs are recognized."""
        required_controls = [
            ("{4273edbd-ac1d-40d3-9fb2-095c621b552d}", "text"),
            ("{e0dba600-d4c9-4b3c-b907-80e10892ad0e}", "memo"),
            ("{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}", "picklist"),
            ("{4aa28ab7-9c13-482f-ac51-bb4439c27f32}", "multiselect"),
            ("{b0c6723a-8503-4fd7-bb28-c8a06ac933c2}", "boolean"),
            ("{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}", "datetime"),
            ("{270bd3db-d9af-4782-9025-509e298b0578}", "lookup"),
            ("{533b9e00-756b-4312-95a0-dc888637ac78}", "integer"),
            ("{c3efe0c3-0ec6-42be-8349-cbd9079e8bc6}", "decimal"),
            ("{e7579c73-8549-467d-8713-2498322704f4}", "subgrid"),
            ("{f9a8a302-114e-466a-b582-6771b2ae0d92}", "quickview"),
            ("{9fdf5f91-88b1-47f4-ad53-c11efc01a01d}", "webresource"),
            ("{fd2a7985-3187-444e-908d-6624b21f69c0}", "iframe"),
            ("{9c563dcb-b617-4847-a7eb-6c1c385c5b4e}", "timer"),
            ("{8c54228c-1b49-4130-97fb-37e197709334}", "timeline"),
            ("{f02ef9d0-a027-11e3-a5e2-0800200c9a66}", "pcf"),
        ]
        for cid, expected_type in required_controls:
            ctrl_info = self.sm.get_control_type_for_classid(cid)
            self.assertEqual(ctrl_info["type"], expected_type, f"ClassID {cid} should map to {expected_type}")

    def test_05_form_xml_elements_parsing(self):
        """Verify form_parser parses header, footer, navigation, hiddencontrols, timer, and tabs."""
        form_xml = """<form shownavigationbar="true" showImage="true" minwidth="1200">
          <header columns="1111" celllabelposition="Top">
            <rows>
              <row>
                <cell id="c1"><control id="statuscode" classid="{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}" datafieldname="statuscode" /></cell>
                <cell id="c2"><control id="ownerid" classid="{270bd3db-d9af-4782-9025-509e298b0578}" datafieldname="ownerid" /></cell>
              </row>
            </rows>
          </header>
          <tabs>
            <tab name="general" expanded="true" showlabel="true">
              <columns>
                <column width="50%">
                  <sections>
                    <section name="sec_info" celllabelposition="Top" showbar="true">
                      <rows>
                        <row>
                          <cell id="c_name">
                            <labels><label description="Account Name" languagecode="1033" /></labels>
                            <control id="name" classid="{4273edbd-ac1d-40d3-9fb2-095c621b552d}" datafieldname="name" />
                          </cell>
                        </row>
                        <row>
                          <cell id="c_timer">
                            <labels><label description="Response SLA" languagecode="1033" /></labels>
                            <control id="timer1" classid="{9c563dcb-b617-4847-a7eb-6c1c385c5b4e}" datafieldname="response_sla">
                              <parameters>
                                <FailureTimeField>resolveby</FailureTimeField>
                                <SuccessConditionName>statuscode</SuccessConditionName>
                                <SuccessConditionValue>1</SuccessConditionValue>
                              </parameters>
                            </control>
                          </cell>
                        </row>
                      </rows>
                    </section>
                  </sections>
                </column>
                <column width="50%">
                  <sections>
                    <section name="sec_subgrid" showlabel="false">
                      <rows>
                        <row>
                          <cell id="c_contacts" rowspan="4">
                            <control id="subgrid_contacts" classid="{e7579c73-8549-467d-8713-2498322704f4}" indicationOfSubgrid="true">
                              <parameters>
                                <TargetEntityType>contact</TargetEntityType>
                                <RelationshipName>account_contacts</RelationshipName>
                                <RecordsPerPage>10</RecordsPerPage>
                              </parameters>
                            </control>
                          </cell>
                        </row>
                      </rows>
                    </section>
                  </sections>
                </column>
              </columns>
            </tab>
          </tabs>
          <footer statuscode="1">
            <rows>
              <row>
                <cell id="cf1"><control id="modifiedon" classid="{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}" datafieldname="modifiedon" /></cell>
              </row>
            </rows>
          </footer>
          <Navigation>
            <NavBarByRelationshipItem RelationshipName="account_contacts" Id="navContacts" Title="Contacts" Sequence="10" />
            <NavBarByRelationshipItem RelationshipName="account_cases" Id="navCases" Title="Cases" Sequence="20" />
          </Navigation>
          <hiddencontrols>
            <hiddencontrol id="hidden_key" datafieldname="hidden_key" classid="{4273edbd-ac1d-40d3-9fb2-095c621b552d}" />
          </hiddencontrols>
        </form>"""

        parsed = parse_form_xml(form_xml)

        # 1. Root attributes
        self.assertTrue(parsed["shownavigationbar"])
        self.assertTrue(parsed["showImage"])
        self.assertEqual(parsed["minwidth"], "1200")

        # 2. Header
        self.assertIsNotNone(parsed.get("header"))
        self.assertEqual(len(parsed["header"]["controls"]), 2)
        self.assertEqual(parsed["header"]["controls"][0]["attribute"], "statuscode")

        # 3. Footer
        self.assertIsNotNone(parsed.get("footer"))
        self.assertEqual(len(parsed["footer"]["controls"]), 1)
        self.assertEqual(parsed["footer"]["status_code"], "1")

        # 4. Navigation
        self.assertEqual(len(parsed["navigation"]["items"]), 2)
        self.assertEqual(parsed["navigation"]["items"][0]["title"], "Contacts")
        self.assertEqual(parsed["navigation"]["items"][1]["title"], "Cases")

        # 5. Hidden controls
        self.assertEqual(len(parsed["hidden_controls"]), 1)
        self.assertEqual(parsed["hidden_controls"][0]["datafieldname"], "hidden_key")

        # 6. Controls in tabs
        tab = parsed["tabs"][0]
        col1_sec = tab["columns"][0]["sections"][0]
        timer_ctrl = col1_sec["controls"][1]
        self.assertEqual(timer_ctrl["type"], "timer")
        self.assertEqual(timer_ctrl["parameters"]["FailureTimeField"], "resolveby")

        col2_sec = tab["columns"][1]["sections"][0]
        subgrid_ctrl = col2_sec["controls"][0]
        self.assertEqual(subgrid_ctrl["type"], "subgrid")
        self.assertEqual(subgrid_ctrl["parameters"]["TargetEntityType"], "contact")

    def test_06_supported_control_parameters(self):
        """Verify that FormXmlControlType parameters from XSD are introspected."""
        params = self.sm.get_supported_parameters_for_control()
        self.assertIn("FailureTimeField", params)
        self.assertIn("SuccessConditionName", params)
        self.assertIn("TargetEntityType", params)
        self.assertIn("RelationshipName", params)
        self.assertIn("DefaultValue", params)
        self.assertIn("Url", params)
        self.assertIn("PassParameters", params)


if __name__ == "__main__":
    unittest.main()
