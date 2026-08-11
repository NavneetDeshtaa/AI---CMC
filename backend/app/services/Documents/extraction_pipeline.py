import json
import requests
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

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


def call_groq_extraction(contract_text: str) -> dict:
    truncated_text = contract_text[:15000]

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "llama-3.3-70b-versatile",
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

    if not response.ok:
        print(f"Groq API error {response.status_code}: {response.text}")

    response.raise_for_status()
    raw_content = response.json()["choices"][0]["message"]["content"]

    cleaned = raw_content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    return json.loads(cleaned)