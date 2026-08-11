from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.extracted_fields import ExtractedFields
from app.services.Search.query_router import route_query, QueryFilters
from app.services.Search.retrieval import search_contracts, search_chunks
from app.services.Search.rag_generation import generate_answer


def _filter_contract_ids(db: Session, filters: QueryFilters) -> Optional[List[str]]:
    """
    Applies structured filters against ExtractedFields (joined to Contract)
    with plain SQL/ORM filtering -- fast and exact, no embedding math
    needed. Returns matching contract_id strings, or None if there are no
    metadata filters (meaning: don't restrict, search all contracts).
    """
    if not filters.has_metadata_filters():
        return None

    q = db.query(Contract.id).join(ExtractedFields, ExtractedFields.contract_id == Contract.id)

    if filters.expiry_after:
        q = q.filter(ExtractedFields.expiry_date >= filters.expiry_after)
    if filters.expiry_before:
        q = q.filter(ExtractedFields.expiry_date <= filters.expiry_before)
    if filters.effective_after:
        q = q.filter(ExtractedFields.effective_date >= filters.effective_after)
    if filters.effective_before:
        q = q.filter(ExtractedFields.effective_date <= filters.effective_before)
    if filters.governing_law:
        q = q.filter(ExtractedFields.governing_law.ilike(f"%{filters.governing_law}%"))
    if filters.min_value is not None:
        q = q.filter(ExtractedFields.value >= filters.min_value)
    if filters.max_value is not None:
        q = q.filter(ExtractedFields.value <= filters.max_value)

    return [str(row.id) for row in q.all()]


def _get_file_name(db: Session, contract_id: str) -> str:
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    return contract.file_name if contract else "Unknown"


def natural_language_search(db: Session, query: str, top_n: int = 5) -> dict:
    """
    The full Step 3 pipeline:
      1. Route the query -> semantic part + structured filters
      2. Apply structured filters via SQL (narrows down which contracts are even eligible)
      3. Run semantic search scoped to those contracts (if there's a semantic component)
      4. Generate a cited natural-language answer from the retrieved chunks
    """
    filters = route_query(query)
    contract_ids = _filter_contract_ids(db, filters)

    # Metadata filters matched nothing -- skip semantic search over an empty set.
    if contract_ids is not None and len(contract_ids) == 0:
        return {"answer": "No contracts matched those criteria.", "sources": []}

    if filters.semantic_query:
        top_contracts = search_contracts(db, filters.semantic_query, top_n_contracts=top_n, contract_ids=contract_ids)
        
        # Pull several chunks per matched contract for generation context,
        # not just each contract's single best chunk.
        chunks_for_context = search_chunks(db, filters.semantic_query, top_k=top_n * 3, contract_ids=contract_ids)
    else:
        # Pure metadata query ("expiring next month") -- no topic to search
        # semantically. List the matched contracts directly.
        top_contracts = [
            {"contract_id": cid, "file_name": _get_file_name(db, cid), "similarity": None}
            for cid in (contract_ids or [])
        ][:top_n]
        chunks_for_context = []

    answer = generate_answer(query, chunks_for_context, top_contracts)

    return {
        "answer": answer,
        "sources": [
            {
                "contract_id": c["contract_id"],
                "file_name": c["file_name"],
                "similarity": c.get("similarity"),
            }
            for c in top_contracts
        ],
    }