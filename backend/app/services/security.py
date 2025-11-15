from __future__ import annotations

import hashlib
import secrets
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status

from ..config import get_settings


settings = get_settings()


def make_share_token() -> str:
    return secrets.token_urlsafe(16)


def hash_client_token(token: Optional[str]) -> str:
    value = token or "anonymous"
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def ensure_admin(token: Optional[str]) -> None:
    if not settings.admin_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin features are disabled until STORYCIRCLE_ADMIN_TOKEN is set.",
        )
    if token != settings.admin_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")


def record_consent(choice: Optional[str]) -> Optional[datetime]:
    return datetime.utcnow() if choice else None
