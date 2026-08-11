from datetime import date
from typing import Optional
from pydantic import BaseModel

from app.services.LLM.groq_client import call_groq, parse_json_response

ROUTER_PROMPT = """You are a query router for a contract search system. Break the user's query into:
1. A semantic part -- the conceptual/topical meaning to search for (e.g. "unlimited liability", "termination clauses") -- or null if the query is PURELY about dates/values/jurisdiction with no topic to search for.
2. Structured filters, extracted only if explicitly implied by the query.

Today's date is {today}. Resolve relative dates ("next month", "in 30 days", "this year") into explicit YYYY-MM-DD ranges using today's date as the reference point.

Respond with ONLY a valid JSON object, no markdown, no explanation, exactly this structure:
{{
  "semantic_query": "string or null",
  "expiry_after": "YYYY-MM-DD or null",
  "expiry_before": "YYYY-MM-DD or null",
  "effective_after": "YYYY-MM-DD or null",
  "effective_before": "YYYY-MM-DD or null",
  "governing_law": "string or null",
  "min_value": number or null,
  "max_value": number or null
}}

Examples:
Query: "show contracts expiring next month"
-> semantic_query is null (purely a date filter, no topic). expiry_after/expiry_before are set to next calendar month's date range.

Query: "find agreements with unlimited liability"
-> semantic_query is "unlimited liability". All filters null.

Query: "contracts governed by California law expiring this year with unlimited liability"
-> semantic_query is "unlimited liability". governing_law is "California". expiry_after/expiry_before set to this year's range.

USER QUERY: {query}
"""


class QueryFilters(BaseModel):
    semantic_query: Optional[str] = None
    expiry_after: Optional[str] = None
    expiry_before: Optional[str] = None
    effective_after: Optional[str] = None
    effective_before: Optional[str] = None
    governing_law: Optional[str] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None

    def has_metadata_filters(self) -> bool:
        return any([
            self.expiry_after, self.expiry_before,
            self.effective_after, self.effective_before,
            self.governing_law, self.min_value, self.max_value,
        ])


def route_query(query: str) -> QueryFilters:
    """
    Uses the LLM to split a query into a semantic part and structured
    filters, so retrieval can combine SQL filtering (fast, exact) with
    vector search (fuzzy, semantic) instead of forcing everything through
    one or the other.

    Falls back to plain semantic search (no filters) if the LLM call or
    JSON parsing fails -- routing is a nice-to-have, not something that
    should ever break search entirely.
    """
    prompt = ROUTER_PROMPT.format(today=date.today().isoformat(), query=query)
    try:
        raw = call_groq(prompt, temperature=0)
        data = parse_json_response(raw)
        return QueryFilters(**data)
    except Exception as e:
        print(f"Query routing failed, falling back to plain semantic search: {e}")
        return QueryFilters(semantic_query=query)