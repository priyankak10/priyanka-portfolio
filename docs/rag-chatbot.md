# Real backend RAG for the portfolio assistant

Date: 2026-09-29

## Goal

Keep the current React UI and chat experience, but move the actual reasoning and retrieval to a secure backend endpoint that can call an LLM with a real RAG pipeline.

This design works with:

- OpenAI
- Google Gemini
- Azure OpenAI

The frontend remains the same in spirit: a chat panel, prompt input, and response bubbles. The difference is that the frontend no longer decides the answer locally using a static keyword matcher.

## Recommended architecture

```text
React UI (ProfileChatPanel.jsx)
        |
        | POST /api/chat
        v
Backend API (Express / Vercel / Azure Function / Cloudflare Worker)
        |
        | 1. normalize question
        | 2. fetch top-k relevant profile chunks from vector store
        | 3. build prompt with profile context only
        | 4. call OpenAI / Gemini / Azure OpenAI
        v
Returns JSON: { answer, citations, confidence }
```

## Keep the current UI

The current UI already has a clean separation:

- `src/chatbot/ProfileChatPanel.jsx` renders the chat experience
- `src/chatbot/chatState.js` stores chat history
- `src/chatbot/profileKnowledgeBase.js` currently does retrieval locally

To keep the same UI, do not rewrite the panel. Instead, replace the local data lookup call with an API call.

Example frontend change:

```js
const submitQuestion = async (rawQuestion) => {
  const question = rawQuestion.trim();
  if (!question) return;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  setMessages((currentMessages) => [
    ...currentMessages,
    { id: `user-${messageIdBase}`, role: "user", text: question },
    {
      id: `assistant-${messageIdBase}`,
      role: "assistant",
      text: data.answer,
      citations: data.citations ?? [],
      confidence: data.confidence ?? 0.9,
    },
  ]);
};
```

The rest of the interface stays intact.

## Preferred backend shape

Use a small API server that exposes one route:

- `POST /api/chat`

Request body:

```json
{
  "question": "What are Priyanka's core skills?"
}
```

Response:

```json
{
  "answer": "Priyanka is a full-stack engineer with experience in React, Node.js, JavaScript, and cloud tooling.",
  "citations": [
    { "section": "skills", "title": "Skills overview" },
    { "section": "experience", "title": "Experience timeline" }
  ],
  "confidence": 0.94
}
```

## Source data for the backend

The best starting point is still `src/data/portfolioData.js`.

Keep it as the canonical portfolio content, then expose it to the backend as structured JSON or as a generated document store.

Recommended structure:

```js
[
  {
    id: "summary-1",
    section: "summary",
    title: "Profile summary",
    content: "Priyanka is a full-stack engineer based in ...",
    source: "portfolioData.summary",
  },
  {
    id: "skills-1",
    section: "skills",
    title: "Skills overview",
    content: "Frontend: React, JavaScript, TypeScript...",
    source: "portfolioData.skills",
  },
];
```

The backend can then split these into chunk documents for retrieval.

## Retrieval flow

Every question should flow like this:

1. Receive `question`
2. Generate an embedding for the question
3. Query the vector store for the top 3-8 most relevant document chunks
4. Build a context block only from those chunks
5. Send that context to the LLM with a strict system prompt
6. Return a grounded answer and citations

Example system prompt:

```text
You are a portfolio assistant for Priyanka Kumari.
Answer only using the provided profile context.
If the answer is not present in the context, say so clearly.
Do not invent experience, skills, certifications, or contact details.
Keep the answer concise and recruiter-friendly.
Return a JSON object with:
- answer: string
- citations: [{ section, title }]
- confidence: number
```

## Option 1: OpenAI backend

Use OpenAI embeddings and chat completions.

Example with Node + Express:

```js
import express from "express";
import OpenAI from "openai";
import { portfolioDocuments } from "./portfolioDocuments.js";

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const embeddingResponse = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const queryVector = embeddingResponse.data[0].embedding;

  // fetch top-k from a vector DB or in-memory relevance function
  const topDocuments = await findRelevantDocs(queryVector, 5);
  const context = topDocuments.map((d) => d.content).join("\n\n");

  const completion = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "You are a portfolio assistant. Answer only from the provided context. Return JSON with answer, citations, and confidence.",
      },
      {
        role: "user",
        content: `Question: ${question}\n\nContext:\n${context}`,
      },
    ],
    response_format: { type: "json_schema", json_schema: { ... } },
  });

  res.json(JSON.parse(completion.output_text));
});
```

