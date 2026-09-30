import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const provider = process.env.LLM_PROVIDER || "openai";

export const getModelProvider = () => provider;

const createOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({ apiKey, dangerouslyAllowBrowser: false });
};

const createGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  return new GoogleGenerativeAI(apiKey);
};

const parseJsonResponse = (rawText) => {
  if (!rawText) {
    return {
      answer:
        "I could not generate a grounded answer from the provided profile context.",
      citations: [],
      confidence: 0.4,
    };
  }

  const trimmed = rawText.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const candidate =
    start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;

  try {
    const parsed = JSON.parse(candidate);
    return {
      answer:
        parsed.answer ||
        "I could not generate a grounded answer from the provided profile context.",
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    };
  } catch {
    return {
      answer: trimmed,
      citations: [],
      confidence: 0.6,
    };
  }
};

export const generateAnswer = async (question, contextDocuments) => {
  const openaiClient = createOpenAIClient();
  const geminiClient = createGeminiClient();

  const contextText = contextDocuments
    .map(
      (document) =>
        `Section: ${document.title} (${document.section})\n${document.content}`,
    )
    .join("\n\n");

  if (provider === "gemini" && geminiClient) {
    const model = geminiClient.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });
    const prompt = `You are a portfolio assistant for Priyanka Kumari. Answer only using the provided profile context. If the answer is not present in the context, say so clearly. Do not invent facts. Return JSON with keys: answer, citations, confidence.\n\nQuestion: ${question}\n\nProfile Context:\n${contextText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseJsonResponse(response.text());
  }

  if (openaiClient) {
    const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const completion = await openaiClient.responses.create({
      model: modelName,
      input: [
        {
          role: "system",
          content:
            "You are a portfolio assistant for Priyanka Kumari. Answer only using the provided profile context. If the answer is not present in the context, say so clearly. Return JSON with answer, citations, and confidence.",
        },
        {
          role: "user",
          content: `Question: ${question}\n\nProfile Context:\n${contextText}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "portfolio_answer",
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              citations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    section: { type: "string" },
                  },
                  required: ["id", "title", "section"],
                  additionalProperties: false,
                },
              },
              confidence: { type: "number" },
            },
            required: ["answer", "citations", "confidence"],
            additionalProperties: false,
          },
        },
      },
    });

    const text = completion.output_text || "";
    return parseJsonResponse(text);
  }

  return {
    answer:
      "The backend is not configured with a model provider. Set OPENAI_API_KEY or GEMINI_API_KEY in the server environment.",
    citations: [],
    confidence: 0.2,
  };
};
