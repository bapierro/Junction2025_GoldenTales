from __future__ import annotations

from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from ..config import get_settings
from ..database import get_session
from ..main import create_app


@pytest.fixture(scope="session")
def engine() -> Generator:
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield test_engine


@pytest.fixture()
def client(tmp_path, engine) -> Generator[TestClient, None, None]:
    SQLModel.metadata.create_all(engine)

    # Re-wire global engine used by the app
    from .. import database  # local import to avoid circular import

    database.db_engine = engine

    settings = get_settings()
    settings.storage_dir = Path(tmp_path) / "audio"
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    settings.admin_token = "test-admin"
    settings.elevenlabs_agent_id = "agent_test"

    app = create_app()

    # override session dependency to reuse the same engine per test
    def _get_session_override():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = _get_session_override

    with TestClient(app) as test_client:
        yield test_client

    SQLModel.metadata.drop_all(engine)
