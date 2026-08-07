import uuid
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database import Base

# all-MiniLM-L6-v2 (the default, lightweight sentence-transformers model)
# outputs 384-dimensional embeddings. If you later switch to a different
# model, this constant -- and the embedding column below -- must match
# that model's output dimension, and you'll need a new migration.
EMBEDDING_DIM = 384


class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ondelete="CASCADE" here (DB-level) + cascade="all, delete-orphan" on
    # the Contract.chunks relationship (ORM-level) -- belt and suspenders,
    # so chunks are cleaned up whether a contract is deleted via the ORM
    # or via a raw SQL/psql command.
    contract_id = Column(
        UUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Position of this chunk within the contract's full text (0, 1, 2...).
    # Lets us reconstruct order and show "chunk 3 of 12" style context.
    chunk_index = Column(Integer, nullable=False)

    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(EMBEDDING_DIM), nullable=False)

    contract = relationship("Contract", back_populates="chunks")