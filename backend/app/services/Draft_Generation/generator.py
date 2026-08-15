from app.services.LLM.groq_client import call_groq

DRAFT_PROMPT = """You are a contract drafting assistant. Write a complete, professional contract based on the details below.

CONTRACT TYPE: {contract_type}
TEMPLATE NAME: {template_name}
DRAFTING GUIDANCE: {generation_instructions}

REQUIRED CLAUSES, IN ORDER:
{clause_outline}

DEAL DETAILS:
- Party A (our company): {our_company_name}
- Party B (customer): {customer_name}
- Contract value: {value} {currency}
- Effective date: {effective_date}
- Expiry date: {expiry_date}
- Governing law / jurisdiction: {jurisdiction}
{additional_instructions_line}

Write the full contract text, with clearly labeled numbered sections for each required clause, in professional but readable legal language. Fill in every clause with specific content tailored to the deal details above -- do NOT use placeholder brackets like [INSERT X]. Adapt the Limitation of Liability and Payment Terms clauses to be reasonable given the contract value. Adapt terminology and notice periods to fit the specified jurisdiction where relevant.

Output only the contract text itself -- no preamble, no markdown # headers, use plain numbered sections (e.g. "1. Parties").
"""


def generate_draft_text(template, inputs: dict) -> str:
    """
    Generates full contract text from a template + specific deal inputs.
    Uses a higher temperature (0.4) than your extraction/summarization
    calls -- those need to be precise and repeatable, but drafting is
    genuinely generative writing where some natural variation in phrasing
    is fine and even desirable (a contract that reads identically every
    time, word for word, would look suspicious to a real reviewer).
    """
    clause_outline_text = "\n".join(f"- {c}" for c in template.clause_outline)
    additional_line = (
        f"- Additional instructions: {inputs['additional_instructions']}"
        if inputs.get("additional_instructions") else ""
    )

    prompt = DRAFT_PROMPT.format(
        contract_type=template.contract_type,
        template_name=template.name,
        generation_instructions=template.generation_instructions or "None specified",
        clause_outline=clause_outline_text,
        our_company_name=inputs["our_company_name"],
        customer_name=inputs["customer_name"],
        value=inputs["value"] if inputs["value"] is not None else "Not specified",
        currency=inputs["currency"],
        effective_date=inputs["effective_date"],
        expiry_date=inputs["expiry_date"],
        jurisdiction=inputs["jurisdiction"],
        additional_instructions_line=additional_line,
    )
    # Longer timeout than other calls -- a full contract is a much longer
    # generation than a JSON extraction or a short answer.
    return call_groq(prompt, temperature=0.4, timeout=90)