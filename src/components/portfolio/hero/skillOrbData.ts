export interface SkillNodeData {
  cat: string;
  label: string;
  sub: string;
  text: string;
  chips: string[];
  used: string;
}

// Top to bottom on the orb: intelligence up top, delivery at the base
export const ORDER = ["orch", "web", "ret", "api", "mobile", "data", "ml", "infra"] as const;

export type SkillId = (typeof ORDER)[number];

export const DATA: Record<SkillId, SkillNodeData> = {
  orch: {
    cat: "Intelligence",
    label: "LLM orchestration",
    sub: "LangChain, LangGraph",
    text: "I design agent workflows and structured prompts that keep model output accurate, consistent and on brief.",
    chips: ["LangChain", "LangGraph", "LLM APIs", "Prompt engineering"],
    used: "Interview Analyzer, retail AI features",
  },
  web: {
    cat: "Interfaces",
    label: "Web apps",
    sub: "React, TypeScript",
    text: "I build React and TypeScript dashboards, workflows and AI features that enterprise retail teams use every day.",
    chips: ["React", "TypeScript", "REST integration"],
    used: "Retail SaaS platform, Interview Analyzer",
  },
  ret: {
    cat: "Intelligence",
    label: "Retrieval (RAG)",
    sub: "Embeddings, vector search",
    text: "I turn company documents into searchable knowledge, so answers come with context and sources instead of guesses.",
    chips: ["Embeddings", "ChromaDB", "Semantic search"],
    used: "Retail SaaS platform, AI Document Assistant",
  },
  api: {
    cat: "Services",
    label: "Backend services",
    sub: "FastAPI, REST",
    text: "I build FastAPI services that run core retail workflows: business logic, integrations, database operations and secure flows.",
    chips: ["FastAPI", "REST APIs", "Python"],
    used: "Retail SaaS platform, all AI projects",
  },
  mobile: {
    cat: "Interfaces",
    label: "Mobile apps",
    sub: "Flutter, Firebase",
    text: "I shipped a production Flutter app with reusable widgets, structured state management, sign-in and push messaging.",
    chips: ["Flutter", "Firebase Auth", "Firestore", "Cloud Messaging"],
    used: "BlastOut internship, retail SaaS platform",
  },
  data: {
    cat: "Data and models",
    label: "Data stores",
    sub: "MySQL, Firestore",
    text: "I pick the right store for each job: relational tables, document data and vector indexes behind one application.",
    chips: ["MySQL", "Firestore", "ChromaDB"],
    used: "BlastOut projects",
  },
  ml: {
    cat: "Data and models",
    label: "Machine learning",
    sub: "TensorFlow, Swin",
    text: "I trained a Swin Transformer U-Net for diabetic retinopathy segmentation and measured it with IoU and Dice score.",
    chips: ["TensorFlow", "Swin Transformer", "U-Net"],
    used: "Research project, 2025",
  },
  infra: {
    cat: "Delivery",
    label: "Delivery and quality",
    sub: "Docker, GCP, Playwright",
    text: "I ship containerized services and protect every release with automated end-to-end tests.",
    chips: ["Docker", "GCP", "CI/CD", "Playwright", "Git"],
    used: "BlastOut internship and full-time work",
  },
};
