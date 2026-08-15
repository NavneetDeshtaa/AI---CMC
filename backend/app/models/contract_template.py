import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class ContractTemplate(Base):
    """
    A reusable skeleton for AI draft generation -- not a filled-in
    contract itself, but a definition of "what a Service Agreement should
    contain" that Step 2's generation logic will use as a guide, alongside
    form inputs (customer, value, duration, jurisdiction).
    """
    __tablename__ = "contract_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String, nullable=False)             # e.g. "Standard Service Agreement"
    contract_type = Column(String, nullable=False)     # e.g. "service_agreement", "nda", "employment"
    description = Column(Text)

    # Which clauses this contract type should include, in order. Reuses
    # PolicyRule.clause_name values where they overlap (e.g.
    # "Limitation of Liability") so Phase 3's risk pipeline and Phase 4's
    # draft generation speak the same vocabulary for clause names --
    # deliberately NOT a foreign key though, since a template might also
    # reference clause types that aren't in your risk policy set at all.
    clause_outline = Column(JSONB, nullable=False)   # ["Parties", "Term", "Payment Terms", ...]

    # Freeform guidance for the LLM on tone/structure for this template --
    # e.g. "Use formal legal language. Favor the service provider on
    # payment terms unless told otherwise."
    generation_instructions = Column(Text)

    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())