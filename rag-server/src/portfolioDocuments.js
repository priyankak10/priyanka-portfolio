import {
  portfolioData,
  getExperienceTimeline,
} from "../../src/data/portfolioData.js";

const buildSkillSections = () =>
  Object.entries(portfolioData.skills ?? {}).map(([group, items]) => ({
    id: `skill-${group}`,
    section: "skills",
    title: `${group} skills`,
    content: `${group} skills include ${items.join(", ")}.`,
    keywords: [group, ...items],
  }));

const buildDocuments = () => {
  const experienceTimeline = getExperienceTimeline();

  const baseDocuments = [
    {
      id: "profile-summary",
      section: "summary",
      title: "Profile summary",
      content: `${portfolioData.personal.name} is a ${portfolioData.personal.title} based in ${portfolioData.personal.location}. ${portfolioData.summary}`,
      keywords: [
        portfolioData.personal.name,
        portfolioData.personal.title,
        portfolioData.personal.location,
        "profile",
        "summary",
      ],
    },
    {
      id: "contact-details",
      section: "contact",
      title: "Contact details",
      content: `${portfolioData.personal.name} can be contacted by email at ${portfolioData.personal.email}, by phone at ${portfolioData.personal.phone}, on LinkedIn at ${portfolioData.personal.linkedin}, and on GitHub at ${portfolioData.personal.github}.`,
      keywords: ["contact", "email", "phone", "linkedin", "github"],
    },
    {
      id: "skills-overview",
      section: "skills",
      title: "Skills overview",
      content: Object.entries(portfolioData.skills ?? {})
        .map(([group, items]) => `${group}: ${items.join(", ")}`)
        .join(". "),
      keywords: ["skills", "stack", "technologies", "frontend", "backend"],
    },
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
      keywords: ["experience", "career", "timeline", "years"],
    },
    {
      id: "strengths-overview",
      section: "recruiter",
      title: "Strengths overview",
      content: `Core stack: ${portfolioData.sidebar.coreStack.join(", ")}. Engineering tools: ${portfolioData.sidebar.engineeringTools.join(", ")}. Strengths: ${portfolioData.sidebar.strengths.join(", ")}.`,
      keywords: [
        "strengths",
        "skills",
        "core stack",
        ...portfolioData.sidebar.strengths,
      ],
    },
    {
      id: "awards-certifications",
      section: "awards",
      title: "Awards and certifications",
      content: `Awards and certifications: ${portfolioData.awardsAndCertifications.join("; ")}.`,
      keywords: [
        "awards",
        "certifications",
        "recognition",
        ...portfolioData.awardsAndCertifications,
      ],
    },
  ];

  const experienceDocs = (portfolioData.experience ?? []).map(
    (item, index) => ({
      id: `experience-${index}`,
      section: "experience",
      title: `${item.role} at ${item.company}`,
      content: `${item.role} at ${item.company} in ${item.location} from ${item.startDate} to ${item.endDate}. Highlights: ${item.highlights.join(" ")}`,
      keywords: [item.role, item.company, item.location, ...item.highlights],
    }),
  );

  const ownershipDocs = (portfolioData.keyOwnership ?? []).map(
    (item, index) => ({
      id: `ownership-${index}`,
      section: "projects",
      title: item.area,
      content: `${item.area}. ${item.impact.join(" ")}`,
      keywords: [item.area, "ownership", "impact", ...item.impact],
    }),
  );

  const educationDocs = (portfolioData.education ?? []).map((item, index) => ({
    id: `education-${index}`,
    section: "education",
    title: item.degree,
    content: `${item.degree} from ${item.institute} in ${item.year}${item.score ? ` with ${item.score}` : ""}.`,
    keywords: [item.degree, item.institute, item.year, "education"],
  }));

  const resumeDoc = {
    id: "resume-links",
    section: "resume",
    title: "Resume downloads",
    content: (portfolioData.resumes ?? [])
      .map(
        (item) =>
          `${item.title}: ${item.description}. Preview: ${item.previewUrl}. Downloads: ${item.downloads
            .map((download) => `${download.label} at ${download.href}`)
            .join(", ")}.`,
      )
      .join(" "),
    keywords: [
      "resume",
      "cv",
      "download",
      "preview",
      ...(portfolioData.resumes ?? []).map((item) => item.title),
    ],
  };

  return [
    ...baseDocuments,
    ...buildSkillSections(),
    ...experienceDocs,
    ...ownershipDocs,
    ...educationDocs,
    resumeDoc,
  ];
};

export const portfolioDocuments = buildDocuments();

export const buildContextFromDocuments = (documents) =>
  documents
    .map(
      (document) =>
        `Section: ${document.title} (${document.section})\n${document.content}`,
    )
    .join("\n\n");
