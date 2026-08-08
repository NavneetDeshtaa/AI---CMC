from typing import List

from app.services.groq_client import call_groq

ANSWER_PROMPT = """You are a contract analysis assistant. Answer the user's question using ONLY the contract excerpts provided below.

Rules:
- Cite which contract each piece of information comes from by file name.
- If the excerpts don't contain enough information to answer, say so plainly -- do not guess or invent details.
- Be concise and direct.

CONTRACT EXCERPTS:
{context}

USER QUESTION: {query}
"""


def generate_answer(query: str, chunks: List[dict], contracts: List[dict]) -> str:
    """
    Builds a context block from retrieved chunks and asks the LLM to answer
    the query using only that context, with citations back to file names.

    If there are no chunks at all (a pure metadata query like "contracts
    expiring next month" -- no semantic component), skips the LLM call
    entirely and returns a plain formatted list. No need to spend an API
    call summarizing something that's already just a list of names.
    """
    if not chunks and not contracts:
        return "No matching contracts found."

    if not chunks:
        names = ", ".join(c["file_name"] for c in contracts)
        return f"Found {len(contracts)} matching contract(s): {names}"

    context = "\n\n".join(
        f"[{c['file_name']}, chunk {c['chunk_index']}]\n{c['chunk_text']}"
        for c in chunks
    )

    prompt = ANSWER_PROMPT.format(context=context, query=query)
    return call_groq(prompt, temperature=0)