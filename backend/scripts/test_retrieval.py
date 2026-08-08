"""
Quick manual test for the retrieval core, before any UI or LLM layer exists
on top of it.

Usage (from your backend folder):
    python -m scripts.test_retrieval "find agreements with unlimited liability"
    python -m scripts.test_retrieval "what are the payment terms"
"""
import sys
from app.database import SessionLocal
from app.services.retrieval import search_chunks, search_contracts


def run(query: str):
    db = SessionLocal()
    try:
        print(f"\nQuery: {query!r}\n")

        print("Top matching chunks:")
        for r in search_chunks(db, query, top_k=5):
            preview = r["chunk_text"][:100].replace("\n", " ")
            print(f"  [{r['similarity']:.3f}] {r['file_name']} (chunk {r['chunk_index']}): {preview}...")

        print("\nTop matching contracts (deduped, best chunk per contract):")
        for r in search_contracts(db, query, top_n_contracts=4):
            preview = r["chunk_text"][:100].replace("\n", " ")
            print(f"  [{r['similarity']:.3f}] {r['file_name']}: {preview}...")

    finally:
        db.close()


if __name__ == "__main__":
    query = " ".join(sys.argv[1:]) or "payment terms"
    run(query)