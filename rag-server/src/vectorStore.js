const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "about",
  "can",
  "did",
  "do",
  "does",
  "for",
  "from",
  "get",
  "good",
  "has",
  "have",
  "her",
  "how",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "or",
  "she",
  "should",
  "tell",
  "the",
  "their",
  "to",
  "what",
  "where",
  "who",
  "with",
]);

const tokenize = (value) => {
  const normalized = normalize(value);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
};

const lexicalScore = (question, document) => {
  const questionTokens = tokenize(question);
  const docText = `${document.title} ${document.content} ${(document.keywords ?? []).join(" ")}`;
  const docTokens = new Set(tokenize(docText));
  const normalizedQuestion = normalize(question);
  const normalizedDoc = normalize(document.content);

  let score = 0;
  questionTokens.forEach((token) => {
    if (docTokens.has(token)) score += 4;
    if (normalizedDoc.includes(token)) score += 1;
  });

  if (normalizedDoc.includes(normalizedQuestion)) {
    score += 10;
  }

  return score;
};

export const findRelevantDocuments = (documents, question, topK = 5) => {
  return documents
    .map((document) => ({
      ...document,
      score: lexicalScore(question, document),
    }))
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
};
