from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .routers import admin, stories, conversations
from .services.storage import ensure_storage_root


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="StoryCircle Backend", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def _startup() -> None:
        init_db()
        ensure_storage_root()

    app.include_router(stories.router)
    app.include_router(conversations.router)
    app.include_router(admin.router)

    @app.get("/")
    def health() -> dict:
        return {"status": "ok", "base_url": settings.base_url}

    return app


app = create_app()
