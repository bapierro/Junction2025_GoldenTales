from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..config import get_settings
from ..services.elevenlabs import get_elevenlabs_service

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("/token")
async def create_conversation_token(service=Depends(get_elevenlabs_service)) -> dict:
    settings = get_settings()
    if not settings.elevenlabs_agent_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="STORYCIRCLE_ELEVENLABS_AGENT_ID is not configured.",
        )
    token = await service.create_conversation_token(settings.elevenlabs_agent_id)
    return {"token": token}
