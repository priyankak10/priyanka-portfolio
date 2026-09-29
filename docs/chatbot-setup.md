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
- supports more polished recruiter-style answers for fit, strengths, ownership, and experience-summary questions
- returns low-risk, grounded answers
- refuses questions when confidence is too low instead of inventing information
- is available through a dedicated Ask Priyanka page
- is reachable from the main header navigation and a Home page call-to-action button
- also remains available as a floating chatbot launcher for quick access across the site

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
- `src/chatbot/ProfileChatPanel.jsx`
- `src/pages/AssistantPage.jsx`
- `docs/chatbot-setup.md`

### Updated

- `src/layout/SiteLayout.jsx`
- `src/pages/HomePage.jsx`
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
- `src/chatbot/ProfileChatPanel.jsx`
- `src/pages/AssistantPage.jsx`

What it does:

- uses a shared chat panel component so the same assistant experience can be rendered in a dedicated page
- provides a welcome message explaining the assistant is profile-only
- supports free-text questions
- shows suggested prompts for common questions
- renders user and assistant messages in separate bubbles
- displays lightweight citations showing which knowledge sections were matched

Additional UI enhancement:

- the site now includes a dedicated Ask Priyanka page in navigation
- the Home page uses a smaller call-to-action button to send visitors to that page instead of embedding the assistant in the middle of the page
- a floating chatbot button is also mounted globally so visitors can open the assistant without leaving the current page

Suggested example prompts include:

- What are Priyanka's core skills?
- Give me a recruiter summary of Priyanka.
- Why is Priyanka a strong fit for a full-stack role?
- What has Priyanka owned end to end?
- How many years of experience does Priyanka have?

### 2a. Recruiter-Style Answering Improvements

The retrieval logic was improved so answers are more polished for recruiter-oriented questions, not just literal keyword lookups.

Examples of supported recruiter-style intent:

- recruiter summary
- role fit and hiring-fit questions
- strengths summary
- ownership and leadership summary
- years of experience summary

These answers are still grounded to the same profile data and include citations from the matched knowledge sections.

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

## Shared Chat History Implementation

### Goal

Ensure the floating assistant launcher and the dedicated Ask Priyanka page behave as the same conversation instead of two separate local chat sessions.

### Why this was needed

Previously, both surfaces mounted their own independent chat state. That created a poor experience where a user could ask one question in the floating bubble and then see a different conversation when opening the full assistant page.

For a portfolio assistant, the desired behavior is continuity: the conversation should feel like one assistant experience regardless of which entry point is used.

### Implementation approach

The solution was to move the chat state into a shared React context, then consume that context from the shared `ProfileChatPanel` component.

Files involved:

- `src/chatbot/chatState.js`
- `src/chatbot/ProfileChatPanel.jsx`
- `src/App.jsx`

### Shared state design

`src/chatbot/chatState.js` defines:

- `ChatContext`
- `ChatProvider`
- `useAssistantChat`
- a shared `messages` array
- a shared `nextMessageIdRef` counter

The provider stores the active message history in React state and exposes it to all mounted assistant components.

### App-level wiring

`src/App.jsx` wraps the app with `ChatProvider` so the state sits above the route tree and remains available across navigation.

This keeps the conversation independent from the specific route being rendered, which is important because the same user may move between the home page, a project page, and the assistant page without losing context.

### Panel behavior

`ProfileChatPanel.jsx` was updated to stop managing its own local `messages` state. Instead, it:

- reads `messages` from `useAssistantChat()`
- writes new user and assistant replies via `setMessages(...)`
- keeps one shared welcome message at initialization
- preserves a single auto-incrementing message ID source so message keys stay unique across both surfaces

This means both the floating assistant and the page-based assistant render from the same message array and therefore show the same conversation history.

### Result

The app now behaves like a single assistant experience:

- same conversation history in floating launcher
- same conversation history on the dedicated Ask Priyanka page
- no duplicate local chat state between route-based and floating entry points
- consistent answer generation and UI behavior across both surfaces

### Validation

After this change, the project was checked with:

- `npm run build`

Result: build passed successfully. The only note was the existing Vite warning about chunk size, which is non-blocking and unrelated to the shared chat logic.

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
