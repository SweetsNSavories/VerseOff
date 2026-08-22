---
name: activity-timeline
description: Research and implementation guidance for reproducing the Dataverse model-driven Activity Timeline in VerseOff.
---

# Dataverse Activity Timeline

Use this skill when changing Timeline metadata extraction, dependency
discovery, offline storage, synchronization, rendering, commands, or Client
API compatibility.

## Core principle

The model-driven Timeline is a composite first-party control. It merges:

- activities;
- notes;
- posts, comments, and likes;
- attachments;
- per-activity card forms;
- activity parties;
- filtering, search, paging, and sorting;
- rollup across related records;
- commands and privileges;
- personalization such as bookmarks and pinned records;
- optional JavaScript record sources.

Do not implement it as a plain `activitypointer` subgrid.

## Authoritative sources

- [Set up the Timeline control](https://learn.microsoft.com/power-apps/maker/model-driven-apps/set-up-timeline-control)
- [Use Timeline](https://learn.microsoft.com/power-apps/user/add-activities)
- [Timeline FAQ](https://learn.microsoft.com/power-apps/maker/model-driven-apps/faqs-timeline-control)
- [Custom Timeline record sources](https://learn.microsoft.com/power-apps/maker/model-driven-apps/custom-connectors-timeline-control)
- [Timelinewall Client API](https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/reference/controls#timelinewall-control-type)
- [ActivityPointer](https://learn.microsoft.com/power-apps/developer/data-platform/activitypointer-activity-entity)
- [Activity tables](https://learn.microsoft.com/power-apps/developer/data-platform/activity-entities)
- [ActivityParty](https://learn.microsoft.com/power-apps/developer/data-platform/activityparty-entity)
- [Custom activities](https://learn.microsoft.com/power-apps/developer/data-platform/custom-activities)
- [SystemForm reference](https://learn.microsoft.com/power-apps/developer/data-platform/reference/entities/systemform)
- [Amey Holden: Customize the activity Timeline](https://www.ameyholden.com/articles/customise-activity-timeline-control-model-driven-power-apps)

## Identifying the control

The supported runtime identity is:

```javascript
formContext.getControl(name).getControlType() === "timelinewall"
```

Exported FormXML commonly uses:

```text
classid = {06375649-C143-495E-A496-C962E5B4488E}
id      = notescontrol
```

That GUID is historically the Notes/social-pane host. Treat it as a strong
compatibility signal, not the only test. Timeline detection should combine:

1. runtime or custom-control type `timelinewall`;
2. control class ID and `notescontrol` identity;
3. `UClientUniqueName=Timeline`;
4. Timeline-shaped `UClient*` parameters;
5. Timeline custom-control descriptions.

Preserve the raw control XML and all unknown parameters. Microsoft does not
publish every modern Timeline parameter as a stable schema.

## FormXML configuration

The repository's FormXML XSD documents these parameters:

```xml
<UClientUniqueName />
<UClientModules />
<UClientDefaultModuleForCreateExperience />
<UClientShowFilterPane />
<UClientExpandFilterPane />
<UClientCreateActivityUsing />
<UClientDisplayActivityUsing />
<UClientRecordPerPage />
<UClientActivities />
<UClientOrderBy />
<UClientActivityCardMap />
<UClientDisplayActivityHeaderUsing />
<UClientSortActivitiesByValue />
<OrderByActivityWall />
<SortActivityWall />
<EmailConversationView />
```

Live Copilot Service FormXML also contains:

```text
UClientEnableWhatsNewFilter
UClientActivitiesConfigurationJSON
UClientRecordSourcesJSON
DefaultTabId
ShowArticleTab
```

Important value shapes:

- `UClientModules`: comma-separated `Activities,Notes,Posts`.
- `UClientActivities`: enabled activity logical names.
- `UClientActivityCardMap`: logical name, object type code, and optional Card
  form ID.
- `UClientActivitiesConfigurationJSON`: per-activity `canCreate`,
  `createUsing`, `openUsing`, `showStatus`, optional `showTopDate`, and card
  field display settings.
- `UClientRecordSourcesJSON`: JavaScript Timeline record-source definitions.

Example per-activity JSON:

```json
{
  "email": {
    "showStatus": true,
    "canCreate": true,
    "createUsing": "default",
    "openUsing": "default",
    "fieldsConfig": {
      "labelOverride": true,
      "header": {
        "labelOption": "Show",
        "displayOption": "AlwaysShow"
      },
      "body": [
        {
          "labelOption": "Show",
          "displayOption": "AlwaysShow"
        },
        {
          "labelOption": "Hide",
          "displayOption": "ShowOnExpand"
        }
      ],
      "footer": {
        "labelOption": "Hide",
        "displayOption": "AlwaysShow"
      }
    }
  }
}
```

## Maker settings to preserve

### General

- Enabled modules: Activities, Notes, Posts.
- Enabled individual activity types.
- Records per page: default 10, maximum 50.
- Default quick entry: Note or Post.
- Sort direction and configured date column.
- Filter pane enabled and expanded state.
- Search enabled.
- Expand-all default.
- Default filter groups.
- “What you've missed.”
- Modern Timeline feature flag.
- Timeline highlights feature flag.

### Per activity

- Enabled or hidden.
- Visible but not creatable from Timeline.
- Create form mode: default, Quick Create, Main, or Main dialog.
- Open form mode.
- Status tag shown/hidden.
- Profile/persona shown/hidden.
- Sort field.
- Card form.
- Card field label/display behavior.
- Up to five configured row commands.
- Email command order: Reply, Reply All, Forward.
- Pin/unpin availability.

### Notes

- Enabled.
- Sort by Created On or Modified On.
- Rich text editor configuration URL.
- Header/body/footer field and label settings.
- Quick save with Ctrl+S.
- Rollup type.

### Posts

- User posts enabled.
- Auto posts and simple-auto-post mode.
- Sort by Created On or Modified On.
- Header/body/footer settings.
- Commands.

## Card form rendering

`systemform.type = 11` is a Card form. Type 2 is Main, type 6 is Quick View,
and type 7 is Quick Create.

Timeline card rendering rules:

- ColorStrip does not render.
- Header may contain six fields, but only the first two render.
- Header field 1 is the bold title.
- Header field 2 appears at the bottom-right, commonly as the timestamp.
- Details may contain four fields, but only the first three render.
- Details field 1 behaves as a subheading.
- Details field 2 has a one-line collapsed summary and full expanded content.
- Details field 3 is visible when expanded.
- Footer does not render.
- Empty card fields are skipped.

The Amey Holden article emphasizes:

- disable irrelevant activity types to reduce cost and noise;
- separate “display” from “create directly from Timeline”;
- hide personas when owner initials add no value;
- configure default-card field visibility as Always, Never, or On Expand;
- select custom Card forms when default activity cards omit business fields.

## Runtime UX

The Timeline supports:

- unified activities, notes, posts, and configured custom records;
- collapsed and expanded cards;
- status tags: Active, Overdue, Closed;
- type icons and timestamps;
- paging with Load More;
- newer/older sorting;
- search across title/subject, body, and description;
- filters for record type, activity type, state, status reason, due date,
  modified date, and post author type;
- saved filters/bookmarks;
- roomy and cozy layouts;
- threaded and inline email;
- note/post rich text;
- mentions and references;
- attachment preview/download;
- card-specific commands;
- pinning up to 15 records, retained for up to one year;
- conversation transcript display;
- optional AI highlights and “What you've missed.”

Timeline does not automatically refresh after external changes. Always expose
an explicit refresh operation.

## Timeline Client API

The documented Timeline-specific Client API is intentionally small:

```javascript
const timeline = formContext.getControl("Timeline");
timeline.getControlType(); // "timelinewall"
timeline.refresh();
timeline.getDisabled();
timeline.setDisabled(true);
timeline.getLabel();
timeline.setLabel("Timeline");
timeline.getName();
timeline.getParent();
timeline.getVisible();
timeline.setVisible(true);
timeline.setFocus();
```

There are no documented Timeline record-loaded, filter-changed, or
card-command events.

## Dataverse data model

### Activities

Every activity has:

- one concrete row such as `email`, `task`, `appointment`, or a custom
  activity;
- one `activitypointer` row with the same `activityid`.

Cache common ActivityPointer fields:

```text
activityid
activitytypecode
subject
description
regardingobjectid
ownerid
statecode
statuscode
prioritycode
scheduledstart
scheduledend
actualstart
actualend
createdon
modifiedon
sortdate
durationminutes
versionnumber / ETag
```

State meanings differ by activity type. ActivityPointer has Open, Completed,
Canceled, and Scheduled, but not all concrete activities support Scheduled.
Status reason labels are also type-specific.

### Parties

Do not flatten participants into a string. Cache normalized `activityparty`
rows:

| Mask | Role |
|---:|---|
| 1 | Sender |
| 2 | To |
| 3 | CC |
| 4 | BCC |
| 5 | Required attendee |
| 6 | Optional attendee |
| 7 | Organizer |
| 8 | Regarding |
| 9 | Owner |
| 10 | Resource |
| 11 | Customer |
| 12 | Chat participant |
| 13 | Related |

Store party record/type, unresolved party name, and `addressused`.

### Notes

Cache `annotation`:

```text
annotationid
subject
notetext
objectid / objecttypecode
createdby / modifiedby / owner
createdon / modifiedon / overriddenon
isdocument
filename
mimetype
filesize
documentbody or file reference
versionnumber / ETag
```

### Attachments

Attachment models are different:

- note files: annotation document/file fields;
- MIME/email files: `activitymimeattachment`;
- modern activity files: `activityfileattachment`.

Track file name, MIME type, size, body/file storage ID, transfer status,
checksum, ETag, and parent activity/note.

### Posts

Where Posts are enabled, cache:

- `post`;
- `postcomment`;
- `postlike`;
- `postregarding`;
- author and regarding references.

Posts require a Dynamics 365-enabled environment and are disabled by default
in newer environments.

### Custom activities

A custom activity:

- has `IsActivity=true`;
- is user- or team-owned;
- uses Subject as primary column;
- inherits ActivityPointer fields, security, and all party roles;
- must be available offline;
- has Notes enabled;
- must be explicitly enabled in each Timeline instance.

## Rollup

Timeline rollup is not a simple direct-regarding query:

- None: direct parent only.
- Related: parent and direct children.
- Extended: parent and descendants.

Activity rollup is primarily an account/contact Dynamics 365 behavior. Cache
the configured rollup policy and the exact relationship graph needed to
reproduce it. Never broaden unresolved rollup locally.

## Commands

Common commands include:

- Assign;
- Close Activity;
- Add to Queue;
- Open;
- Delete;
- Reply, Reply All, Forward for email;
- Like and Reply for posts;
- Edit for notes;
- Pin/Unpin.

Timeline may display commands without evaluating every custom ribbon rule for
performance. Validate privileges, state, ownership, and command rules again
at execution time.

Email Send is not a generic state update. It requires email-specific send
semantics and should be queued as an explicit operation while offline.

## Security

Respect:

- Create, Read, Write, Delete;
- Assign and Share;
- Append on child records;
- Append To on regarding and party records;
- ownership and business-unit depth;
- teams, sharing, and hierarchy access;
- record-state restrictions.

Timeline-specific privileges:

- Read on Activity File Attachment to open those attachments.
- Create/Read/Write on Custom Control Extended Setting for Timeline
  bookmarks, remembered filters, and pinning.
- Read on transcript data for conversation transcripts.
- Notes/posts mention features require their documented table/share
  privileges.

Offline access must fail closed if the effective security snapshot is missing
or stale.

## Microsoft offline scope

Microsoft mobile offline supports **Notes only** in Timeline:

- include Note (`annotation`) as Related rows only;
- include User (`systemuser`);
- read/create notes;
- take photos;
- add/remove note attachments.

Activities, Posts, rollup, and custom record sources are not supported by
Microsoft's mobile-offline Timeline. VerseOff support for those features is
an extension and needs explicit conflict, action-queue, and security rules.

## Custom Timeline record sources

`UClientRecordSourcesJSON` points to JavaScript web resources implementing
`IRecordSource`. Timeline calls:

- `init`;
- `getRecordsData`;
- `getFilterDetails`;
- `getRecordUX`.

The source can supply paging, filters, cards, and optional actions. Microsoft
does not support custom Timeline record sources offline, on dashboards, or
outside TimelineWallControl surfaces.

For VerseOff:

- preserve and hash referenced JS/JSON resources;
- never embed tokens/secrets;
- sanitize returned HTML;
- run in a constrained Chromium profile;
- provide an explicit offline adapter or mark the source unavailable.

## Performance and known limitations

- More than 10 enabled activity types triggers a performance warning.
- More than 15 linked tables can prevent Timeline loading.
- Timeline does not automatically refresh.
- Older-to-newer Post sorting can duplicate posts.
- The attachment button adds one Note attachment at a time; inline drag/drop
  may add multiple files.
- WebP inline images do not display.
- Modern Timeline may not reproduce all legacy social-pane customizations.
- Rich text Posts require Microsoft support and a Dynamics 365-enabled
  environment.
- Card output is limited to two Header and three Details fields.
- Dashboard Timeline differs and does not support Notes.

## Accessibility and localization

Implement:

- keyboard navigation and activation;
- visible focus;
- logical focus order;
- accessible card/type/status/command names;
- expanded/collapsed state;
- loading/error/action announcements;
- high contrast;
- zoom and reflow;
- RTL;
- sanitized rich HTML.

Cache localized:

- table and activity type names;
- attribute/option/state/status labels;
- card labels and command labels;
- icon descriptions;
- relative-time/plural strings;
- locale, date/number formats, time zone, RTL, and high-contrast settings.

## VerseOff implementation contract

### 1. Parse

Create a `TimelineDefinition` containing:

- control ID/class/custom-control identity;
- raw control XML;
- all raw parameters;
- enabled modules and activities;
- paging, search, filter, sort, and expansion settings;
- activity configuration JSON;
- card map;
- custom record sources;
- rollup settings;
- note/post settings.

### 2. Expand manifest dependencies

Include:

- `activitypointer`;
- every enabled concrete/custom activity;
- `activityparty`;
- `annotation`;
- `activitymimeattachment`;
- `activityfileattachment`;
- Posts tables when enabled;
- users, teams, queues, and referenced display records;
- type-11 Card forms;
- web resources referenced by custom record sources and rich text config.

Dependency discovery must remain transitive and bounded.

### 3. Store

Use normalized tables for:

- Timeline definitions;
- activities;
- parties;
- notes/posts/comments/likes;
- attachments and transfer chunks;
- rollup edges;
- security decisions;
- bookmarks/pins/preferences;
- paging and change tokens;
- pending actions and conflicts.

Use SQLite FTS over sanitized visible text for subject/body/description search.

### 4. Synchronize

Implement:

- paged pull and change tracking;
- tombstones and ETags;
- party/activity/attachment dependency ordering;
- temporary ID remapping;
- streaming binary transfers;
- queued complete/cancel/assign/share/send/pin actions;
- conflict handling;
- Timeline invalidation after local or remote changes.

### 5. Render

Build a dedicated Timeline widget, not a generic subgrid:

- virtualized card list;
- paging/Load More;
- collapsed/expanded cards;
- configured Card-form projection;
- type/status/persona/timestamp;
- search/filter/sort;
- note quick entry and attachments;
- activity creation choices;
- contextual commands;
- explicit refresh;
- safe empty/unsupported states.

### 6. Client API

Expose control type `timelinewall` and `refresh()` through both the Python
form-context object and Chromium/V8 bridge.

### 7. Delivery order

1. Detection and raw metadata preservation.
2. Card-form and dependency extraction.
3. Read-only Timeline cards.
4. Notes and attachments, matching Microsoft's offline scope.
5. Search, filters, paging, bookmarks, and pinning.
6. Activities, parties, and explicit action queue.
7. Posts and rollup.
8. Custom JavaScript record sources.
9. Security, localization, accessibility, and conflict tests.

## Pitfalls

- Do not treat Timeline as an activitypointer subgrid.
- Do not infer Timeline from one class ID only.
- Do not fetch only Main/Quick View forms; Card forms are type 11.
- Do not flatten PartyList.
- Do not expose activities when relationship or security evaluation fails.
- Do not return fake success for server-only commands.
- Do not assume Timeline auto-refreshes.
- Do not discard unknown FormXML parameters.
- Do not execute unsanitized custom record-source HTML.
