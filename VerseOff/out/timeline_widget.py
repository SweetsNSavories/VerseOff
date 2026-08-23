
import base64
import html
import json
import mimetypes
import os
import re
import tempfile
import uuid
from datetime import datetime, timezone

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtWidgets import (
    QDialog,
    QFileDialog,
    QFrame,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QScrollArea,
    QSizePolicy,
    QTextEdit,
    QToolButton,
    QVBoxLayout,
    QWidget,
)

from db import ENTITY_NAMES, LocalDatabase
from ui_components import FluentComboBox as QComboBox


def _normalize_id(value):
    return str(value or "").strip().strip("{}").lower()


def _plain_text(value):
    text = html.unescape(str(value or ""))
    text = re.sub(r"<(br|/p|/div|/li)\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def _formatted(record, field):
    annotation = (
        f"{field}@OData.Community.Display.V1.FormattedValue"
    )
    if annotation in record:
        return record[annotation]
    raw_lookup = f"_{field}_value"
    if raw_lookup in record:
        formatted_lookup = (
            f"{raw_lookup}@OData.Community.Display.V1.FormattedValue"
        )
        return record.get(formatted_lookup, record[raw_lookup])
    return record.get(field)


def _parse_datetime(value):
    if not value:
        return None
    text = str(value).replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def _relative_time(value):
    parsed = _parse_datetime(value)
    if parsed is None:
        return str(value or "")
    now = datetime.now(timezone.utc)
    seconds = int((now - parsed.astimezone(timezone.utc)).total_seconds())
    future = seconds < 0
    seconds = abs(seconds)
    if seconds < 60:
        amount, unit = seconds, "second"
    elif seconds < 3600:
        amount, unit = seconds // 60, "minute"
    elif seconds < 86400:
        amount, unit = seconds // 3600, "hour"
    elif seconds < 2592000:
        amount, unit = seconds // 86400, "day"
    else:
        return parsed.astimezone().strftime("%Y-%m-%d %H:%M")
    suffix = "from now" if future else "ago"
    plural = "" if amount == 1 else "s"
    return f"{amount} {unit}{plural} {suffix}"


class TimelineCard(QFrame):
    open_requested = pyqtSignal(dict)
    delete_requested = pyqtSignal(dict)
    pin_requested = pyqtSignal(dict, bool)
    transition_requested = pyqtSignal(dict, str)
    edit_note_requested = pyqtSignal(dict)
    attachment_requested = pyqtSignal(dict)

    def __init__(
        self,
        record,
        *,
        title,
        subtitle,
        summary_lines,
        expanded_lines,
        timestamp,
        status,
        pinned,
        show_status,
        parent=None,
    ):
        super().__init__(parent)
        self.record = record
        self.expanded = False
        self.setObjectName("TimelineCard")
        self.setFrameShape(QFrame.Shape.StyledPanel)
        self.setStyleSheet("""
            QFrame#TimelineCard {
                background: #ffffff;
                border: 1px solid #e1dfdd;
                border-radius: 6px;
            }
            QFrame#TimelineCard:hover {
                border-color: #a19f9d;
            }
            QLabel#TimelineStatus {
                border-radius: 8px;
                padding: 2px 7px;
                font-size: 10px;
                font-weight: 600;
            }
        """)
        root = QVBoxLayout(self)
        root.setContentsMargins(12, 9, 12, 9)
        root.setSpacing(6)

        header = QHBoxLayout()
        type_label = QLabel(
            record.get("__type_label")
            or record.get("__kind", "Record").title()
        )
        type_label.setStyleSheet(
            "color: #0f6cbd; font-size: 11px; font-weight: 600;"
        )
        header.addWidget(type_label)
        header.addStretch()

        if show_status and status:
            status_label = QLabel(status)
            status_label.setObjectName("TimelineStatus")
            if status in {"Overdue", "Canceled"}:
                colors = "background:#fde7e9;color:#a4262c;"
            elif status in {"Completed", "Closed"}:
                colors = "background:#dff6dd;color:#107c10;"
            else:
                colors = "background:#eff6fc;color:#0f6cbd;"
            status_label.setStyleSheet(colors)
            header.addWidget(status_label)

        pin_button = QToolButton()
        pin_button.setText("Unpin" if pinned else "Pin")
        pin_button.setToolTip(
            "Remove from pinned Timeline records"
            if pinned
            else "Pin this record to the top"
        )
        pin_button.clicked.connect(
            lambda: self.pin_requested.emit(record, not pinned)
        )
        header.addWidget(pin_button)
        root.addLayout(header)

        title_label = QLabel(title or "Untitled")
        title_label.setWordWrap(True)
        title_label.setStyleSheet(
            "font-size: 13px; font-weight: 600; color: #201f1e;"
        )
        root.addWidget(title_label)

        if subtitle:
            subtitle_label = QLabel(str(subtitle))
            subtitle_label.setWordWrap(True)
            subtitle_label.setStyleSheet("color:#605e5c;font-size:11px;")
            root.addWidget(subtitle_label)

        for label, value in summary_lines:
            if value in (None, ""):
                continue
            line = QLabel(
                (
                    f"<b>{html.escape(str(label))}:</b> "
                    if label
                    else ""
                )
                + html.escape(_plain_text(value))
            )
            line.setTextFormat(Qt.TextFormat.RichText)
            line.setWordWrap(True)
            line.setStyleSheet("color:#323130;font-size:11px;")
            root.addWidget(line)

        self.expanded_container = QWidget()
        expanded_layout = QVBoxLayout(self.expanded_container)
        expanded_layout.setContentsMargins(0, 0, 0, 0)
        expanded_layout.setSpacing(4)
        for label, value in expanded_lines:
            if value in (None, ""):
                continue
            line = QLabel(
                (
                    f"<b>{html.escape(str(label))}:</b> "
                    if label
                    else ""
                )
                + html.escape(_plain_text(value))
            )
            line.setTextFormat(Qt.TextFormat.RichText)
            line.setWordWrap(True)
            line.setStyleSheet("color:#323130;font-size:11px;")
            expanded_layout.addWidget(line)
        self.expanded_container.setVisible(False)
        root.addWidget(self.expanded_container)

        footer = QHBoxLayout()
        timestamp_label = QLabel(_relative_time(timestamp))
        timestamp_label.setStyleSheet("color:#797775;font-size:10px;")
        footer.addWidget(timestamp_label)
        footer.addStretch()

        if record.get("__kind") == "note":
            if record.get("isdocument") or record.get("documentbody"):
                attachment = QPushButton(
                    record.get("filename") or "Open attachment"
                )
                attachment.clicked.connect(
                    lambda: self.attachment_requested.emit(record)
                )
                footer.addWidget(attachment)
            edit = QPushButton("Edit")
            edit.clicked.connect(
                lambda: self.edit_note_requested.emit(record)
            )
            footer.addWidget(edit)

        if record.get("__kind") == "activity":
            state = str(record.get("statecode", "0"))
            if state in {"0", "3"}:
                complete = QPushButton("Complete")
                complete.clicked.connect(
                    lambda: self.transition_requested.emit(
                        record,
                        "complete",
                    )
                )
                footer.addWidget(complete)

        open_button = QPushButton("Open")
        open_button.clicked.connect(
            lambda: self.open_requested.emit(record)
        )
        footer.addWidget(open_button)

        delete_button = QPushButton("Delete")
        delete_button.clicked.connect(
            lambda: self.delete_requested.emit(record)
        )
        footer.addWidget(delete_button)

        if expanded_lines:
            self.expand_button = QPushButton("Expand")
            self.expand_button.clicked.connect(self._toggle_expanded)
            footer.addWidget(self.expand_button)
        root.addLayout(footer)

    def _toggle_expanded(self):
        self.expanded = not self.expanded
        self.expanded_container.setVisible(self.expanded)
        self.expand_button.setText(
            "Collapse" if self.expanded else "Expand"
        )


class TimelineEntryDialog(QDialog):
    def __init__(
        self,
        *,
        title,
        body="",
        subject="",
        allow_attachment=False,
        parent=None,
    ):
        super().__init__(parent)
        self.attachment_path = ""
        self.setWindowTitle(title)
        self.resize(520, 380)
        layout = QVBoxLayout(self)
        self.subject = QLineEdit(subject)
        self.subject.setPlaceholderText("Title")
        layout.addWidget(self.subject)
        self.body = QTextEdit()
        self.body.setPlainText(_plain_text(body))
        self.body.setPlaceholderText("Enter text")
        layout.addWidget(self.body)

        actions = QHBoxLayout()
        if allow_attachment:
            self.attachment_label = QLabel("No attachment")
            actions.addWidget(self.attachment_label)
            attach = QPushButton("Attach file")
            attach.clicked.connect(self._choose_attachment)
            actions.addWidget(attach)
        actions.addStretch()
        cancel = QPushButton("Cancel")
        cancel.clicked.connect(self.reject)
        save = QPushButton("Save")
        save.clicked.connect(self.accept)
        actions.addWidget(cancel)
        actions.addWidget(save)
        layout.addLayout(actions)

    def _choose_attachment(self):
        path, _ = QFileDialog.getOpenFileName(
            self,
            "Choose attachment",
        )
        if path:
            self.attachment_path = path
            self.attachment_label.setText(os.path.basename(path))


class TimelineWidget(QWidget):
    refreshed = pyqtSignal()

    def __init__(
        self,
        manifest,
        parent_entity,
        definition,
        record_id=None,
        open_form_callback=None,
        parent=None,
    ):
        super().__init__(parent)
        self.manifest = manifest
        self.parent_entity = parent_entity
        self.definition = definition
        self.record_id = record_id
        self.open_form_callback = open_form_callback
        self.database = LocalDatabase()
        self.timeline_id = definition.get("id") or definition.get(
            "control_id",
            "Timeline",
        )
        self.page = 1
        self.records = []
        self.filtered_records = []
        self.pins = set()
        self.preferences = self.database.get_timeline_preferences(
            self.timeline_id,
            self.parent_entity,
        )
        self._build_ui()
        self.refresh()

    def getControlType(self):
        return "timelinewall"

    def set_record_id(self, record_id):
        self.record_id = record_id
        self.page = 1
        self.refresh()

    def _build_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(7)

        toolbar = QHBoxLayout()
        title = QLabel("Timeline")
        title.setStyleSheet(
            "font-size:16px;font-weight:600;color:#201f1e;"
        )
        toolbar.addWidget(title)
        toolbar.addStretch()

        self.create_combo = QComboBox()
        self._populate_create_options()
        toolbar.addWidget(self.create_combo)
        create_button = QPushButton("Create")
        create_button.clicked.connect(self._create_selected)
        toolbar.addWidget(create_button)
        refresh_button = QPushButton("Refresh")
        refresh_button.clicked.connect(self.refresh)
        toolbar.addWidget(refresh_button)
        root.addLayout(toolbar)

        search_row = QHBoxLayout()
        self.search = QLineEdit()
        self.search.setPlaceholderText("Search timeline")
        self.search.setVisible(
            bool(self.definition.get("show_search", True))
        )
        self.search.textChanged.connect(self._filters_changed)
        search_row.addWidget(self.search, 1)

        self.record_type_filter = QComboBox()
        self.record_type_filter.addItem("All records", "")
        for module in self.definition.get("modules", []):
            self.record_type_filter.addItem(module, module.lower())
        preferred_record_type = self.preferences.get("record_type", "")
        preferred_index = self.record_type_filter.findData(
            preferred_record_type
        )
        if preferred_index >= 0:
            self.record_type_filter.setCurrentIndex(preferred_index)
        self.record_type_filter.currentIndexChanged.connect(
            self._filters_changed
        )
        self.record_type_filter.setVisible(
            bool(self.definition.get("show_filter_pane", True))
        )
        search_row.addWidget(self.record_type_filter)

        self.activity_filter = QComboBox()
        self.activity_filter.addItem("All activity types", "")
        for activity in self.definition.get("activities", []):
            self.activity_filter.addItem(
                self._entity_label(activity),
                activity,
            )
        preferred_activity = self.preferences.get("activity_type", "")
        preferred_index = self.activity_filter.findData(preferred_activity)
        if preferred_index >= 0:
            self.activity_filter.setCurrentIndex(preferred_index)
        self.activity_filter.currentIndexChanged.connect(
            self._filters_changed
        )
        self.activity_filter.setVisible(
            bool(self.definition.get("show_filter_pane", True))
            and "Activities" in self.definition.get("modules", [])
        )
        search_row.addWidget(self.activity_filter)

        self.status_filter = QComboBox()
        self.status_filter.addItem("All statuses", "")
        for status in ("Active", "Overdue", "Completed", "Canceled"):
            self.status_filter.addItem(status, status.lower())
        preferred_status = self.preferences.get("status", "")
        preferred_index = self.status_filter.findData(preferred_status)
        if preferred_index >= 0:
            self.status_filter.setCurrentIndex(preferred_index)
        self.status_filter.currentIndexChanged.connect(
            self._filters_changed
        )
        self.status_filter.setVisible(
            bool(self.definition.get("show_filter_pane", True))
        )
        search_row.addWidget(self.status_filter)

        self.sort_combo = QComboBox()
        self.sort_combo.addItem("Newest first", "descending")
        self.sort_combo.addItem("Oldest first", "ascending")
        configured_order = self.preferences.get(
            "order",
            self.definition.get("order", "descending"),
        )
        index = self.sort_combo.findData(configured_order)
        if index >= 0:
            self.sort_combo.setCurrentIndex(index)
        self.sort_combo.currentIndexChanged.connect(
            self._filters_changed
        )
        search_row.addWidget(self.sort_combo)
        root.addLayout(search_row)

        if self.definition.get("custom_record_sources"):
            custom_warning = QLabel(
                "Custom Timeline record sources require an online adapter "
                "and are not loaded in this offline client."
            )
            custom_warning.setWordWrap(True)
            custom_warning.setStyleSheet(
                "background:#fff4ce;color:#604b00;border-radius:4px;"
                "padding:7px;"
            )
            root.addWidget(custom_warning)

        self.scroll = QScrollArea()
        self.scroll.setWidgetResizable(True)
        self.cards_host = QWidget()
        self.cards_layout = QVBoxLayout(self.cards_host)
        self.cards_layout.setContentsMargins(2, 2, 2, 2)
        self.cards_layout.setSpacing(8)
        self.cards_layout.addStretch()
        self.scroll.setWidget(self.cards_host)
        root.addWidget(self.scroll)

        self.load_more = QPushButton("Load more")
        self.load_more.clicked.connect(self._load_more)
        root.addWidget(self.load_more)
        self.status_label = QLabel()
        self.status_label.setStyleSheet("color:#605e5c;font-size:11px;")
        root.addWidget(self.status_label)

    def _populate_create_options(self):
        self.create_combo.clear()
        modules = self.definition.get("modules", [])
        default_module = self.definition.get(
            "default_create_module",
            "Notes",
        )
        if "Notes" in modules:
            self.create_combo.addItem("Note", ("note", "annotation"))
        if "Posts" in modules and "post" in ENTITY_NAMES:
            self.create_combo.addItem("Post", ("post", "post"))
        for logical_name in self.definition.get("activities", []):
            configuration = self.definition.get(
                "activity_configuration",
                {},
            ).get(logical_name, {})
            if configuration.get("canCreate", True):
                self.create_combo.addItem(
                    self._entity_label(logical_name),
                    ("activity", logical_name),
                )
        for index in range(self.create_combo.count()):
            if (
                self.create_combo.itemData(index)[0].title()
                == default_module
            ):
                self.create_combo.setCurrentIndex(index)
                break

    def _entity_definition(self, logical_name):
        return next(
            (
                item
                for item in self.manifest.get("entities", [])
                if item.get("LogicalName") == logical_name
            ),
            None,
        )

    def _entity_label(self, logical_name):
        definition = self._entity_definition(logical_name)
        display = (
            definition.get("DisplayName")
            if definition
            else None
        )
        if isinstance(display, dict):
            display = (
                display.get("UserLocalizedLabel", {}).get("Label")
            )
        return display or logical_name.replace("_", " ").title()

    @staticmethod
    def _related_value(record, fields):
        for field in fields:
            value = record.get(field)
            if value:
                return _normalize_id(value)
        return ""

    def _is_related(self, record, kind):
        if not self.record_id:
            return False
        parent_id = _normalize_id(self.record_id)
        if kind == "note":
            return self._related_value(
                record,
                ("_objectid_value", "objectid"),
            ) == parent_id
        return self._related_value(
            record,
            (
                "_regardingobjectid_value",
                "regardingobjectid",
                "_objectid_value",
                "objectid",
            ),
        ) == parent_id

    def _load_activity_records(self):
        if not self.record_id or "activitypointer" not in ENTITY_NAMES:
            return []
        allowed = set(self.definition.get("activities", []))
        records = []
        for record in self.database.list_records("activitypointer"):
            if not self._is_related(record, "activity"):
                continue
            activity_type = str(
                record.get("activitytypecode")
                or record.get(
                    "activitytypecode@"
                    "OData.Community.Display.V1.FormattedValue"
                )
                or ""
            ).lower()
            if allowed and activity_type not in allowed:
                continue
            activity_id = (
                record.get("activityid")
                or record.get("id")
            )
            if activity_type in ENTITY_NAMES and activity_id:
                concrete = self.database.get_record(
                    activity_type,
                    activity_id,
                )
                if concrete:
                    merged = dict(record)
                    merged.update({
                        key: value
                        for key, value in concrete.items()
                        if not key.startswith("_sync")
                    })
                    record = merged
            record["__entity"] = activity_type or "activitypointer"
            record["__id"] = activity_id
            record["__kind"] = "activity"
            record["__activity_type"] = activity_type
            record["__type_label"] = self._entity_label(
                activity_type or "activitypointer"
            )
            records.append(record)
        return records

    def _load_note_records(self):
        if not self.record_id or "annotation" not in ENTITY_NAMES:
            return []
        records = []
        for record in self.database.list_records("annotation"):
            if not self._is_related(record, "note"):
                continue
            record["__entity"] = "annotation"
            record["__id"] = (
                record.get("annotationid")
                or record.get("id")
            )
            record["__kind"] = "note"
            record["__type_label"] = "Note"
            records.append(record)
        return records

    def _load_post_records(self):
        if not self.record_id or "post" not in ENTITY_NAMES:
            return []
        related_post_ids = set()
        if "postregarding" in ENTITY_NAMES:
            for regarding in self.database.list_records("postregarding"):
                if not self._is_related(regarding, "post"):
                    continue
                post_id = (
                    regarding.get("_postid_value")
                    or regarding.get("postid")
                )
                if post_id:
                    related_post_ids.add(_normalize_id(post_id))
        records = []
        for record in self.database.list_records("post"):
            post_id = record.get("postid") or record.get("id")
            if (
                not self._is_related(record, "post")
                and _normalize_id(post_id) not in related_post_ids
            ):
                continue
            record["__entity"] = "post"
            record["__id"] = post_id
            record["__kind"] = "post"
            record["__type_label"] = "Post"
            records.append(record)
        return records

    def _record_status(self, record):
        if record.get("__kind") != "activity":
            return ""
        state = str(record.get("statecode", "0"))
        if state == "1":
            return "Completed"
        if state == "2":
            return "Canceled"
        due = _parse_datetime(
            record.get("scheduledend") or record.get("sortdate")
        )
        if (
            state in {"0", "3"}
            and due is not None
            and due.astimezone(timezone.utc) < datetime.now(timezone.utc)
        ):
            return "Overdue"
        return "Active"

    def _sort_value(self, record):
        configured = self.definition.get(
            "activity_sort_field",
            "modifiedon",
        )
        value = (
            record.get(configured)
            or record.get("sortdate")
            or record.get("modifiedon")
            or record.get("createdon")
            or record.get("scheduledstart")
            or ""
        )
        parsed = _parse_datetime(value)
        return parsed.timestamp() if parsed else 0

    def _apply_filters(self):
        records = list(self.records)
        record_type = self.record_type_filter.currentData()
        if record_type:
            expected = {
                "activities": "activity",
                "notes": "note",
                "posts": "post",
            }.get(record_type)
            records = [
                record
                for record in records
                if record.get("__kind") == expected
            ]
        activity_type = self.activity_filter.currentData()
        if activity_type:
            records = [
                record
                for record in records
                if record.get("__activity_type") == activity_type
            ]
        status = self.status_filter.currentData()
        if status:
            records = [
                record
                for record in records
                if self._record_status(record).lower() == status
            ]
        query = self.search.text().strip()
        if query:
            indexed = self.database.search_timeline_record_ids(
                self.record_id,
                query,
            )
            query_lower = query.lower()
            records = [
                record
                for record in records
                if (
                    (record["__entity"], str(record["__id"])) in indexed
                    or query_lower
                    in " ".join(
                        str(record.get(field) or "")
                        for field in (
                            "subject",
                            "title",
                            "description",
                            "notetext",
                            "text",
                        )
                    ).lower()
                )
            ]
        descending = self.sort_combo.currentData() == "descending"
        records.sort(
            key=lambda record: (
                (record["__entity"], str(record["__id"])) in self.pins,
                self._sort_value(record),
            ),
            reverse=descending,
        )
        pinned = [
            record
            for record in records
            if (record["__entity"], str(record["__id"])) in self.pins
        ]
        unpinned = [
            record
            for record in records
            if (record["__entity"], str(record["__id"])) not in self.pins
        ]
        self.filtered_records = pinned + unpinned

    def refresh(self):
        self.page = max(1, self.page)
        if not self.record_id:
            self.pins = set()
            self.records = []
            self.filtered_records = []
            self._render_cards()
            self.refreshed.emit()
            return
        self.pins = self.database.get_timeline_pins(self.timeline_id)
        records = []
        modules = set(self.definition.get("modules", []))
        if "Activities" in modules:
            records.extend(self._load_activity_records())
        if "Notes" in modules:
            records.extend(self._load_note_records())
        if "Posts" in modules:
            records.extend(self._load_post_records())
        self.records = records
        self._apply_filters()
        self._render_cards()
        self.refreshed.emit()

    def _clear_cards(self):
        while self.cards_layout.count() > 1:
            item = self.cards_layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.setParent(None)
                widget.deleteLater()

    def _render_cards(self):
        self._clear_cards()
        if not self.record_id:
            empty = QLabel(
                "Save this record before adding Timeline records."
            )
            empty.setWordWrap(True)
            empty.setStyleSheet("color:#605e5c;padding:16px;")
            self.cards_layout.insertWidget(0, empty)
            self.load_more.hide()
            self.status_label.setText("0 records")
            return
        page_size = int(self.definition.get("record_per_page", 10))
        visible = self.filtered_records[: page_size * self.page]
        if not visible:
            empty = QLabel("No Timeline records match the current filters.")
            empty.setWordWrap(True)
            empty.setStyleSheet("color:#605e5c;padding:16px;")
            self.cards_layout.insertWidget(0, empty)
        for record in visible:
            card = self._create_card(record)
            self.cards_layout.insertWidget(
                self.cards_layout.count() - 1,
                card,
            )
        self.load_more.setVisible(len(visible) < len(self.filtered_records))
        self.status_label.setText(
            f"Showing {len(visible)} of {len(self.filtered_records)} records"
        )

    def _card_definition(self, record):
        activity_type = record.get("__activity_type")
        definition = self._entity_definition(activity_type)
        if not definition:
            return None
        card_map = self.definition.get("activity_card_map", {}).get(
            activity_type,
            {},
        )
        form_id = _normalize_id(card_map.get("form_id"))
        card_forms = definition.get("card_forms", [])
        if form_id:
            selected = next(
                (
                    form
                    for form in card_forms
                    if _normalize_id(form.get("form_id")) == form_id
                ),
                None,
            )
            if selected:
                return selected
        return card_forms[0] if card_forms else None

    def _project_activity_card(self, record):
        configuration = self.definition.get(
            "activity_configuration",
            {},
        ).get(record.get("__activity_type"), {})
        card = self._card_definition(record)
        if card:
            header_fields = card.get("header", [])
            detail_fields = card.get("details", [])
        else:
            header_fields = [
                {"attribute": "subject", "label": "Subject"},
                {"attribute": "modifiedon", "label": "Modified On"},
            ]
            detail_fields = [
                {"attribute": "description", "label": "Description"},
                {"attribute": "ownerid", "label": "Owner"},
                {"attribute": "regardingobjectid", "label": "Regarding"},
            ]
        fields_config = configuration.get("fieldsConfig", {})
        title = _formatted(
            record,
            header_fields[0]["attribute"],
        ) if header_fields else record.get("subject")
        timestamp = (
            _formatted(record, header_fields[1]["attribute"])
            if len(header_fields) > 1
            else record.get("modifiedon")
        )
        summary = []
        expanded = []
        body_config = fields_config.get("body", [])
        for index, field in enumerate(detail_fields):
            display = (
                body_config[index].get("displayOption")
                if index < len(body_config)
                else "AlwaysShow"
            )
            label_option = (
                body_config[index].get("labelOption")
                if index < len(body_config)
                else "Show"
            )
            value = _formatted(record, field["attribute"])
            item = (
                field["label"] if label_option != "Hide" else "",
                value,
            )
            if display == "ShowOnExpand":
                expanded.append(item)
            elif display != "Hide":
                summary.append(item)
        return (
            title,
            record.get("__type_label"),
            summary,
            expanded,
            timestamp,
            configuration.get("showStatus", True),
        )

    def _create_card(self, record):
        kind = record.get("__kind")
        if kind == "activity":
            (
                title,
                subtitle,
                summary,
                expanded,
                timestamp,
                show_status,
            ) = self._project_activity_card(record)
        elif kind == "note":
            title = record.get("subject") or "Note"
            subtitle = _formatted(record, "modifiedby")
            summary = [("", record.get("notetext"))]
            expanded = []
            timestamp = record.get("modifiedon") or record.get("createdon")
            show_status = False
        else:
            title = _formatted(record, "createdby") or "Post"
            subtitle = ""
            summary = [("", record.get("text") or record.get("message"))]
            expanded = []
            timestamp = record.get("modifiedon") or record.get("createdon")
            show_status = False
        key = (record["__entity"], str(record["__id"]))
        card = TimelineCard(
            record,
            title=title,
            subtitle=subtitle,
            summary_lines=summary,
            expanded_lines=expanded,
            timestamp=timestamp,
            status=self._record_status(record),
            pinned=key in self.pins,
            show_status=show_status,
            parent=self,
        )
        card.open_requested.connect(self._open_record)
        card.delete_requested.connect(self._delete_record)
        card.pin_requested.connect(self._set_pin)
        card.transition_requested.connect(self._transition_activity)
        card.edit_note_requested.connect(self._edit_note)
        card.attachment_requested.connect(self._open_attachment)
        if (
            self.definition.get("expand_all")
            and hasattr(card, "expand_button")
        ):
            card._toggle_expanded()
        return card

    def _filters_changed(self):
        self.page = 1
        self.database.set_timeline_preferences(
            self.timeline_id,
            self.parent_entity,
            {
                "order": self.sort_combo.currentData(),
                "record_type": self.record_type_filter.currentData(),
                "activity_type": self.activity_filter.currentData(),
                "status": self.status_filter.currentData(),
            },
        )
        self._apply_filters()
        self._render_cards()

    def _load_more(self):
        self.page += 1
        self._render_cards()

    def _create_selected(self):
        selection = self.create_combo.currentData()
        if not selection:
            return
        kind, entity_name = selection
        if kind == "note":
            self._create_note()
        elif kind == "post":
            self._create_post()
        elif self.open_form_callback:
            self.open_form_callback(entity_name, None)

    def _validate_attachment(self, path):
        settings = self.manifest.get("timeline_settings", {})
        maximum = int(
            settings.get("max_upload_file_size") or 94371840
        )
        size = os.path.getsize(path)
        if size > maximum:
            raise ValueError(
                f"Attachment exceeds the configured {maximum} byte limit."
            )
        extension = os.path.splitext(path)[1].lower().lstrip(".")
        blocked = {
            str(item).lower().lstrip(".")
            for item in settings.get("blocked_extensions", [])
        }
        if extension in blocked:
            raise ValueError(
                f"Files with the .{extension} extension are blocked."
            )

    def _note_payload(self, dialog, record_id):
        data = {
            "annotationid": record_id,
            "subject": dialog.subject.text().strip() or "Note",
            "notetext": dialog.body.toPlainText(),
            "objectid": self.record_id,
            "_objectid_value": self.record_id,
            (
                "_objectid_value@"
                "Microsoft.Dynamics.CRM.lookuplogicalname"
            ): self.parent_entity,
            "modifiedon": datetime.now(timezone.utc).isoformat(),
        }
        if dialog.attachment_path:
            self._validate_attachment(dialog.attachment_path)
            with open(dialog.attachment_path, "rb") as attachment:
                body = attachment.read()
            data.update({
                "isdocument": True,
                "filename": os.path.basename(dialog.attachment_path),
                "mimetype": (
                    mimetypes.guess_type(dialog.attachment_path)[0]
                    or "application/octet-stream"
                ),
                "filesize": len(body),
                "documentbody": base64.b64encode(body).decode("ascii"),
            })
        return data

    def _create_note(self):
        if "annotation" not in ENTITY_NAMES:
            QMessageBox.warning(
                self,
                "Notes unavailable",
                "The annotation table isn't included in this project.",
            )
            return
        dialog = TimelineEntryDialog(
            title="Add note",
            allow_attachment=True,
            parent=self,
        )
        if dialog.exec() != QDialog.DialogCode.Accepted:
            return
        try:
            record_id = str(uuid.uuid4())
            data = self._note_payload(dialog, record_id)
            self.database.upsert_record(
                "annotation",
                record_id,
                data,
                sync_status="pending_create",
            )
        except (OSError, ValueError) as error:
            QMessageBox.critical(self, "Could not add note", str(error))
            return
        self.refresh()

    def _edit_note(self, record):
        dialog = TimelineEntryDialog(
            title="Edit note",
            subject=record.get("subject") or "",
            body=record.get("notetext") or "",
            allow_attachment=True,
            parent=self,
        )
        if dialog.exec() != QDialog.DialogCode.Accepted:
            return
        try:
            data = dict(record)
            for key in tuple(data):
                if key.startswith("__") or key.startswith("_sync"):
                    data.pop(key, None)
            data.update(self._note_payload(dialog, record["__id"]))
            self.database.upsert_record(
                "annotation",
                record["__id"],
                data,
                sync_status=(
                    "pending_create"
                    if record.get("_sync_status") == "pending_create"
                    else "pending_update"
                ),
            )
        except (OSError, ValueError) as error:
            QMessageBox.critical(self, "Could not edit note", str(error))
            return
        self.refresh()

    def _create_post(self):
        dialog = TimelineEntryDialog(
            title="Add post",
            parent=self,
        )
        if dialog.exec() != QDialog.DialogCode.Accepted:
            return
        record_id = str(uuid.uuid4())
        data = {
            "postid": record_id,
            "text": dialog.body.toPlainText(),
            "regardingobjectid": self.record_id,
            "_regardingobjectid_value": self.record_id,
            (
                "_regardingobjectid_value@"
                "Microsoft.Dynamics.CRM.lookuplogicalname"
            ): self.parent_entity,
            "createdon": datetime.now(timezone.utc).isoformat(),
        }
        self.database.upsert_record(
            "post",
            record_id,
            data,
            sync_status="pending_create",
        )
        self.refresh()

    def _open_record(self, record):
        entity_name = record["__entity"]
        if entity_name == "annotation":
            self._edit_note(record)
        elif self.open_form_callback:
            self.open_form_callback(entity_name, record["__id"])

    def _delete_record(self, record):
        if QMessageBox.question(
            self,
            "Delete Timeline record",
            "Delete this record from the offline Timeline?",
        ) != QMessageBox.StandardButton.Yes:
            return
        self.database.queue_delete(
            record["__entity"],
            record["__id"],
        )
        self.refresh()

    def _set_pin(self, record, pinned):
        try:
            self.database.set_timeline_pin(
                self.timeline_id,
                record["__entity"],
                str(record["__id"]),
                pinned,
            )
        except ValueError as error:
            QMessageBox.warning(self, "Pin limit", str(error))
            return
        self.refresh()

    def _transition_activity(self, record, action):
        target_entity = record.get("__activity_type")
        if target_entity not in ENTITY_NAMES:
            target_entity = "activitypointer"
        current = self.database.get_record(
            target_entity,
            record["__id"],
        )
        if current is None:
            current = {
                key: value
                for key, value in record.items()
                if not key.startswith("__") and not key.startswith("_sync")
            }
        current["statecode"] = 1 if action == "complete" else 2
        self.database.upsert_record(
            target_entity,
            record["__id"],
            current,
            sync_status="pending_update",
        )
        self.database.queue_timeline_action(
            self.timeline_id,
            target_entity,
            record["__id"],
            action,
            {"statecode": current["statecode"]},
        )
        self.refresh()

    def _open_attachment(self, record):
        body = record.get("documentbody")
        if not body:
            return
        file_name = os.path.basename(
            record.get("filename") or "attachment.bin"
        )
        path = os.path.join(tempfile.gettempdir(), file_name)
        try:
            with open(path, "wb") as output:
                output.write(base64.b64decode(body))
            if os.name == "nt":
                os.startfile(path)
            else:
                import webbrowser
                webbrowser.open(f"file://{path}")
        except (OSError, ValueError) as error:
            QMessageBox.critical(
                self,
                "Could not open attachment",
                str(error),
            )
