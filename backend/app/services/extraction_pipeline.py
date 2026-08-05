import json
import requests
from app.core.config import settings

GROK_API_URL = "https://api.x.ai/v1/chat/completions"

EXTRACTION_PROMPT = """You are a contract analysis assistant. Extract the following fields from the contract text below.
Respond with ONLY a valid JSON object, no markdown formatting, no explanation, matching exactly this structure:

{{
  "parties": ["Party A", "Party B"],
  "effective_date": "YYYY-MM-DD or null",
  "expiry_date": "YYYY-MM-DD or null",
  "value": <number or null>,
  "currency": "3-letter code or null",
  "governing_law": "jurisdiction or null",
  "renewal_terms": "brief description or null",
  "key_clauses": ["Clause name 1", "Clause name 2"]
}}

If a field cannot be determined from the text, use null (or empty array for parties/key_clauses).
Do not invent information that isn't in the contract text.

CONTRACT TEXT:
{contract_text}
"""


def call_grok_extraction(contract_text: str) -> dict:
    truncated_text = contract_text[:15000]  # keep prompt within reasonable token bounds

    response = requests.post(
        GROK_API_URL,
        headers={
            "Authorization": f"Bearer {settings.grok_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "grok-4-fast",
            "messages": [
                {
                    "role": "user",
                    "content": EXTRACTION_PROMPT.format(contract_text=truncated_text),
                }
            ],
            "temperature": 0,
        },
        timeout=60,
    )
    response.raise_for_status()
    raw_content = response.json()["choices"][0]["message"]["content"]

    # Strip markdown code fences if the model adds them despite instructions
    cleaned = raw_content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    return json.loads(cleaned)