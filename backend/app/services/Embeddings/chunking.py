import re
from typing import List

# Tuned for legal/contract text: big enough to hold a full clause or two
# for context, small enough to keep retrieval precise and embeddings fast.
DEFAULT_CHUNK_SIZE = 1000   # characters
DEFAULT_OVERLAP = 150       # characters shared between consecutive chunks


def _split_into_sentences(text: str) -> List[str]:
    """
    Naive sentence splitter. Splits on '.', '!', '?' followed by whitespace
    and a capital letter/quote -- good enough for contract prose without
    pulling in a full NLP library for this step.
    """
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"\'])', text.strip())
    return [s.strip() for s in sentences if s.strip()]


def chunk_text(text: str,chunk_size: int = DEFAULT_CHUNK_SIZE,overlap: int = DEFAULT_OVERLAP,) -> List[str]:
    """
    Splits text into overlapping chunks, breaking on sentence boundaries
    where possible so a chunk doesn't cut a clause in half mid-sentence.

    Strategy: accumulate whole sentences into a chunk until adding the next
    sentence would exceed chunk_size, then start a new chunk that begins
    `overlap` characters back into the previous chunk (so context carries
    across the boundary -- important for legal text where a clause's
    meaning often depends on the sentence before it).
    """
    if not text or not text.strip():
        return []

    sentences = _split_into_sentences(text)
    if not sentences:
        return []

    chunks: List[str] = []
    current = ""

    for sentence in sentences:
        candidate = f"{current} {sentence}".strip() if current else sentence

        if len(candidate) <= chunk_size:
            current = candidate
            continue

        # Current chunk is full -- save it and start the next one.
        if current:
            chunks.append(current)

        # Start new chunk with overlap: carry the tail of the previous
        # chunk forward so retrieval doesn't lose context at the seam.
        overlap_text = current[-overlap:] if current and overlap > 0 else ""
        current = f"{overlap_text} {sentence}".strip()

        # Edge case: a single sentence longer than chunk_size on its own.
        # Hard-split it rather than producing one giant unbounded chunk.
        while len(current) > chunk_size:
            chunks.append(current[:chunk_size])
            current = current[chunk_size - overlap:]

    if current:
        chunks.append(current)

    return chunks