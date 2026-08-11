from app.services.LLM.groq_client import call_groq, parse_json_response

SUMMARY_PROMPT = """You are a contract analysis assistant. Summarize the contract below for someone who needs the key points without reading the whole document.

Use the structured fields already extracted (if provided) to ground your dates/parties, but derive obligations, payment terms, and risks by reading the contract text itself.

Respond with ONLY a valid JSON object, no markdown, no explanation, exactly this structure:
{{
  "overview": "2-3 sentence plain-English summary of what this contract is",
  "key_obligations": ["obligation 1", "obligation 2", ...],
  "payment_terms": "plain-English description of payment terms, or 'Not specified' if none found",
  "important_dates": [{{"label": "e.g. Renewal deadline", "date": "YYYY-MM-DD or description"}}],
  "risks_flagged": ["e.g. No indemnification clause found", "e.g. Unlimited liability for Party A"]
}}

If something can't be determined, use an empty array or "Not specified" -- do not invent information.

ALREADY-EXTRACTED FIELDS:
{extracted_fields}

CONTRACT TEXT:
{contract_text}
"""


def generate_summary_content(contract_text: str, extracted_fields_json: str) -> dict:
    """
    Calls Groq to produce a structured summary. Truncates contract_text the
    same way your extraction service does (15000 chars) -- Llama 3.3's
    context window comfortably fits this, and legal contracts rarely
    exceed it in practice.
    """
    truncated_text = contract_text[:15000]
    prompt = SUMMARY_PROMPT.format(
        extracted_fields=extracted_fields_json,
        contract_text=truncated_text,
    )
    raw = call_groq(prompt, temperature=0)
    return parse_json_response(raw)