from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.wiki_query import ask
from app.wiki_store import list_source_documents, list_wiki_pages, rebuild_index

app = FastAPI(
    title="CRECO PBO Act Wiki API",
    description="LLM Wiki pattern — answers from compiled, reviewable wiki pages",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)


class AskResponse(BaseModel):
    answer: str
    citations: list[dict]
    confidence: str
    refused: bool


@app.on_event("startup")
def startup():
    rebuild_index()


@app.get("/health")
def health():
    return {"status": "ok", "engine": "llm-wiki"}


@app.get("/sources")
def sources():
    return {"sources": list_source_documents()}


@app.get("/wiki/pages")
def wiki_pages():
    return {"pages": list_wiki_pages()}


@app.post("/ask", response_model=AskResponse)
def ask_question(body: AskRequest):
    try:
        result = ask(body.question)
        return AskResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/admin/reindex")
def run_reindex():
    return rebuild_index()
