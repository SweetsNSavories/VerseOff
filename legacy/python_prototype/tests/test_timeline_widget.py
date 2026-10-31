import os
import sys
from copy import deepcopy

from PyQt6.QtWidgets import QDialog


GENERATED_APP_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out")
)
if GENERATED_APP_DIR not in sys.path:
    sys.path.insert(0, GENERATED_APP_DIR)

import timeline_widget as timeline_module
from timeline_widget import TimelineWidget
from xrm_form_renderer import PythonTimelineControl


class FakeTimelineDatabase:
    def __init__(self):
        self.preferences = {}
        self.pins = set()
        self.upserts = []
        self.deletes = []
        self.actions = []
        self.records = {
            "activitypointer": [{
                "activityid": "activity-1",
                "activitytypecode": "task",
                "subject": "Call customer",
                "description": "Discuss renewal",
                "_regardingobjectid_value": "account-1",
                "statecode": 0,
                "sortdate": "2026-08-20T12:00:00+00:00",
            }],
            "task": [{
                "activityid": "activity-1",
                "subject": "Call customer",
                "statecode": 0,
            }],
            "annotation": [{
                "annotationid": "note-1",
                "subject": "Important note",
                "notetext": "<p>Follow up tomorrow</p>",
                "_objectid_value": "account-1",
                "modifiedon": "2026-08-21T12:00:00+00:00",
            }],
            "post": [{
                "postid": "post-1",
                "text": "Customer replied",
                "_regardingobjectid_value": "account-1",
                "createdon": "2026-08-19T12:00:00+00:00",
            }],
        }

    def get_timeline_preferences(self, timeline_id, parent_entity):
        return dict(self.preferences)

    def set_timeline_preferences(self, timeline_id, parent_entity, settings):
        self.preferences = dict(settings)

    def get_timeline_pins(self, timeline_id):
        return set(self.pins)

    def set_timeline_pin(
        self,
        timeline_id,
        entity_name,
        record_id,
        pinned,
    ):
        key = (entity_name, record_id)
        if pinned:
            self.pins.add(key)
        else:
            self.pins.discard(key)

    def list_records(self, entity_name, include_deleted=False):
        return deepcopy(self.records.get(entity_name, []))

    def search_timeline_record_ids(self, parent_id, query):
        query = query.lower()
        found = set()
        for entity_name, records in self.records.items():
            for record in records:
                text = " ".join(str(value) for value in record.values())
                record_id = (
                    record.get("activityid")
                    or record.get("annotationid")
                    or record.get("postid")
                )
                if query in text.lower() and record_id:
                    found.add((entity_name, record_id))
        return found

    def get_record(self, entity_name, record_id):
        for record in self.records.get(entity_name, []):
            if record_id in {
                record.get("activityid"),
                record.get("annotationid"),
                record.get("postid"),
            }:
                return deepcopy(record)
        return None

    def upsert_record(
        self,
        entity_name,
        record_id,
        data,
        sync_status="synced",
        sync_error=None,
    ):
        self.upserts.append(
            (entity_name, record_id, deepcopy(data), sync_status)
        )

    def queue_delete(self, entity_name, record_id):
        self.deletes.append((entity_name, record_id))
        return True

    def queue_timeline_action(
        self,
        timeline_id,
        entity_name,
        record_id,
        action_name,
        payload=None,
    ):
        self.actions.append(
            (entity_name, record_id, action_name, payload)
        )


def timeline_manifest():
    return {
        "timeline_settings": {
            "max_upload_file_size": 94371840,
            "blocked_extensions": [],
        },
        "entities": [
            {
                "LogicalName": "account",
                "DisplayName": {
                    "UserLocalizedLabel": {"Label": "Account"}
                },
            },
            {
                "LogicalName": "activitypointer",
                "_verseoff_dependency_only": True,
            },
            {
                "LogicalName": "task",
                "DisplayName": {
                    "UserLocalizedLabel": {"Label": "Task"}
                },
                "PrimaryIdAttribute": "activityid",
                "card_forms": [{
                    "form_id": "task-card",
                    "name": "Task Card",
                    "header": [
                        {"attribute": "subject", "label": "Subject"},
                        {"attribute": "sortdate", "label": "Date"},
                    ],
                    "details": [
                        {
                            "attribute": "description",
                            "label": "Description",
                        }
                    ],
                }],
            },
            {
                "LogicalName": "annotation",
                "PrimaryIdAttribute": "annotationid",
            },
            {
                "LogicalName": "post",
                "PrimaryIdAttribute": "postid",
            },
        ],
    }


