from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.chunk import Chunk
from app.models.contract import Contract
from app.services.Embeddings.embeddings import embed_query


def search_chunks(db: Session, query: str, top_k: int = 5, contract_ids: Optional[List[str]] = None,) -> List[dict]:
    """
    Embeds the query, then finds the top_k chunks across all contracts
    whose embeddings are closest (by cosine distance) to the query's
    embedding. This is the same operation as the raw SQL you tested in
    psql -- `embedding <=> query_vector ORDER BY distance` -- wrapped as
    a reusable Python call.

    contract_ids: optional list of contract UUIDs to restrict the search
    to (e.g. once Step 3 adds metadata filtering, you might first narrow
    down to contracts expiring next month, THEN semantically search only
    within those).
    """
    query_vector = embed_query(query)

    # .cosine_distance() comes from pgvector-python's SQLAlchemy integration --
    # it compiles down to the same <=> operator you used manually in psql.
    distance = Chunk.embedding.cosine_distance(query_vector).label("distance")

    q = (
        db.query(Chunk, Contract.file_name, distance)
        .join(Contract, Chunk.contract_id == Contract.id)
    )

    if contract_ids:
        q = q.filter(Chunk.contract_id.in_(contract_ids))

    results = q.order_by(distance).limit(top_k).all()

    return [
        {
            "chunk_id": str(chunk.id),
            "contract_id": str(chunk.contract_id),
            "file_name": file_name,
            "chunk_index": chunk.chunk_index,
            "chunk_text": chunk.chunk_text,
            "distance": float(dist),
            # Cosine similarity = 1 - cosine distance. More intuitive to read
            # (higher = more relevant) than raw distance (lower = more relevant).
            "similarity": round(1 - float(dist), 4),
        }
        for chunk, file_name, dist in results
    ]


def search_contracts(db: Session, query: str, top_k_chunks: int = 20, top_n_contracts: int = 5, contract_ids: Optional[List[str]] = None,) -> List[dict]:
    """
    Retrieves relevant CONTRACTS, not just chunks. A contract can have
    multiple chunks match a query -- we don't want to show the same
    contract 3 times in search results. So: cast a wider net at the chunk
    level (top_k_chunks), then collapse to each contract's single best
    (lowest-distance) matching chunk, and return the top_n_contracts by
    that best score.
    """
    chunk_results = search_chunks(db, query, top_k=top_k_chunks, contract_ids=contract_ids)

    best_per_contract: dict[str, dict] = {}
    for r in chunk_results:
        cid = r["contract_id"]
        if cid not in best_per_contract or r["distance"] < best_per_contract[cid]["distance"]:
            best_per_contract[cid] = r

    ranked = sorted(best_per_contract.values(), key=lambda r: r["distance"])
    return ranked[:top_n_contracts]