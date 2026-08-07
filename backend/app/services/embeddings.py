from typing import List
from functools import lru_cache
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"  # 384-dim, fast, good default for semantic search


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """
    Loads the sentence-transformers model once and reuses it. Loading this
    model from disk takes a couple of seconds -- lru_cache(maxsize=1) means
    that only happens on the first call in this process, not every request.
    """
    return SentenceTransformer(MODEL_NAME)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Embeds a batch of texts in one call (batching is significantly faster
    than embedding one string at a time). Returns a list of 384-float
    vectors, one per input text, in the same order.
    """
    if not texts:
        return []
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return embeddings.tolist()


def embed_query(text: str) -> List[float]:
    """Convenience wrapper for embedding a single search query (Step 2 will use this)."""
    return embed_texts([text])[0]