def timeline_definition():
    return {
        "id": "account-form:notescontrol",
        "control_id": "notescontrol",
        "modules": ["Activities", "Notes", "Posts"],
        "default_create_module": "Notes",
        "show_filter_pane": True,
        "show_search": True,
        "record_per_page": 2,
        "order": "descending",
        "activity_sort_field": "sortdate",
        "activities": ["task"],
        "activity_configuration": {
            "task": {
                "canCreate": True,
                "showStatus": True,
                "fieldsConfig": {
                    "body": [{
                        "labelOption": "Show",
                        "displayOption": "AlwaysShow",
                    }]
                },
            }
        },
        "activity_card_map": {
            "task": {
                "logical_name": "task",
                "object_type_code": "4212",
                "form_id": "task-card",
            }
        },
        "custom_record_sources": [],
    }


def test_timeline_unifies_records_filters_pages_and_pins(
    qtbot,
    monkeypatch,
):
    database = FakeTimelineDatabase()
    monkeypatch.setattr(
        timeline_module,
        "LocalDatabase",
        lambda: database,
    )
    monkeypatch.setattr(
        timeline_module,
        "ENTITY_NAMES",
        {
            "activitypointer",
            "task",
            "annotation",
            "post",
        },
    )
    widget = TimelineWidget(
        timeline_manifest(),
        "account",
        timeline_definition(),
        record_id="account-1",
    )
    qtbot.addWidget(widget)

    assert len(widget.records) == 3
    assert len(widget.filtered_records) == 3
    assert widget.status_label.text() == "Showing 2 of 3 records"

    widget.search.setText("follow up")
    assert [record["__kind"] for record in widget.filtered_records] == [
        "note"
    ]

    widget.search.clear()
    activity = next(
        record
        for record in widget.records
        if record["__kind"] == "activity"
    )
    widget._set_pin(activity, True)
    assert ("task", "activity-1") in database.pins
    assert widget.filtered_records[0]["__kind"] == "activity"

    widget._transition_activity(activity, "complete")
    assert database.upserts[-1][0] == "task"
    assert database.upserts[-1][2]["statecode"] == 1
    assert database.actions[-1][2] == "complete"


def test_timeline_note_payload_and_client_api(
    qtbot,
    monkeypatch,
    tmp_path,
):
    database = FakeTimelineDatabase()
    monkeypatch.setattr(
        timeline_module,
        "LocalDatabase",
        lambda: database,
    )
    monkeypatch.setattr(
        timeline_module,
        "ENTITY_NAMES",
        {"activitypointer", "task", "annotation", "post"},
    )
    widget = TimelineWidget(
        timeline_manifest(),
        "account",
        timeline_definition(),
        record_id="account-1",
    )
    qtbot.addWidget(widget)

    attachment = tmp_path / "evidence.txt"
    attachment.write_text("evidence", encoding="utf-8")

    class Dialog:
        attachment_path = str(attachment)

        class Subject:
            @staticmethod
            def text():
                return "Evidence"

        class Body:
            @staticmethod
            def toPlainText():
                return "Attached note"

        subject = Subject()
        body = Body()

    payload = widget._note_payload(Dialog(), "note-new")
    assert payload["annotationid"] == "note-new"
    assert payload["_objectid_value"] == "account-1"
    assert payload["isdocument"] is True
    assert payload["filename"] == "evidence.txt"

    control = PythonTimelineControl(
        "notescontrol",
        widget,
        None,
        None,
    )
    assert control.getControlType() == "timelinewall"
    control.refresh()

    bridge_source = open(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "VerseOff",
            "verseoff_bridge.js",
        ),
        encoding="utf-8",
    ).read()
    assert "getControlType" in bridge_source
    assert "refreshControlFromJS" in bridge_source
