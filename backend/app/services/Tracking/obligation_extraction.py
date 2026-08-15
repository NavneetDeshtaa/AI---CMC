from app.services.LLM.groq_client import call_groq, parse_json_response

OBLIGATION_PROMPT = """You are a contract analyst extracting trackable deadlines from a contract.

Find TWO kinds of items:
1. "renewal" -- when/how this contract renews or must be renewed, including any required notice period before that happens
2. "obligation" -- specific recurring or one-time deadlines either party must meet (e.g. quarterly reports, annual insurance certificates, milestone deliverables)

Only include items with a CONCRETE date you can determine or reasonably calculate from the contract text and the known dates below. Skip vague obligations with no derivable date (e.g. "reasonable efforts" with no deadline) -- a tracker needs real dates, not vague reminders.

KNOWN CONTRACT DATES:
- Effective date: {effective_date}
- Expiry date: {expiry_date}
- Renewal terms (free text, from extraction): {renewal_terms}

Respond with ONLY a valid JSON object, no markdown, no explanation, exactly this structure:
{{
  "items": [
    {{
      "item_type": "renewal or obligation",
      "title": "short title, e.g. 'Contract Renewal' or 'Quarterly Performance Report'",
      "description": "1-2 sentence plain-English description",
      "due_date": "YYYY-MM-DD",
      "notice_period_days": <number of days notice required before due_date, or null if not applicable>
    }}
  ]
}}

If genuinely nothing qualifies (no renewal terms, no dated obligations found), return {{"items": []}}.

CONTRACT TEXT:
{contract_text}
"""


def extract_obligations(contract_text: str, effective_date, expiry_date, renewal_terms: str) -> list[dict]:
    prompt = OBLIGATION_PROMPT.format(
        effective_date=effective_date,
        expiry_date=expiry_date,
        renewal_terms=renewal_terms or "Not specified",
        contract_text=contract_text[:15000],
    )
    raw = call_groq(prompt, temperature=0)
    result = parse_json_response(raw)
    return result.get("items", [])