import json
import requests
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


def call_groq(prompt: str, temperature: float = 0, timeout: int = 60) -> str:
    """
    Generic Groq chat completion call. Same request pattern as your Phase 1
    extraction service (call_groq_extraction) -- pulled out here so every
    Phase 2+ feature that needs an LLM call (query routing, RAG answer
    generation, and the summarizer in Step 4) shares one client instead of
    each service reimplementing the requests.post() boilerplate.
    """
    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
        },
        timeout=timeout,
    )

    if not response.ok:
        print(f"Groq API error {response.status_code}: {response.text}")
    response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"].strip()


def parse_json_response(raw_content: str) -> dict:
    """
    Strips markdown code fences if the model wraps its JSON in ```json ... ```
    (same cleanup logic as your extraction service), then parses it.
    """
    cleaned = raw_content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    return json.loads(cleaned)