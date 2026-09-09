# VerseOff Gateway REST API

The Gateway exposes the local read plane and customized metadata at
`/api/v1`. HTTPS and an authenticated Windows/Entra identity are required for
all endpoints except `/health/live`.

The machine-readable contract is [openapi.yaml](./openapi.yaml).

## Read metadata

```http
GET /api/v1/metadata
GET /api/v1/metadata/{entity}
GET /api/v1/metadata/{entity}/forms
GET /api/v1/metadata/{entity}/grids
```

Metadata responses include custom fields and form/grid definitions after the
active customization layer has been applied.

## Load an app package

```http
POST /api/v1/apps/load-offline-package
GET  /api/v1/apps/status
```

`load-offline-package` accepts `{ "packagePath": "C:\\path\\to\\package" }`.
The directory must contain a valid `app.json`; loading replaces the active
baseline metadata. `status` reports whether a baseline is currently loaded.

## Manage customizations

```http
POST   /api/v1/customizations/forms
GET    /api/v1/customizations/forms/{entityLogicalName}
GET    /api/v1/customizations/forms/{entityLogicalName}/{formId}
DELETE /api/v1/customizations/forms/{entityLogicalName}/{formId}
POST   /api/v1/customizations/fields
GET    /api/v1/customizations/fields/{entityLogicalName}
POST   /api/v1/customizations/handlers
GET    /api/v1/customizations/handlers/{entityLogicalName}/{eventHook}
DELETE /api/v1/customizations/handlers/{entityLogicalName}/{eventHook}/{handlerName}
GET    /api/v1/customizations/export
POST   /api/v1/customizations/import
POST   /api/v1/customizations/validate
```

Customization request and response bodies are JSON DTOs defined by the
customization layer. Export returns the persisted customization document;
import replaces or merges it according to the request's import options.

## Read records

```http
GET /api/v1/data/{entity}
GET /api/v1/data/{entity}/{id}
GET /api/v1/data/{entity}/{id}/{relationship}
GET /api/v1/data/{entity}/views/{viewId}
```

Collection endpoints support:

| Parameter | Meaning | Example |
| --- | --- | --- |
| `$select` | Comma-separated fields for a single record | `$select=name,statuscode` |
| `$filter` | URL-encoded JSON `QueryFilter` | `{"fieldName":"statecode","operator":"Equals","value":"0"}` |
| `$orderby` | Comma-separated fields; use `:desc` for descending order | `name,createdon:desc` |
| `$top` | Page size, default 50 and capped by the service | `50` |
| `$pageNumber` | One-based page number | `2` |

Example:

```http
GET /api/v1/data/account?$select=name,statuscode&$filter=%7B%22fieldName%22%3A%22statecode%22%2C%22operator%22%3A%22Equals%22%2C%22value%22%3A%220%22%7D&$orderby=name&$pageNumber=1&$top=50
```

Collection responses contain `entityLogicalName`, `records`,
`pageNumber`, `pageSize`, `totalRecordCount`, `totalPageCount`, and
`hasMoreRecords`. The service also returns `X-Total-Count`,
`X-Page-Number`, and `X-Page-Size` headers.

## Operational endpoints

```http
GET  /health/live
GET  /api/v1/session
POST /api/v1/apps/load-offline-package
GET  /api/v1/apps/status
POST /api/v1/sync/changes
POST /api/v1/sync/operations
POST /api/v1/entitlements
POST /api/v1/mail/inbox/delta
```

The synchronization, entitlement, mail, and package-loading endpoints enforce
their respective authorization and availability policies. They must not be
used as a substitute for the read-plane endpoints.

## Errors

Errors use RFC 7807-style problem responses where the endpoint is hosted by
minimal APIs. Data endpoints return an error object with `message` and `code`
for invalid entities, records, and arguments. Clients should branch on HTTP
status and not on localized error text.
