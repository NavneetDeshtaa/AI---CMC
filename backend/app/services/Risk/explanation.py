from typing import List, Dict
from app.services.LLM.groq_client import call_groq

EXPLANATION_PROMPT = """You are a contract risk analyst writing a brief summary for a business user (not a lawyer).

Given the risk score and specific findings below, write a 2-4 sentence plain-English explanation of the contract's overall risk profile. Mention the most important 1-2 issues specifically. Be direct, not alarmist -- this is meant to help someone quickly understand what to look into, not to scare them.

RISK SCORE: {risk_score}/100 ({risk_level})

FLAGGED CLAUSES (present but risky):
{flagged}

MISSING CLAUSES (absent entirely):
{missing}

Write only the explanation text, no headers, no markdown, no JSON.
"""


def generate_explanation(risk_score: int, risk_level: str, flagged_clauses: List[Dict], missing_clauses: List[Dict]) -> str:
    if not flagged_clauses and not missing_clauses:
        return "No significant risk factors were identified against the baseline policy standards."

    flagged_text = "\n".join(f"- {c['clause']}: {c['issue']}" for c in flagged_clauses) or "None"
    missing_text = "\n".join(f"- {c['clause']}: {c['why_it_matters']}" for c in missing_clauses) or "None"

    prompt = EXPLANATION_PROMPT.format(
        risk_score=risk_score, risk_level=risk_level, flagged=flagged_text, missing=missing_text
    )
    return call_groq(prompt, temperature=0.3)  # slight creativity for more natural prose, still low