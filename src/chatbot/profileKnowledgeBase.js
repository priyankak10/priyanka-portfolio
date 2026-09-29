import { getExperienceTimeline, portfolioData } from "../data/portfolioData";

const suggestionPrompts = [
  "What are Priyanka's core skills?",
  "Summarize Priyanka's current role.",
  "Which projects did Priyanka own?",
  "How can I contact Priyanka?",
  "What awards and certifications does Priyanka have?",
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "about",
  "can",
  "did",
  "do",
  "for",
  "from",
  "get",
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
  "tell",
  "the",
  "their",
  "to",
  "what",
  "where",
  "who",
  "with",
]);

const queryAliases = {
  contact: [
    "contact",
    "email",
    "phone",
    "reach",
    "connect",
    "linkedin",
    "github",
  ],
  skills: [
    "skill",
    "skills",
    "stack",
    "technology",
    "technologies",
    "tools",
    "frontend",
    "backend",
  ],
  summary: ["summary", "profile", "about", "introduction", "intro"],
  experience: [
    "experience",
    "career",
    "work",
    "role",
    "roles",
    "job",
    "jobs",
    "company",
    "companies",
  ],
  projects: [
    "project",
    "projects",
    "ownership",
    "impact",
    "owned",
    "delivered",
  ],
  education: ["education", "degree", "college", "school", "university"],
  awards: ["award", "awards", "certification", "certifications", "recognition"],
  resume: ["resume", "cv", "download", "preview"],
};

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
};

const titleCase = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const unique = (items) => [...new Set(items.filter(Boolean))];

const buildSkillLine = (label, items) => `${label}: ${items.join(", ")}`;

const buildKnowledgeBase = () => {
  const {
    personal,
    summary,
    skills,
    experience,
    keyOwnership,
    education,
    awardsAndCertifications,
    resumes,
  } = portfolioData;

  const experienceTimeline = getExperienceTimeline();
  const skillGroups = Object.entries(skills ?? {}).map(([group, items]) => ({
    group,
    label: titleCase(group.replace(/([A-Z])/g, " $1")),
    items,
  }));

  return [
    {
      id: "personal-summary",
      section: "summary",
      title: "Profile summary",
      content: `${personal.name} is a ${personal.title} based in ${personal.location}. ${summary}`,
      answer: `${personal.name} is a ${personal.title} based in ${personal.location}. ${summary}`,
      keywords: [
        personal.name,
        personal.title,
        personal.location,
        "profile",
        "summary",
        "about",
      ],
    },
    {
      id: "personal-contact",
      section: "contact",
      title: "Contact details",
      content: `${personal.name} can be contacted by email at ${personal.email}, by phone at ${personal.phone}, on LinkedIn at ${personal.linkedin}, and on GitHub at ${personal.github}.`,
      answer: [
        `- Email: ${personal.email}`,
        `- Phone: ${personal.phone}`,
        `- LinkedIn: ${personal.linkedin}`,
        `- GitHub: ${personal.github}`,
      ].join("\n"),
      keywords: [
        "contact",
        "email",
        "phone",
        "linkedin",
        "github",
        personal.email,
        personal.phone,
      ],
    },
    {
      id: "skills-overview",
      section: "skills",
      title: "Skills overview",
      content: skillGroups
        .map(({ label, items }) => buildSkillLine(label, items))
        .join(". "),
      answer: skillGroups
        .map(({ label, items }) => `- ${buildSkillLine(label, items)}`)
        .join("\n"),
      keywords: [
        "skills",
        "stack",
        "technology",
        ...skillGroups.flatMap(({ items }) => items),
      ],
    },
    ...skillGroups.map(({ group, label, items }) => ({
      id: `skill-${group}`,
      section: "skills",
      title: `${label} skills`,
      content: `${label} skills include ${items.join(", ")}.`,
      answer: `- ${label}: ${items.join(", ")}.`,
      keywords: [label, group, ...items],
    })),
    ...experience.map((item, index) => ({
      id: `experience-${index}`,
      section: "experience",
      title: `${item.role} at ${item.company}`,
      content: `${item.role} at ${item.company} in ${item.location} from ${item.startDate} to ${item.endDate}. Highlights: ${item.highlights.join(" ")}`,
      answer: `${item.role} at ${item.company} in ${item.location} from ${item.startDate} to ${item.endDate}. Key work includes ${item.highlights
        .slice(0, 2)
        .join(" ")}`,
      keywords: [
        item.role,
        item.company,
        item.location,
        "experience",
        "work",
        ...item.highlights,
      ],
    })),
    {
      id: "experience-timeline",
      section: "experience",
      title: "Experience timeline",
      content: experienceTimeline
        .map(
          (item) =>
            `${item.role} at ${item.company} (${item.dateRangeLabel}, ${item.durationLabel}) in ${item.location}`,
        )
        .join(". "),
      answer: experienceTimeline
        .map(
          (item) =>
            `${item.role} at ${item.company} (${item.dateRangeLabel}, ${item.durationLabel})`,
        )
        .join(". "),
      keywords: [
        "timeline",
        "experience",
        "duration",
        ...experienceTimeline.flatMap((item) => [item.role, item.company]),
      ],
    },
    ...keyOwnership.map((item, index) => ({
      id: `ownership-${index}`,
      section: "projects",
      title: item.area,
      content: `${item.area}. ${item.impact.join(" ")}`,
      answer: `${item.area}: ${item.impact.slice(0, 2).join(" ")}`,
      keywords: [item.area, "ownership", "project", "impact", ...item.impact],
    })),
    ...education.map((item, index) => ({
      id: `education-${index}`,
      section: "education",
      title: item.degree,
      content: `${item.degree} from ${item.institute} in ${item.year}${item.score ? ` with ${item.score}` : ""}.`,
      answer: `${item.degree} from ${item.institute} in ${item.year}${item.score ? ` with ${item.score}` : ""}.`,
      keywords: [
        item.degree,
        item.institute,
        item.year,
        "education",
        "degree",
        "school",
        "college",
      ],
    })),
    {
      id: "awards-certifications",
      section: "awards",
      title: "Awards and certifications",
      content: `Awards and certifications: ${awardsAndCertifications.join("; ")}.`,
      answer: `Awards and certifications: ${awardsAndCertifications.join("; ")}.`,
      keywords: [
        "awards",
        "certifications",
        "recognition",
        ...awardsAndCertifications,
      ],
    },
    {
      id: "resume-links",
      section: "resume",
      title: "Resume downloads",
      content: resumes
        .map(
          (item) =>
            `${item.title}: ${item.description} Preview: ${item.previewUrl}. Downloads: ${item.downloads
              .map((download) => `${download.label} at ${download.href}`)
              .join(", ")}.`,
        )
        .join(" "),
      answer: resumes
        .map(
          (item) =>
            `${item.title}: preview at ${item.previewUrl}; downloads: ${item.downloads
              .map((download) => `${download.label} at ${download.href}`)
              .join(", ")}.`,
        )
        .join(" "),
      keywords: [
        "resume",
        "cv",
        "download",
        "preview",
        ...resumes.map((item) => item.title),
      ],
    },
  ].map((entry) => ({
    ...entry,
    normalizedContent: normalizeText(entry.content),
    tokens: tokenize(
      `${entry.title} ${entry.content} ${(entry.keywords ?? []).join(" ")}`,
    ),
    keywords: unique(
      (entry.keywords ?? []).flatMap((keyword) => tokenize(keyword)),
    ),
  }));
};

