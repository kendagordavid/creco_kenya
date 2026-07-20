# How to use the CRECO PBO prototype

## What you need running

You need **two terminals** — backend (API) and frontend (website).

### Terminal 1 — Backend

```bash
cd prototype/backend
source .venv/bin/activate
python scripts/rebuild_wiki_index.py   # once, or after editing wiki files
uvicorn app.main:app --reload --port 8000
```

Check: open [http://localhost:8000/health](http://localhost:8000/health) — you should see `"status": "ok"`.

### Terminal 2 — Frontend

```bash
cd prototype/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using the site

### Home

Overview of the platform and links to the three main areas.

### PBO Guidance (`/guidance` or **Ask a question** in the header)

1. Click **Start writing** (or **Ask a question** from the menu — opens the form ready to type).
2. Type your question in English or Kiswahili, or tap a **common question** to fill the box (you can edit it first).
3. Click **Find guidance** (or Ctrl+Enter).
4. Read the **Guidance response** and check **Source material** on the right for linked topics and PDFs.
5. Use **Ask another question** for a follow-up.

### Topics (`/topics`)

Browse compiled PBO Act topic pages. **Ask about this topic** sends you to Guidance with that topic pre-filled.

### Sources (`/sources`)

Links to the official PDFs the topics are built from.

---

## About the API key error (401)

If you saw `Incorrect API key provided: sk-your-****here`, the backend was using the **placeholder** key from `.env.example`.

**Default (fixed):** leave `OPENAI_API_KEY=` **empty** in `prototype/backend/.env`. Answers come directly from compiled wiki topics — no OpenAI account needed.

**Optional:** add a real OpenAI API key in `.env` for slightly more polished wording. Restart the backend after changing `.env`.

---

## Good demo questions

- What documents do I need to register as a PBO?
- What is a Public Benefit Organization under the PBO Act?
- How long does the Authority have to decide on a registration application?
- Ni nini mahitaji ya kusajili shirika la faida ya umma?

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Guidance says “Failed to fetch” | Start the backend on port 8000 |
| No topics / empty sources | Run `python scripts/rebuild_wiki_index.py` |
| Still seeing API errors | Clear `OPENAI_API_KEY` in `.env`, restart backend |
| Frontend on wrong port | Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `prototype/web/.env.local` |
