"""
MongoDB document serializers for API responses.
"""

from datetime import datetime
from typing import Any, Dict, Optional


def _format_datetime(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def serialize_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a MongoDB user document to API response shape."""
    if not user:
        return user

    doc = dict(user)
    doc.pop("password_hash", None)

    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    elif "id" in doc:
        doc["id"] = str(doc["id"])

    doc["created_at"] = _format_datetime(doc.get("created_at"))
    doc["updated_at"] = _format_datetime(doc.get("updated_at"))
    doc["last_login"] = _format_datetime(doc.get("last_login"))

    return doc
