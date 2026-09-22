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
