"""
MCP server for the contract intelligence platform.

This exposes three of your existing features as MCP tools -- any
MCP-compatible client (Claude Desktop, other agents) can discover and call
these without knowing anything about your FastAPI routes or database.

Each tool opens its own DB session and closes it when done, since MCP
tool calls happen outside FastAPI's request lifecycle -- there's no
Depends(get_db) to lean on here, so we manage the session lifetime
manually, the same way your backfill/seed scripts do.

Run with:
    python -m mcp_server.server
"""
import uuid
from mcp.server.fastmcp import FastMCP

from app.database import SessionLocal
from app.services.Risk.orchestrator import get_or_create_risk_assessment
from app.services.Summarization.summary_orchestrator import get_or_create_summary
from app.services.Search.nl_search import natural_language_search

# Runs on a different port (8001) from your FastAPI app (8000) -- both
# processes run side by side, no conflict.
mcp = FastMCP("contract-intelligence", host="127.0.0.1", port=8001)


@mcp.tool()
def get_contract_risk(contract_id: str) -> dict:
    """
    Get the AI risk assessment for a contract: a 0-100 risk score, risk
    level (low/medium/high), specific flagged clauses with severity,
    missing clauses, and a plain-English explanation. Returns a cached
    result if the contract hasn't changed since it was last analyzed.
    """
    db = SessionLocal()
    try:
        a = get_or_create_risk_assessment(db, uuid.UUID(contract_id))
        return {
            "risk_score": a.risk_score,
            "risk_level": a.risk_level,
            "flagged_clauses": a.flagged_clauses,
            "missing_clauses": a.missing_clauses,
            "explanation": a.explanation,
        }
    except ValueError as e:
        return {"error": str(e)}
    finally:
        db.close()


@mcp.tool()
def get_contract_summary(contract_id: str) -> dict:
    """
    Get the AI-generated summary of a contract: a plain-English overview,
    key obligations, payment terms, important dates, and any flagged
    risks. Returns a cached result if the contract hasn't changed.
    """
    db = SessionLocal()
    try:
        s = get_or_create_summary(db, uuid.UUID(contract_id))
        return {
            "overview": s.overview,
            "key_obligations": s.key_obligations,
            "payment_terms": s.payment_terms,
            "important_dates": s.important_dates,
            "risks_flagged": s.risks_flagged,
        }
    except ValueError as e:
        return {"error": str(e)}
    finally:
        db.close()


@mcp.tool()
def search_contracts(query: str) -> dict:
    """
    Search across all contracts using natural language. Supports semantic
    queries (e.g. "find agreements with unlimited liability"), metadata
    queries (e.g. "contracts expiring next month"), and hybrid queries
    combining both. Returns a natural-language answer plus the specific
    contracts it was drawn from.
    """
    db = SessionLocal()
    try:
        return natural_language_search(db, query)
    finally:
        db.close()


if __name__ == "__main__":
    mcp.run(transport="streamable-http")