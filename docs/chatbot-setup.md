# Chatbot Setup Process

Date: 2026-09-29

## Goal

Add a chatbot to the portfolio that answers questions from Priyanka's profile data only.

## Constraint

This portfolio is a static Vite + React app deployed to GitHub Pages.

That creates an important limitation:

- a true LLM-backed RAG chatbot needs a backend or serverless API to call the model securely
- API keys must not be exposed in frontend code
- GitHub Pages cannot securely host model-calling server logic by itself

Because of that, the implemented solution is a profile-only retrieval assistant in the frontend, not a full backend LLM RAG pipeline.

## What Was Implemented

The assistant now:

- answers only from the profile data already present in the app
- uses retrieval over structured portfolio content
- returns low-risk, grounded answers
- refuses questions when confidence is too low instead of inventing information
- is available globally through a floating chat button

## Source Data Used

The chatbot uses the existing structured data from:

- `src/data/portfolioData.js`

This file already contains the content needed for profile-grounded answers, including:

- personal details
- summary
- skills
- experience
- ownership areas
- education
- awards and certifications
- resume links

## Files Added and Updated

### Added

- `src/chatbot/profileKnowledgeBase.js`
- `src/chatbot/ProfileChatbot.jsx`
- `docs/chatbot-setup.md`

### Updated

- `src/layout/SiteLayout.jsx`
- `README.md`

## Implementation Details

### 1. Knowledge Base Layer

File:

- `src/chatbot/profileKnowledgeBase.js`

What it does:

- imports `portfolioData` and the existing experience timeline helper
- converts profile content into searchable chunks
- creates chunks for:
  - summary
  - contact details
  - skills overview
  - skill groups
  - experience records
  - experience timeline
  - ownership areas
  - education
  - awards and certifications
  - resume downloads

How matching works:

- normalizes text to lowercase
- tokenizes user questions
- removes common stop words
- expands query intent using aliases such as:
  - contact
  - skills
  - summary
  - experience
  - projects
  - education
  - awards
  - resume
- scores chunks based on keyword and token overlap
- boosts matches when the question clearly points to a section

How answers are controlled:

- if the score is strong enough, the assistant formats an answer from top matching chunks
- if the score is weak, the assistant returns a safe fallback telling the user it could not find a reliable answer in the profile data

This is the core mechanism that enforces the requirement: answer from profile data only.

### 2. Chat UI

File:

- `src/chatbot/ProfileChatbot.jsx`

What it does:

- adds a floating chatbot launcher using Material UI `Fab`
- opens a fixed chat panel
- provides a welcome message explaining the assistant is profile-only
- supports free-text questions
- shows suggested prompts for common questions
- renders user and assistant messages in separate bubbles
- displays lightweight citations showing which knowledge sections were matched

Suggested example prompts include:

- What are Priyanka's core skills?
- Summarize Priyanka's current role.
- Which projects did Priyanka own?
- How can I contact Priyanka?
- What awards and certifications does Priyanka have?

### 3. Layout Integration

File:

- `src/layout/SiteLayout.jsx`

What changed:

- imported `ProfileChatbot`
- mounted it globally near the bottom of the main site layout

Effect:

- the assistant is available across all pages in the portfolio

### 4. Documentation Update

File:

- `README.md`

What was added:

- a short explanation of the current profile assistant
- a note explaining why it is not full LLM-based RAG yet
- a recommended backend upgrade path for true RAG

## Why This Approach Was Chosen

This approach was chosen because it fits the current deployment model and protects data access boundaries.

Benefits:

- no API keys in frontend code
- no backend required
- safe for GitHub Pages deployment
- strictly grounded to existing content
- lower hallucination risk than a free-form frontend chatbot

Tradeoff:

- answers are retrieval-based and constrained, not fully generative in the way a backend LLM RAG chatbot would be

## Validation Performed

After implementation, the following checks were run:

### Lint

Command run:

```bash
npm run lint
```

Result:

- passed

### Production Build

Command run:

```bash
npm run build
```

Result:

- passed

Observed note:

- Vite reported a chunk-size warning because the generated JS bundle is above 500 kB after minification
- this is not a build failure
- it is a performance optimization opportunity for later if needed

## Current Behavior Summary

The chatbot now behaves as follows:

- answers profile-related questions from local portfolio data
- provides skill, experience, project ownership, education, awards, resume, and contact answers
- declines unsupported or weakly matched questions
- stays available throughout the app via a floating chat button

## Recommended Upgrade Path for True RAG

If a full RAG chatbot is needed later, the recommended architecture is:

1. Keep `src/data/portfolioData.js` as the primary source content.
2. Create a backend or serverless API using Vercel, Netlify Functions, Azure Functions, or Cloudflare Workers.
3. Export and chunk the profile data in the backend.
4. Generate embeddings for those chunks.
5. Store the embeddings in a vector store such as Pinecone, Qdrant, pgvector, or a lightweight in-memory index for this small dataset.
6. On each user query, retrieve top matching chunks.
7. Send only the retrieved chunks to the model with a strict prompt: answer only from provided profile context; if not found, say the information is unavailable.
8. Replace the frontend local answer function with an API request to that backend.

## Final Outcome

The portfolio now has a working chatbot experience that is aligned with the current static deployment model and restricted to Priyanka's profile data only.
