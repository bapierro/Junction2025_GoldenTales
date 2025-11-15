from __future__ import annotations

import textwrap
from pathlib import Path
from typing import Optional

import httpx

from ..config import get_settings


ELEVENLABS_STT_ENDPOINT = "https://api.elevenlabs.io/v1/speech-to-text"
ELEVENLABS_TTS_ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech"
ELEVENLABS_CONVERSATION_TOKEN_ENDPOINT = "https://api.elevenlabs.io/v1/convai/conversation/token"


class ElevenLabsService:
    """Thin async wrapper around ElevenLabs APIs with graceful fallbacks."""

    def __init__(self, api_key: str, voice_id: Optional[str] = None):
        self.api_key = api_key
        self.voice_id = voice_id

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    async def transcribe_audio(self, audio_path: Path) -> dict:
        if not self.enabled:
            simulated_text = self._simulate_transcription(audio_path)
            return simulated_text

        headers = {"xi-api-key": self.api_key}
        async with httpx.AsyncClient(timeout=60) as client:
            with audio_path.open("rb") as payload:
                files = {"file": (audio_path.name, payload, "application/octet-stream")}
                response = await client.post(ELEVENLABS_STT_ENDPOINT, headers=headers, files=files)
                response.raise_for_status()
                data = response.json()
        # expected keys differ depending on version; normalize
        transcript = data.get("text") or data.get("transcript") or ""
        cleaned = transcript.strip()
        return self._build_transcription_payload(cleaned)

    async def synthesize_text(self, text: str) -> bytes:
        if not self.enabled or not self.voice_id:
            return text.encode("utf-8")
        headers = {"xi-api-key": self.api_key, "Content-Type": "application/json"}
        payload = {"text": text, "voice_settings": {"stability": 0.4, "similarity_boost": 0.8}}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{ELEVENLABS_TTS_ENDPOINT}/{self.voice_id}", headers=headers, json=payload)
            response.raise_for_status()
            return response.content

    async def create_conversation_token(self, agent_id: str) -> str:
        if not agent_id:
            raise ValueError("Agent ID is required to create a conversation token.")
        if not self.enabled:
            return f"dev-token-{agent_id}"
        headers = {"xi-api-key": self.api_key}
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{ELEVENLABS_CONVERSATION_TOKEN_ENDPOINT}?agent_id={agent_id}",
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
        token = data.get("token")
        if not token:
            raise RuntimeError("Conversation token not present in ElevenLabs response.")
        return token

    @staticmethod
    def _simulate_transcription(audio_path: Path) -> dict:
        placeholder = f"Transcribed story from {audio_path.name}".strip()
        return ElevenLabsService._build_transcription_payload(placeholder)

    @staticmethod
    def _build_transcription_payload(text: str) -> dict:
        cleaned = text or "Untitled story"
        title = cleaned.split(".")[0][:80] or "Untitled Story"
        abstract = textwrap.shorten(cleaned, width=160, placeholder="...")
        return {
            "text": cleaned,
            "raw_transcript": cleaned,
            "title": title.strip() or "Untitled Story",
            "abstract": abstract,
        }


def get_elevenlabs_service() -> ElevenLabsService:
    settings = get_settings()
    return ElevenLabsService(settings.elevenlabs_api_key, settings.elevenlabs_voice_id or None)
