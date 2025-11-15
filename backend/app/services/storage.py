from __future__ import annotations

import secrets
from pathlib import Path

from fastapi import UploadFile

from ..config import get_settings


settings = get_settings()


def ensure_storage_root() -> Path:
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    return settings.storage_dir


def save_audio_file(file: UploadFile) -> str:
    ensure_storage_root()
    suffix = Path(file.filename or "story.webm").suffix or ".webm"
    filename = f"story_{secrets.token_hex(8)}{suffix}"
    destination = settings.storage_dir / filename
    with destination.open("wb") as buffer:
        while chunk := file.file.read(1024 * 1024):
            buffer.write(chunk)
    return filename


def resolve_audio_path(filename: str) -> Path:
    return settings.storage_dir / filename
