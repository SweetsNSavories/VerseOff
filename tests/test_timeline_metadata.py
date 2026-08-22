import xml.etree.ElementTree as ET

from VerseOff.timeline_metadata import (
    extract_card_forms,
    extract_timeline_definitions,
    is_timeline_control,
    parse_timeline_control,
    timeline_dependency_names,
)


TIMELINE_XML = """
<control id="notescontrol"
         classid="{06375649-C143-495E-A496-C962E5B4488E}">
  <parameters>
    <UClientUniqueName>Timeline</UClientUniqueName>
    <UClientModules>Activities,Notes,Posts</UClientModules>
    <UClientDefaultModuleForCreateExperience>Notes</UClientDefaultModuleForCreateExperience>
    <UClientShowFilterPane>true</UClientShowFilterPane>
    <UClientExpandFilterPane>false</UClientExpandFilterPane>
    <UClientRecordPerPage>25</UClientRecordPerPage>
    <UClientActivities>email,task,new_sms</UClientActivities>
    <UClientOrderBy>descending</UClientOrderBy>
    <UClientSortActivitiesByValue>sortdate</UClientSortActivitiesByValue>
    <UClientActivityCardMap>email:4202:{EMAIL-CARD},task:4212:</UClientActivityCardMap>
    <UClientActivitiesConfigurationJSON>
      {"email":{"canCreate":true,"showStatus":true,
      "createUsing":"quickcreateform","openUsing":"mainform"},
      "task":{"canCreate":false,"showStatus":false}}
    </UClientActivitiesConfigurationJSON>
    <UClientRecordSourcesJSON>
      {"recordSources":[{"name":"new_Source",
      "constructor":"Sample.RecordSource"}]}
    </UClientRecordSourcesJSON>
  </parameters>
</control>
"""


def test_timeline_control_parses_live_configuration_shape():
    control = ET.fromstring(TIMELINE_XML)

    assert is_timeline_control(control)
    definition = parse_timeline_control(
        control,
        form_id="{FORM-ID}",
        form_name="Account",
        entity_name="account",
    )

    assert definition["form_id"] == "form-id"
    assert definition["modules"] == ["Activities", "Notes", "Posts"]
    assert definition["record_per_page"] == 25
    assert definition["activities"] == ["email", "task", "new_sms"]
    assert definition["activity_card_map"]["email"]["form_id"] == (
        "email-card"
    )
    assert definition["activity_configuration"]["task"][
        "canCreate"
    ] is False
    assert definition["custom_record_sources"][0]["name"] == "new_Source"
    assert definition["raw_parameters"]["UClientSortActivitiesByValue"] == (
        "sortdate"
    )


def test_timeline_definitions_and_dependencies_are_extracted_from_forms():
    forms = [{
        "formid": "form-id",
        "name": "Account Main",
        "type": 2,
        "formxml": (
            "<form><tabs><tab><columns><column><sections><section><rows>"
            f"<row><cell>{TIMELINE_XML}</cell></row>"
            "</rows></section></sections></column></columns></tab></tabs>"
            "</form>"
        ),
    }]

    timelines = extract_timeline_definitions(forms, "account")
    dependencies = timeline_dependency_names(timelines)

    assert len(timelines) == 1
    assert {
        "activitypointer",
        "activityparty",
        "activitymimeattachment",
        "annotation",
        "post",
        "postcomment",
        "email",
        "task",
        "new_sms",
    }.issubset(set(dependencies))


def test_card_form_projection_obeys_timeline_limits():
    forms = [{
        "formid": "{CARD-ID}",
        "name": "Task Card",
        "type": 11,
        "formxml": """
          <form><tabs><tab><columns><column><sections>
            <section name="Header"><rows><row>
              <cell><labels><label description="Subject" /></labels>
                <control datafieldname="subject" /></cell>
              <cell><labels><label description="Modified" /></labels>
                <control datafieldname="modifiedon" /></cell>
              <cell><control datafieldname="ownerid" /></cell>
            </row></rows></section>
            <section name="Details"><rows>
              <row><cell><control datafieldname="description" /></cell></row>
              <row><cell><control datafieldname="prioritycode" /></cell></row>
              <row><cell><control datafieldname="regardingobjectid" /></cell></row>
              <row><cell><control datafieldname="createdon" /></cell></row>
            </rows></section>
            <section name="Footer"><rows><row>
              <cell><control datafieldname="ownerid" /></cell>
            </row></rows></section>
          </sections></column></columns></tab></tabs></form>
        """,
    }]

    card = extract_card_forms(forms)[0]

    assert card["form_id"] == "card-id"
    assert [field["attribute"] for field in card["header"]] == [
        "subject",
        "modifiedon",
    ]
    assert [field["attribute"] for field in card["details"]] == [
        "description",
        "prioritycode",
        "regardingobjectid",
    ]
