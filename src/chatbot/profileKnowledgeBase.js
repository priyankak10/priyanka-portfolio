import { getExperienceTimeline, portfolioData } from "../data/portfolioData";

const suggestionPrompts = [
  "What are Priyanka's core skills?",
  "Give me a recruiter summary of Priyanka.",
  "Why is Priyanka a strong fit for a full-stack role?",
  "What has Priyanka owned end to end?",
  "How can I contact Priyanka?",
  "How many years of experience does Priyanka have?",
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
  recruiter: [
    "recruiter",
    "hire",
    "fit",
    "candidate",
    "qualified",
    "strengths",
    "summary",
    "introduce",
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
    "leadership",
    "led",
    "lead",
    "end-to-end",
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
    sidebar,
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
    {
      id: "strengths-overview",
      section: "recruiter",
      title: "Strengths overview",
      content: `Core stack: ${sidebar.coreStack.join(", ")}. Engineering tools: ${sidebar.engineeringTools.join(", ")}. Strengths: ${sidebar.strengths.join(", ")}.`,
      answer: [
        `- Core stack: ${sidebar.coreStack.join(", ")}`,
        `- Engineering tools: ${sidebar.engineeringTools.join(", ")}`,
        `- Strengths: ${sidebar.strengths.join(", ")}`,
      ].join("\n"),
      keywords: [
        "strengths",
        "core stack",
        "engineering tools",
        ...sidebar.coreStack,
        ...sidebar.engineeringTools,
        ...sidebar.strengths,
      ],
    },
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
const knowledgeById = Object.fromEntries(
  knowledgeBase.map((entry) => [entry.id, entry]),
);

const getExperienceLabel = () => {
  const matched = portfolioData.summary.match(/\b\d+\+ years\b/i);

  if (matched) {
    return matched[0];
  }

  const earliestRole = getExperienceTimeline().at(-1);
  if (!earliestRole?.parsedStartDate) return "multiple years";

  const now = new Date();
  const totalMonths =
    (now.getFullYear() - earliestRole.parsedStartDate.getFullYear()) * 12 +
    (now.getMonth() - earliestRole.parsedStartDate.getMonth());
  const years = Math.max(1, Math.floor(totalMonths / 12));

  return `${years}+ years`;
};

const experienceLabel = getExperienceLabel();

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

const citationsFromIds = (ids) =>
  unique(ids)
    .map((id) => knowledgeById[id])
    .filter(Boolean)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      section: entry.section,
    }));

const recruiterIntents = [
  {
    id: "recruiter-summary",
    phrases: ["recruiter summary", "candidate summary", "quick summary"],
    tokens: ["recruiter", "summary", "introduce"],
    answer: () =>
      `Priyanka Kumari is a ${portfolioData.personal.title} with ${experienceLabel} of experience across React frontend, Node.js microservices, and .NET systems. Based on the profile, her strongest ownership areas include the CI Tool WebUI, core CI Tool backend API services, frontend ownership of APK Infra Client, and end-to-end ownership of PLCPortal.`,
    citations: [
      "personal-summary",
      "experience-timeline",
      "ownership-1",
      "ownership-2",
      "ownership-3",
      "ownership-4",
    ],
    matchedSections: ["summary", "experience", "projects"],
  },
  {
    id: "full-stack-fit",
    phrases: [
      "full stack role",
      "full-stack role",
      "good fit",
      "strong fit",
      "why hire",
    ],
    tokens: [
      "hire",
      "fit",
      "qualified",
      "candidate",
      "fullstack",
      "full-stack",
    ],
    answer: () =>
      [
        "Based on the profile data, Priyanka looks strongest for full-stack and platform engineering roles.",
        `- ${experienceLabel} of experience across React frontend, Node.js microservices, and .NET systems.`,
        "- Hands-on ownership of both UI and backend systems, including CI Tool WebUI and core CI Tool API services.",
        "- Delivery experience in CI/CD, Kubernetes migration, platform reliability, and operational workflows.",
        "- Strong match for roles that need end-to-end execution, production ownership, and fast adaptation to new tools.",
      ].join("\n"),
    citations: [
      "personal-summary",
      "skills-overview",
      "strengths-overview",
      "ownership-0",
      "ownership-1",
      "ownership-2",
    ],
    matchedSections: ["summary", "skills", "recruiter", "projects"],
  },
  {
    id: "ownership-summary",
    phrases: ["end to end", "end-to-end", "owned end to end"],
    tokens: ["ownership", "owned", "owner", "leadership", "lead", "led"],
    answer: () =>
      [
        "Ownership areas called out in the profile include:",
        "- CI Tool WebUI: created and owned the WebUI aligned to CI reporting and tracking requirements.",
        "- CI Tool Backend Microservices: owned API services across PR, program, build, and queue domains.",
        "- APK Infra Client UI: frontend ownership for app-tag based compatibility automation workflows.",
        "- PLCPortal: end-to-end ownership of features, bug fixes, enhancements, and production changes.",
        "- Kubernetes migration: led exploration, pre-production testing, and production rollout from Cloud Foundry to self-hosted Kubernetes.",
      ].join("\n"),
    citations: [
      "ownership-0",
      "ownership-1",
      "ownership-2",
      "ownership-3",
      "ownership-4",
    ],
    matchedSections: ["projects"],
  },
  {
    id: "experience-years",
    phrases: ["how many years", "years of experience"],
    tokens: ["years", "experience", "senior", "seniority"],
    answer: () =>
      `The profile summary states ${experienceLabel} of experience. The experience timeline in the portfolio shows Priyanka at Intel Technology India Pvt. Ltd. from Dec 2016 to Present.`,
    citations: ["personal-summary", "experience-timeline"],
    matchedSections: ["summary", "experience"],
  },
  {
    id: "strengths-summary",
    phrases: ["what are her strengths", "core strengths", "best at"],
    tokens: ["strengths", "strongest", "specialize", "specialise"],
    answer: () =>
      [
        "The profile highlights these strengths:",
        `- Technical focus: ${portfolioData.sidebar.coreStack.join(", ")}`,
        `- Delivery style: ${portfolioData.sidebar.strengths.join(", ")}`,
        `- Engineering environment: ${portfolioData.sidebar.engineeringTools.join(", ")}`,
      ].join("\n"),
    citations: ["strengths-overview", "skills-overview"],
    matchedSections: ["recruiter", "skills"],
  },
];

const resolveRecruiterIntent = (normalizedQuestion, queryTokens) => {
  const tokenSet = new Set(queryTokens);

  const matchedIntent = recruiterIntents.find((intent) => {
    const phraseMatched = intent.phrases.some((phrase) =>
      normalizedQuestion.includes(phrase),
    );
    const tokenMatched = intent.tokens.some((token) => tokenSet.has(token));

    return phraseMatched || tokenMatched;
  });

  if (!matchedIntent) return null;

  return {
    answer: matchedIntent.answer(),
    citations: citationsFromIds(matchedIntent.citations),
    matchedSections: matchedIntent.matchedSections,
    confidence: "high",
  };
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

  const recruiterIntentAnswer = resolveRecruiterIntent(
    normalizedQuestion,
    expandedTokens,
  );

  if (recruiterIntentAnswer) {
    return recruiterIntentAnswer;
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
