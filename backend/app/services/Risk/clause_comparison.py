from typing import List, Dict
from app.services.LLM.groq_client import call_groq, parse_json_response

COMPARISON_PROMPT = """You are a contract risk analyst. Compare the contract text below against a list of baseline clause standards.

For each standard, determine:
- Is this clause present in the contract at all?
- If present, does it meet the standard described, or does it deviate in a risky way (e.g. a Limitation of Liability clause exists but liability is actually unlimited)?

Respond with ONLY a valid JSON object, no markdown, no explanation, exactly this structure:
{{
  "flagged_clauses": [
    {{"clause": "exact clause_name from the list below", "issue": "specific description of what's wrong", "severity": "high, medium, or low"}}
  ],
  "missing_clauses": [
    {{"clause": "exact clause_name from the list below", "why_it_matters": "brief plain-English consequence of not having this"}}
  ]
}}

A clause should appear in EITHER flagged_clauses (present but risky) OR missing_clauses (absent entirely) OR neither (present and acceptable) -- never both.
Only include actual issues. If a clause is present and meets the standard, don't mention it at all.

BASELINE STANDARDS:
{policy_rules}

CONTRACT TEXT:
{contract_text}
"""


def compare_against_policy(contract_text: str, policy_rules: List[Dict]) -> dict:
    """
    Runs the contract text against every active policy rule in one LLM
    call (rather than one call per rule) -- cheaper, faster, and lets the
    model reason about clauses in relation to each other.
    """
    rules_text = "\n".join(
        f"- {r['clause_name']} (required: {r['is_required']}): {r['description']}"
        for r in policy_rules
    )
    truncated_text = contract_text[:15000]
    prompt = COMPARISON_PROMPT.format(policy_rules=rules_text, contract_text=truncated_text)
    raw = call_groq(prompt, temperature=0)
    return parse_json_response(raw)