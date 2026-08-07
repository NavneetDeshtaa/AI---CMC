import uuid
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.chunk import Chunk
from app.services.chunking import chunk_text
from app.services.embeddings import embed_texts


def process_contract_chunks(db: Session, contract_id: uuid.UUID) -> int:
    """
    Chunks and embeds a single contract's raw_text, replacing any existing
    chunks for that contract. Returns the number of chunks created.

    Idempotent by design: safe to call again if you re-run it (e.g. after
    fixing a bad OCR extraction) -- old chunks are deleted first so you
    never end up with duplicate/stale vectors for the same contract.
    """
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")

    if not contract.raw_text or not contract.raw_text.strip():
        raise ValueError(
            f"Contract {contract_id} has no raw_text to chunk. "
            "Run text extraction first."
        )

    # Clear existing chunks for this contract (re-processing case).
    db.query(Chunk).filter(Chunk.contract_id == contract_id).delete()

    pieces = chunk_text(contract.raw_text)
    if not pieces:
        db.commit()
        return 0

    vectors = embed_texts(pieces)

    for index, (piece, vector) in enumerate(zip(pieces, vectors)):
        chunk = Chunk(
            contract_id=contract_id,
            chunk_index=index,
            chunk_text=piece,
            embedding=vector,
        )
        db.add(chunk)

    db.commit()
    return len(pieces)