# 🧘 Mental Coach — Frontend

A chill little Next.js chat UI that talks to the FastAPI mental-coach backend in `../api`. You type, the coach replies, and everyone feels a bit better. ✨

## What it does

- 💬 Sends your message to `POST /api/chat` as `{ "message": "..." }` and shows the `reply`
- 🟢 Pings `GET /api/health` on load and shows an Online / Offline badge
- ⚠️ Shows the backend's own error message (bad API key, rate limit, etc.) right in the chat
- ⌨️ Enter to send, Shift+Enter for a new line, and the text box grows as you type

> Heads up: the backend handles one message at a time and doesn't remember earlier turns. The chat history you see lives only in your browser tab.

## Run it locally 🏃

You need **Node.js 20.9 or newer** (Next.js 16's minimum; check with `node --version`) and **two terminals**.

**Terminal 1 — the backend** (from the repo root):

```bash
uv run uvicorn api.index:app --reload
```

**Terminal 2 — the frontend**:

```bash
cd frontend
cp .env.local.example .env.local   # points the UI at http://localhost:8000
npm install
npm run dev
```

Open **http://localhost:3000** and say hi. 👋

## Deploy to Vercel 🚀

Deploy from the **repo root** (not from `frontend/`) so the backend ships too:

```bash
npx vercel --prod
```

Don't set `NEXT_PUBLIC_API_URL` on Vercel. Frontend and backend share one domain there, so `/api/chat` just works. Do set your `LLM_PROVIDER` and API key variables in the Vercel dashboard.

## Files at a glance 🗂️

| File | What's inside |
| --- | --- |
| `app/page.tsx` | The chat screen and all the talking-to-the-backend logic |
| `app/globals.css` | Styles: calm colours, readable contrast |
| `app/layout.tsx` | Page shell and title |
| `.env.local.example` | Template for the local backend URL |
