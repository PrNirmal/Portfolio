import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, Cpu, Search, Database, MessageSquare, Split, Zap, ArrowRight, type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface PipelineStep {
  step: string;
  name: string;
  subhead: string;
  desc: string;
  icon: LucideIcon;
  metric: string;
}

const RAG_STEPS: PipelineStep[] = [
  {
    step: "01",
    name: "DOCUMENT",
    subhead: "RAW SOURCE",
    desc: "PDF, DOCX and TXT document ingestion and layout parsing",
    icon: FileText,
    metric: "Multi-format buffer",
  },
  {
    step: "02",
    name: "INGESTION",
    subhead: "NORMALIZATION",
    desc: "Unicode normalization, whitespace cleaning and metadata tagging",
    icon: Zap,
    metric: "Lossless sanitization",
  },
  {
    step: "03",
    name: "CHUNKING",
    subhead: "TOKEN SPLITTING",
    desc: "Recursive character text splitting with semantic paragraph boundaries",
    icon: Split,
    metric: "512 tokens · 64 overlap",
  },
  {
    step: "04",
    name: "EMBEDDINGS",
    subhead: "VECTOR ENCODING",
    desc: "Dense semantic vector generation mapping sentences to vector spaces",
    icon: Database,
    metric: "Dense 1536-dim vectors",
  },
  {
    step: "05",
    name: "RETRIEVAL",
    subhead: "KNN / COSINE SEARCH",
    desc: "ChromaDB approximate nearest neighbors cosine similarity retrieval",
    icon: Search,
    metric: "Top-k semantic matches",
  },
  {
    step: "06",
    name: "LLM",
    subhead: "CONTEXT SYNTHESIS",
    desc: "Inject retrieved document chunks into guarded system instructions",
    icon: Cpu,
    metric: "Strict fact-grounded context",
  },
  {
    step: "07",
    name: "ANSWER",
    subhead: "GROUNDED OUTPUT",
    desc: "Accurate, citation-grounded response with hallucination guardrails",
    icon: MessageSquare,
    metric: "100% verified sources",
  },
];

export function RagPipelineVisual() {
  const [activeStep, setActiveStep] = useState(4); // Default to retrieval
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll-linked progression
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%",
      end: "bottom 35%",
      scrub: 0.5,
      onUpdate: (self) => {
        const stepIndex = Math.min(
          RAG_STEPS.length - 1,
          Math.floor(self.progress * RAG_STEPS.length)
        );
        setActiveStep((prev) => (prev !== stepIndex ? stepIndex : prev));
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const current = RAG_STEPS[activeStep] ?? RAG_STEPS[0]!;

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 sm:p-7 overflow-hidden backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-primary)]/90 font-medium">
            RAG ARCHITECTURE PIPELINE
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider">
          STEP 0{activeStep + 1} / 07 ACTIVE
        </span>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {RAG_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;
            const isPast = activeStep > idx;

            return (
              <div key={item.step} className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`group flex min-w-[116px] flex-col rounded-xl border p-3 text-left transition-all duration-300 focus:outline-none cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_20px_rgba(255,106,0,0.3)] scale-105"
                      : isPast
                        ? "border-[var(--accent)]/40 bg-[var(--surface-raised)]/80 text-[var(--text-primary)]"
                        : "border-[var(--border-color)] bg-[var(--surface-raised)]/50 text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        isSelected ? "text-[var(--accent)]" : isPast ? "text-[var(--accent)]/80" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {item.step}
                    </span>
                    <Icon
                      size={14}
                      className={isSelected ? "text-[var(--accent)]" : isPast ? "text-[var(--accent)]/80" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}
                    />
                  </div>

                  <span
                    className={`mt-2 font-mono text-xs font-bold tracking-wider whitespace-nowrap ${
                      isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    {item.name}
                  </span>

                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate mt-0.5">
                    {item.subhead}
                  </span>
                </button>

                {/* Connecting arrow with animated orange signal dot */}
                {idx < RAG_STEPS.length - 1 && (
                  <div className="relative flex w-5 sm:w-6 items-center justify-center shrink-0">
                    <div
                      className={`h-0.5 w-full transition-colors duration-300 ${
                        idx < activeStep ? "bg-[var(--accent)]" : "bg-[var(--border-color)]"
                      }`}
                    />
                    {idx === activeStep && (
                      <span className="absolute size-2 rounded-full bg-[var(--accent)] animate-ping" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Inspector Readout */}
      <div className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--ink)]/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)] font-semibold uppercase">
              PHASE {current.step}
            </span>
            <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
              {current.name} · {current.subhead}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)] font-mono leading-relaxed max-w-[65ch]">
            {current.desc}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="rounded-lg bg-[var(--surface)] border border-[var(--border-color)] px-3 py-1.5 font-mono text-[11px] text-[var(--accent)] font-semibold whitespace-nowrap">
            {current.metric}
          </span>
        </div>
      </div>
    </div>
  );
}
