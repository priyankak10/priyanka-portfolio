# RAG Server

This folder contains the backend API for the portfolio chatbot.

It keeps the model access and retrieval logic separate from the frontend React app, so API keys stay server-side and the browser never handles direct model calls.

## Purpose

The server exposes a small chat API that:

- receives a user question
- finds the most relevant portfolio sections
- builds a grounded context block
- sends that context to an LLM provider
- returns a structured answer with citations and confidence

## Folder layout

```text
rag-server/
  .env.example
  package.json
  README.md
  src/
    llm.js
    portfolioDocuments.js
    server.js
    vectorStore.js
```

## Local setup

1. Open a terminal in this folder.
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
copy .env.example .env
```

4. Fill in the keys you want to use.

## Supported providers

The server supports the following backend providers:

- OpenAI
- Google Gemini
- Azure OpenAI

Choose one by setting the corresponding environment variables.

### OpenAI

```bash
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
LLM_PROVIDER=openai
```

### Gemini

```bash
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash
LLM_PROVIDER=gemini
```

### Azure OpenAI

```bash
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
LLM_PROVIDER=openai
```

## Run the server

```bash
npm run dev
```

The server starts on:

```text
http://localhost:4000
```

## API endpoint

### POST /api/chat

Request body:

```json
{
  "question": "What are Priyanka's core skills?"
}
```

Response:

```json
{
  "answer": "Priyanka is a full-stack engineer with strengths in React, Node.js, and platform engineering.",
  "citations": [
    {
      "id": "skills-overview",
      "title": "Skills overview",
      "section": "skills"
    }
  ],
  "confidence": 0.9
}
```

## Health check

```bash
curl http://localhost:4000/api/health
```

Example response:

```json
{
  "ok": true,
  "provider": "openai",
  "docCount": 14
}
```

## Notes

- The backend uses the portfolio data already defined in the main app.
- Retrieval is intentionally constrained to portfolio content.
- The app avoids exposing any LLM API keys in the browser.
- This is the secure path for real RAG with a static frontend deployment.

## Recommended next upgrade

If you want to go production-grade, move from the current lexical retrieval to a vector database such as:

- pgvector
- Pinecone
- Qdrant

That would let you store embeddings and retrieve more semantically relevant chunks for larger knowledge sets.
