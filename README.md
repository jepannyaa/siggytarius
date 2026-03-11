# 🏹 Siggytarius AI

> Cosmic AI companion built on **Ritual Network** — powered by **Groq** inference and **TF-IDF RAG**.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| AI Inference | Groq (llama-3.3-70b-versatile) |
| Streaming | SSE via ReadableStream |
| RAG | TF-IDF vector store (no external DB) |
| Styling | Tailwind CSS + custom CSS |
| Fonts | Orbitron + Rajdhani |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up env
cp .env.local.example .env.local
# → Add your GROQ_API_KEY from https://console.groq.com

# 3. (Optional) Build RAG knowledge base
npm run scrape       # Scrape Ritual docs
npm run embeddings   # Build TF-IDF vector store

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Chat UI
│   └── api/
│       ├── chat/route.ts     # SSE streaming endpoint
│       └── health/route.ts   # Status check
├── components/
│   ├── chat/                 # ChatContainer, ChatMessage, ChatInput, PersonaSelector
│   ├── layout/Header.tsx
│   └── ui/hero-1.tsx
├── hooks/
│   ├── useChat.ts            # SSE streaming + message state
│   └── usePersona.ts         # Persona state (localStorage)
├── lib/
│   ├── groq.ts               # Groq client
│   ├── constants.ts          # Config + Ritual doc URLs
│   ├── utils.ts              # TF-IDF helpers
│   ├── prompts/              # System prompts per persona
│   └── rag/retriever.ts      # RAG pipeline
└── types/index.ts
```

---

## Personas

| Name | Vibe |
|------|------|
| 🏹 **Siggy** | Playful cosmic archer |
| 🔮 **Sage** | Wise ancient oracle |
| ⚡ **Rebel** | Bold chaos agent |

---

## Team

Built by **jepannyaa**, **tutubear**, **babasss**
