from __future__ import annotations

import json
from io import BytesIO

from fastapi import status


def _create_story(client, tags=None):
    tags = tags or []
    files = {"audio": ("story.webm", BytesIO(b"fake audio"), "audio/webm")}
    data = {"age_range": "70-79", "city": "Helsinki", "tags": json.dumps(tags)}
    response = client.post("/stories", files=files, data=data)
    assert response.status_code == status.HTTP_201_CREATED
    return response.json()


def test_story_lifecycle_and_reactions(client):
    story = _create_story(client, tags=["Love", "City Life"])
    story_id = story["id"]

    transcribe = client.post(f"/stories/{story_id}/transcribe")
    assert transcribe.status_code == status.HTTP_200_OK
    assert "Transcribed story" in transcribe.json()["text"]

    update_payload = {
        "visibility": "public_anon",
        "tags": ["Love", "City Life"],
        "title": "Love on the Tram",
        "text": "Full transcript",
        "consent_choice": "public",
    }
    updated = client.put(f"/stories/{story_id}", json=update_payload)
    assert updated.status_code == status.HTTP_200_OK
    assert updated.json()["visibility"] == "public_anon"

    public_feed = client.get("/stories/public")
    assert any(item["id"] == story_id for item in public_feed.json())

    reaction = client.post(
        f"/stories/{story_id}/react",
        json={"type": "heart", "client_token": "listener"},
    )
    assert reaction.status_code == status.HTTP_200_OK
    assert reaction.json()["reactions"]["heart"] == 1

    duplicate = client.post(
        f"/stories/{story_id}/react",
        json={"type": "heart", "client_token": "listener"},
    )
    assert duplicate.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    report = client.post(
        f"/stories/{story_id}/report",
        json={"reason": "inaccurate", "client_token": "reporter"},
    )
    assert report.status_code == status.HTTP_202_ACCEPTED

    similar = client.get(f"/stories/{story_id}/similar")
    assert similar.status_code == status.HTTP_200_OK


def test_story_visibility_requires_token(client):
    story = _create_story(client)
    story_id = story["id"]
    share_token = story["share_token"]

    forbidden = client.get(f"/stories/{story_id}")
    assert forbidden.status_code == status.HTTP_403_FORBIDDEN

    allowed = client.get(f"/stories/{story_id}", params={"token": share_token})
    assert allowed.status_code == status.HTTP_200_OK


def test_admin_report_flow(client):
    story = _create_story(client, tags=["Migration"])
    story_id = story["id"]
    client.post(f"/stories/{story_id}/report", json={"reason": "flag", "client_token": "reporter"})

    reports = client.get("/admin/reports", headers={"x-admin-token": "test-admin"})
    assert reports.status_code == status.HTTP_200_OK
    report_items = reports.json()
    assert len(report_items) == 1

    report_id = report_items[0]["id"]
    mark_handled = client.patch(
        f"/admin/reports/{report_id}", headers={"x-admin-token": "test-admin"}
    )
    assert mark_handled.status_code == status.HTTP_200_OK
    assert mark_handled.json()["handled"] is True

    remove_story = client.delete(
        f"/admin/stories/{story_id}", headers={"x-admin-token": "test-admin"}
    )
    assert remove_story.status_code == status.HTTP_204_NO_CONTENT


def test_conversation_token_endpoint(client):
    response = client.post("/conversations/token")
    assert response.status_code == status.HTTP_200_OK
    payload = response.json()
    assert "token" in payload
    assert payload["token"].startswith("dev-token-agent_test")
