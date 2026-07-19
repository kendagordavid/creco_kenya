# CRECO PBO Act Knowledge Wiki — LLM Wiki Prototype

A working prototype for CRECO Kenya's civic access platform using the **LLM Wiki pattern** (Karpathy / Microsoft approach) — **not RAG**.

## LLM Wiki vs RAG

| | **LLM Wiki (this prototype)** | **RAG (not used)** |
|---|---|---|
| Knowledge form | Compiled Markdown wiki pages | Raw document chunks in vector DB |
| When AI runs | At compile time (+ optional polish at query) | At every query (retrieve + generate) |
| Query time | Full-text search over wiki pages | Vector similarity over chunks |
| Staff control | Review/edit wiki pages before publishing | Harder to audit generated answers |
| Accuracy | Stable, reviewable content | Depends on chunk retrieval quality |

## Architecture

```
Source PDFs  →  Compile  →  Markdown Wiki  →  FTS Index  →  User Question
                  (once)      (reviewable)      (SQLite)         ↓
                                                            Wiki page match
                                                                 ↓
                                                          Answer + citations
```

### Flow

1. **Compile** — PBO Act PDFs are transformed into structured, interlinked Markdown wiki pages (`prototype/wiki/`).
2. **Index** — Wiki pages are indexed with SQLite FTS5 for fast full-text search.
3. **Query** — User questions match relevant wiki pages (not raw PDF chunks).
4. **Answer** — Responses are drawn from compiled wiki content, with citations to wiki pages and underlying source documents.

## Quick start

### 1. Backend

```bash
cd prototype/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Optional: add OPENAI_API_KEY for polished answers (works without it too)

python scripts/rebuild_wiki_index.py
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd prototype/web
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo questions

- What documents do I need to register as a PBO?
- What is a Public Benefit Organization under the PBO Act?
- How long does the Authority have to decide on a registration application?
- Ni nini mahitaji ya kusajili shirika la faida ya umma?

## Guardrails

| Rule | Implementation |
|---|---|
| Answers from approved content only | Wiki pages compiled from approved sources |
| Staff can review before publish | Markdown files editable in CMS/production |
| Citations on every answer | Wiki page + underlying PDF references |
| Refuse when unsure | FTS returns no match → contact CRECO message |
| Not legal advice | Persistent disclaimer in UI |
| No RAG / no vector DB | SQLite FTS over compiled wiki only |

## Wiki structure

```
prototype/wiki/
├── index.md
└── topics/
    ├── what-is-a-pbo.md
    ├── registration-requirements.md
    ├── registration-process-and-timeline.md
    ├── objects-and-purpose-of-the-act.md
    └── pbo-regulatory-authority.md
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check (`engine: llm-wiki`) |
| GET | `/sources` | Underlying PDF source documents |
| GET | `/wiki/pages` | List compiled wiki pages |
| POST | `/ask` | `{ "question": "..." }` → answer + wiki citations |
| POST | `/admin/reindex` | Rebuild FTS index after wiki edits |

## Migration to full platform

Per the CRECO technical proposal, production will use:

- **Django CMS** for wiki page management (staff edit/publish workflow)
- **PostgreSQL full-text search** instead of SQLite FTS
- **Compile pipeline** triggered when CRECO uploads new approved documents
- Integration with compliance tools, monitoring forms, and admin dashboard

## Costs

- Wiki search: free (SQLite FTS, no API)
- Optional answer polish: OpenAI API only if `OPENAI_API_KEY` is set
- No vector DB, no embedding model, no per-query retrieval costs

## Project structure

```
prototype/
├── wiki/                    # Compiled knowledge base (Markdown)
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes
│   │   ├── wiki_store.py    # Wiki loader + FTS index
│   │   ├── wiki_query.py    # Search wiki + answer
│   │   └── compiler.py      # Optional LLM compile from PDFs
│   └── scripts/
│       └── rebuild_wiki_index.py
└── web/
    ├── app/page.tsx
    └── components/
        ├── ChatInterface.tsx
        └── CitationPanel.tsx
```
