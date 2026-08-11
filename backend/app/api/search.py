from typing import Optional, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Search.nl_search import natural_language_search

router = APIRouter(prefix="/search", tags=["search"])


class SearchRequest(BaseModel):
    query: str


class SearchSource(BaseModel):
    contract_id: str
    file_name: str
    similarity: Optional[float] = None


class SearchResponse(BaseModel):
    answer: str
    sources: List[SearchSource]


@router.post("", response_model=SearchResponse)
def search(request: SearchRequest, db: Session = Depends(get_db)):
    return natural_language_search(db, request.query)