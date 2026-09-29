# Priyanka Portfolio

## Repository summary

This repository contains a personal portfolio website for Priyanka Kumari, built with React, Vite, React Router, and Material UI.

It presents:

- professional summary and engineering profile
- core skills across frontend, backend, cloud, and automation
- experience highlights and ownership areas
- project and repo-wise work highlights
- contact details and resume-oriented portfolio content

The app is structured as a small multi-page frontend with dedicated Home, Projects, and Contact pages, backed by portfolio data stored in the source tree.

## Run locally

```bash
npm install
npm run dev
```

The dev server runs with Vite. You can also use `npm start`, which maps to the same Vite development server.

## Repository and live site

This project is configured for deployment to GitHub Pages from this repository:

- https://github.com/priyankak10/priyanka-portfolio

Published site URL:

- https://priyankak10.github.io/priyanka-portfolio/

## Deploy to GitHub Pages

1. Commit and push your latest changes.
2. Run:

```bash
npm run deploy
```

This command builds the app and publishes the `dist` folder to the `gh-pages` branch.

## GitHub Pages settings

In the GitHub repository:

1. Open `Settings`.
2. Open `Pages`.
3. Under `Build and deployment`, set:
   - `Source`: `Deploy from a branch`
   - `Branch`: `gh-pages`
   - `Folder`: `/ (root)`

After GitHub finishes publishing, your app will be available at:

- https://priyankak10.github.io/priyanka-portfolio/

## Notes

- The app uses `HashRouter`, so refreshing nested routes works on GitHub Pages.
- Vite is configured with the `/priyanka-portfolio/` base path so assets load correctly from the repository site.

## Profile Assistant

The portfolio now includes a profile assistant that answers only from data already present in the app.

Current implementation:

- builds a small in-browser knowledge base from `src/data/portfolioData.js`
- retrieves the most relevant profile sections for each question
- returns a constrained answer with citations to the matched profile sections
- refuses low-confidence questions instead of inventing information

Why this is not full LLM-backed RAG yet:

- this site is deployed as a static GitHub Pages app
- a real RAG chatbot with natural language generation needs a backend or serverless API to call an LLM securely
- API keys must not be shipped in frontend code

Recommended upgrade path for true RAG:

1. Keep `portfolioData.js` as the source content and export it as structured profile documents.
2. Create a small backend endpoint on Vercel, Netlify Functions, Azure Functions, or Cloudflare Workers.
3. In the backend, chunk the profile data and generate embeddings.
4. Store embeddings in a vector store such as Pinecone, Qdrant, pgvector, or even an in-memory index for small data.
5. On each question, retrieve top matching chunks and send only those chunks to the LLM with a strict prompt such as: answer only from provided profile context, otherwise say the answer is not available.
6. Replace the current client-side `answerProfileQuestion` function with a frontend API call.

If you want to keep the site fully static, the current retrieval-first assistant is the safer option because it stays profile-only by design and does not expose credentials.
