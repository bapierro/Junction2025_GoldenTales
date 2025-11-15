from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

from .config import get_settings


_settings = get_settings()
connect_args = {}
if _settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

db_engine = create_engine(_settings.database_url, connect_args=connect_args)


def init_db() -> None:
    SQLModel.metadata.create_all(db_engine)


@contextmanager
def session_scope() -> Iterator[Session]:
    session = Session(db_engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session() -> Iterator[Session]:
    with Session(db_engine) as session:
        yield session