Good for:

- easiest developer experience
- reliable model quality
- straightforward API

## Option 2: Gemini backend

For Google Gemini, use Generative AI with embeddings and chat generation.

Typical flow:

- embedding model: `text-embedding-004`
- generation model: `gemini-2.0-flash` or `gemini-1.5-pro`

Pseudo-code:

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: `Question: ${question}\n\nContext:\n${context}` }],
    },
  ],
  systemInstruction:
    "Answer only from the provided profile context. Do not invent data.",
});
```

Pros:

- strong multimodal support
- simple integration in Node and serverless apps

Cons:

- requires careful prompt guardrails
- output formatting needs parsing for JSON

## Option 3: Azure OpenAI backend

This is often the cleanest choice for enterprise or corporate environments.

Required environment variables:

```bash
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

Example Node code:

```js
import { AzureOpenAI } from "openai";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT,
});

const embedding = await client.embeddings.create({
  model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
  input: question,
});
```

This keeps the same architecture while aligning with enterprise security and compliance constraints.

## Vector store options

For a portfolio this small, you do not need a huge vector database at first.

### Option A: in-memory vector index

Use for local dev and small data sets.

```js
const docs = [
  { id: "1", content: "Priyanka is a full-stack engineer...", section: "summary" },
  { id: "2", content: "Skills include React, Node.js, JavaScript...", section: "skills" },
];

function cosineSimilarity(a, b) { ... }

async function findRelevantDocs(queryVector, topK = 5) {
  return docs
    .map((doc) => ({ ...doc, score: cosineSimilarity(queryVector, doc.embedding) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, topK);
}
```

This is fast to prototype and enough for a single-person portfolio.

### Option B: pgvector

A better production choice if you want to persist embeddings.

- Postgres + pgvector
- easy to deploy on Supabase, Neon, Azure Database, or a managed Postgres

### Option C: Pinecone / Qdrant

Best for scaling and multi-document knowledge retrieval.

## Minimal project structure for a real backend

```text
backend/
  src/
    app.js
    portfolioDocuments.js
    vectorStore.js
    llm.js
  .env.example
```

The frontend stays in the Vite app and calls the backend URL.

## Production deployment options

### Vercel

Best when the portfolio is a static frontend and you want a simple Node/serverless API.

Good path:

- frontend: GitHub Pages or Vercel static deployment
- backend: Vercel serverless function

### Netlify Functions

Works well for a static site and quick deployment.

### Azure Functions

Best if you want to integrate with Azure OpenAI and enterprise identity/monitoring.

### Cloudflare Workers

Good for low-cost global API endpoints.

## Security requirements

Never do this in the frontend:

- do not keep API keys in browser code
- do not directly call OpenAI from the client
- do not expose model credentials in `src/*`

The API key must live in a server-side environment variable.

## Recommended implementation path for this portfolio

For this project, the most practical path is:

1. Keep the existing React chat UI and chat state
2. Create a small backend API at `/api/chat`
3. Use the data from `src/data/portfolioData.js` as the document source
4. Generate embeddings and store them in an in-memory or pgvector index
5. Use Azure OpenAI or OpenAI for final generation
6. Keep strict answer restrictions: only answer from the context

This gives you full RAG without touching the UI behavior expected by the current design.

## Minimal frontend contract to keep compatibility

Keep these shapes stable:

```js
{
  role: "assistant",
  text: "...",
  citations: [{ section: "skills", title: "Skills overview" }],
  confidence: 0.92
}
```

The backend just needs to return the same kind of payload the component already expects.

## Recommended env example

```bash
# .env
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o-mini

# or Azure
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

## Summary

The UI can stay exactly as it is while the real intelligence moves to a backend API.

You should do this when:

- you want grounded answers instead of a local heuristic matcher
- you want better recruiter-style responses
- you want GPT/Gemini/Azure-backed reasoning without exposing credentials

The current portfolio assistant is a strong front-end retrieval layer. The next upgrade is not a UI rewrite; it is a backend API that wraps the same portfolio data in a proper RAG pipeline.