const knowledgeBase = buildKnowledgeBase();

const expandQueryTokens = (tokens) => {
  const expanded = new Set(tokens);

  Object.entries(queryAliases).forEach(([key, aliases]) => {
    if (aliases.some((alias) => expanded.has(alias))) {
      expanded.add(key);
      aliases.forEach((alias) => expanded.add(alias));
    }
  });

  return [...expanded];
};

const scoreChunk = (query, queryTokens, chunk) => {
  let score = 0;

  queryTokens.forEach((token) => {
    if (chunk.keywords.includes(token)) score += 7;
    if (chunk.tokens.includes(token)) score += 3;
    if (chunk.normalizedContent.includes(token)) score += 1;
  });

  if (query && chunk.normalizedContent.includes(query)) {
    score += 8;
  }

  return score;
};

const getSectionHint = (queryTokens) => {
  for (const [section, aliases] of Object.entries(queryAliases)) {
    if (
      queryTokens.includes(section) ||
      aliases.some((alias) => queryTokens.includes(alias))
    ) {
      return section;
    }
  }

  return null;
};

const selectMatches = (rankedMatches) => {
  const primaryMatch = rankedMatches[0];

  if (!primaryMatch) return [];

  const sameSectionMatches = rankedMatches.filter(
    (match) => match.section === primaryMatch.section,
  );
  const strongSectionMatches = sameSectionMatches.filter(
    (match) => match.score >= Math.max(primaryMatch.score - 8, 6),
  );

  if (primaryMatch.section === "projects") {
    return strongSectionMatches.slice(0, 3);
  }

  if (primaryMatch.section === "skills") {
    const overviewMatch =
      sameSectionMatches.find((match) => match.id === "skills-overview") ||
      primaryMatch;

    return [overviewMatch];
  }

  return [primaryMatch];
};

const formatAnswer = (matches) => {
  const primaryMatch = matches[0];

  if (!primaryMatch) return "";

  const sections = unique(matches.map((match) => match.section));

  if (sections.length === 1) {
    const [section] = sections;

    if (section === "contact") {
      return primaryMatch.answer;
    }

    if (section === "skills") {
      return primaryMatch.answer;
    }

    if (section === "projects") {
      return matches.map((match) => `- ${match.answer}`).join("\n");
    }
  }

  return matches.map((match) => match.answer ?? match.content).join(" ");
};

export const getChatSuggestions = () => suggestionPrompts;

export const answerProfileQuestion = (question) => {
  const normalizedQuestion = normalizeText(question);
  const expandedTokens = expandQueryTokens(tokenize(question));
  const sectionHint = getSectionHint(expandedTokens);

  if (!normalizedQuestion || expandedTokens.length === 0) {
    return {
      answer:
        "Ask about skills, experience, project ownership, resume links, education, awards, or contact details. I only answer from the profile data available on this site.",
      citations: [],
      matchedSections: [],
      confidence: "low",
    };
  }

  const rankedMatches = knowledgeBase
    .map((chunk) => ({
      ...chunk,
      score:
        scoreChunk(normalizedQuestion, expandedTokens, chunk) +
        (sectionHint === chunk.section ? 4 : 0),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score);

  const topScore = rankedMatches[0]?.score ?? 0;

  if (topScore < 6) {
    return {
      answer:
        "I could not find a reliable answer in the profile data. Try asking about skills, current role, ownership areas, education, awards, resume downloads, or contact details.",
      citations: [],
      matchedSections: [],
      confidence: "low",
    };
  }

  const topMatches = selectMatches(rankedMatches);

  return {
    answer: formatAnswer(topMatches),
    citations: topMatches.map((match) => ({
      id: match.id,
      title: match.title,
      section: match.section,
    })),
    matchedSections: unique(topMatches.map((match) => match.section)),
    confidence: topScore >= 14 ? "high" : "medium",
  };
};
