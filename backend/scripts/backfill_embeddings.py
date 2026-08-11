"""
Run this once to chunk + embed all contracts that don't have chunks yet.

Usage (from your backend folder, with venv active):
    python -m scripts.backfill_embeddings
"""
from app.database import SessionLocal
from app.models.contract import Contract
from app.models.chunk import Chunk
from app.services.Embeddings.chunk_processor import process_contract_chunks


def run():
    db = SessionLocal()
    try:
        contracts = db.query(Contract).all()
        print(f"Found {len(contracts)} contract(s) total.")

        processed, skipped = 0, 0

        for contract in contracts:
            existing_chunk_count = (
                db.query(Chunk).filter(Chunk.contract_id == contract.id).count()
            )
            if existing_chunk_count > 0:
                skipped += 1
                continue

            if not contract.raw_text or not contract.raw_text.strip():
                print(f"  Skipping {contract.id} ({contract.file_name}) -- no raw_text stored.")
                skipped += 1
                continue

            count = process_contract_chunks(db, contract.id)
            print(f"  Chunked {contract.file_name}: {count} chunks.")
            processed += 1

        print(f"\nDone. Processed: {processed}, Skipped: {skipped}.")
    finally:
        db.close()


if __name__ == "__main__":
    run()