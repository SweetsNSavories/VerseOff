import logging
import math
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class AuditAnalyzer:
    def __init__(self, dataverse_url: str, auth_token: str):
        import requests
        self.org_url = dataverse_url.rstrip("/")
        self.base_url = self.org_url + "/api/data/v9.2"
        self.headers = {
            "Authorization": f"Bearer {auth_token}",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0"
        }
        self.requests = requests

    def fetch_audit_events(self, lookback_days=90):
        """
        Fetches Read (4) and Update (2) events from the audits entity
        for the past `lookback_days` days.
        """
        now = datetime.now(timezone.utc)
        start_date = (now.timestamp() - (lookback_days * 86400))
        start_date_iso = datetime.fromtimestamp(start_date, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # We query the 'audits' endpoint.
        # Requires prvReadAuditSummary privilege
        url = f"{self.base_url}/audits"
        params = {
            "$select": "_objectid_value,objecttypecode,operation,_userid_value,createdon",
            "$filter": f"(operation eq 4 or operation eq 2) and createdon ge {start_date_iso}",
            "$orderby": "createdon desc",
            "$top": 5000  # limit to top 5000 for safety in MVP
        }
        
        try:
            resp = self.requests.get(url, headers=self.headers, params=params, timeout=30)
            if resp.status_code == 403:
                logger.warning("User lacks prvReadAuditSummary privilege. Cannot use Audit telemetry.")
                return []
            resp.raise_for_status()
            return resp.json().get("value", [])
        except Exception as e:
            logger.error(f"Failed to fetch audit telemetry: {e}")
            return []


class AppInsightsAnalyzer:
    """
    Placeholder for querying App Insights 'pageViews' table via Azure Monitor REST API.
    Requires separate Azure Identity authentication scoped to App Insights.
    """
    def __init__(self, app_id: str, azure_token: str):
        self.app_id = app_id
        self.token = azure_token
        
    def fetch_page_views(self, lookback_days=90):
        # Implementation for KQL execution
        logger.info("App Insights telemetry not yet implemented in MVP.")
        return []


class CacheManifestBuilder:
    def __init__(self, current_user_id: str, lookback_days=90):
        self.current_user_id = current_user_id.lower() if current_user_id else ""
        self.lookback_days = lookback_days
        self.half_life = 7.0  # days

    def build_manifest(self, audit_events):
        """
        Produces a dict: { entity_name: [{"id": record_id, "priority": score}, ...] }
        sorted by score descending.
        """
        scores = {}
        now = datetime.now(timezone.utc)
        
        for event in audit_events:
            entity = event.get("objecttypecode")
            record_id = event.get("_objectid_value")
            user_id = event.get("_userid_value", "").lower()
            operation = event.get("operation")
            
            # Parsing date format: 2023-01-01T12:00:00Z
            created_str = event.get("createdon")
            if not entity or not record_id or not created_str:
                continue
                
            try:
                # remove Z and parse
                created_str = created_str.replace("Z", "+00:00")
                created = datetime.fromisoformat(created_str)
            except Exception:
                continue
            
            days_ago = (now - created).total_seconds() / 86400
            
            # Apply decay formula
            time_decay = math.exp(-0.693 * days_ago / self.half_life)
            
            # Weight modifiers
            user_weight = 3.0 if user_id == self.current_user_id else 1.0
            op_weight = 1.5 if operation == 2 else 1.0  # updates are stronger signal than reads
            
            key = (entity, record_id)
            scores[key] = scores.get(key, 0) + (time_decay * user_weight * op_weight)
            
        # Format into manifest
        by_entity = {}
        for (entity, record_id), score in scores.items():
            by_entity.setdefault(entity, []).append({"id": record_id, "priority": round(score, 4)})
            
        # Sort each entity's list
        for entity in by_entity:
            by_entity[entity] = sorted(by_entity[entity], key=lambda x: x["priority"], reverse=True)
            
        return {
            "cache_manifest": by_entity,
            "manifest_generated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "lookback_days": self.lookback_days,
            "user_id": self.current_user_id
        }
