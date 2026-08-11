from app.services.LLM.groq_client import call_groq, parse_json_response

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
    """
    Extracts structured fields (parties, dates, value, clauses, etc.) from
    contract text via the LLM. This function's job is document
    understanding -- it just happens to delegate the actual API call to
    the shared groq_client, same as every other feature that needs an
    LLM call does.
    """
    truncated_text = contract_text[:15000]
    prompt = EXTRACTION_PROMPT.format(contract_text=truncated_text)
    raw_content = call_groq(prompt, temperature=0)
    return parse_json_response(raw_content)