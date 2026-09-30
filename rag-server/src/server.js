import express from "express";
import dotenv from "dotenv";
import { portfolioDocuments } from "./portfolioDocuments.js";
import { findRelevantDocuments } from "./vectorStore.js";
import { generateAnswer, getModelProvider } from "./llm.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: getModelProvider(),
    docCount: portfolioDocuments.length,
  });
});

app.post("/api/chat", async (req, res) => {
  const { question } = req.body ?? {};

  if (!question || !String(question).trim()) {
    return res.status(400).json({
      error: "Question is required.",
    });
  }

  try {
    const relevantDocuments = findRelevantDocuments(
      portfolioDocuments,
      question,
      5,
    );

    if (!relevantDocuments.length) {
      return res.json({
        answer:
          "I could not find a reliable answer in the profile data. Try asking about skills, experience, ownership, education, awards, resume links, or contact details.",
        citations: [],
        confidence: 0.2,
      });
    }

    const llmResponse = await generateAnswer(question, relevantDocuments);

    return res.json({
      answer: llmResponse.answer,
      citations: llmResponse.citations.length
        ? llmResponse.citations
        : relevantDocuments.map((document) => ({
            id: document.id,
            title: document.title,
            section: document.section,
          })),
      confidence: llmResponse.confidence ?? 0.8,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      error: "Failed to generate a response from the portfolio assistant.",
    });
  }
});

app.listen(port, () => {
  console.log(`RAG server listening on http://localhost:${port}`);
});
