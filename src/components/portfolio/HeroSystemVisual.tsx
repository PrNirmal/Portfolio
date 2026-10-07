import { useState, useEffect } from "react";
import { Terminal, Database, Cpu, Globe, Layers, Activity, Sparkles, ArrowDown, type LucideIcon } from "lucide-react";

interface PipelineNode {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  icon: LucideIcon;
  x: number;
  y: number;
  description: string;
  telemetry: string;
}

const FLOW_NODES: PipelineNode[] = [
  {
    id: "software",
    label: "SOFTWARE",
    sublabel: "CLIENT SYSTEMS",
    category: "FRONTEND & MOBILE",
    icon: Globe,
    x: 15,
    y: 20,
    description: "Web & Cross-Platform Mobile Applications",
    telemetry: "React 19 / TypeScript / Flutter / Modern UI Engine",
  },
  {
    id: "api",
    label: "API",
    sublabel: "COMMUNICATION",
    category: "REST & WEBSOCKETS",
    icon: Terminal,
    x: 32,
    y: 50,
    description: "High-throughput asynchronous REST services",
    telemetry: "FastAPI / Python / RBAC Security / Sub-20ms latency",
  },
  {
    id: "data",
    label: "DATA",
    sublabel: "PERSISTENCE & VECTOR",
    category: "STORAGE ENGINE",
    icon: Database,
    x: 50,
    y: 80,
    description: "Relational tables + dense vector embeddings",
    telemetry: "PostgreSQL / Firebase Firestore / ChromaDB collections",
  },
  {
    id: "intelligence",
    label: "INTELLIGENCE",
    sublabel: "COGNITIVE LAYER",
    category: "APPLIED AI & RAG",
    icon: Cpu,
    x: 68,
    y: 50,
    description: "LLM synthesis & semantic retrieval pipelines",
    telemetry: "RAG / Generative AI / Context Synthesis / Grounded Prompting",
  },
  {
    id: "application",
    label: "APPLICATION",
    sublabel: "PRODUCTION OS",
    category: "ENTERPRISE WORKFLOW",
    icon: Sparkles,
    x: 85,
    y: 20,
    description: "Deployed SaaS products and intelligent automation",
    telemetry: "Enterprise SaaS / Business Systems / Automated Operations",
  },
];

export function HeroSystemVisual() {
  const [activeNode, setActiveNode] = useState<PipelineNode>(FLOW_NODES[1] ?? FLOW_NODES[0]!);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Background slow signal circulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % FLOW_NODES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/90 p-5 sm:p-7 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-colors duration-300">
      {/* Background ambient orange glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,106,0,0.14)_0%,transparent_70%)] blur-2xl"
      />

      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--text-primary)]/90 font-medium">
            SYSTEM PIPELINE ARCHITECTURE
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          <Activity
            size={12}
            className="text-[var(--accent)] animate-spin"
            style={{ animationDuration: "14s" }}
          />
          <span className="tracking-wider">SIGNAL ACTIVE</span>
        </div>
      </div>

      {/* Pipeline Sequence Subtitle */}
      <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <span>SOFTWARE → API → DATA → INTELLIGENCE → APPLICATION</span>
        <span className="hidden sm:inline text-[var(--accent)]">INTERACTIVE BUS</span>
      </div>

      {/* SVG Canvas and Interactive Diagram */}
      <div className="relative mt-2 h-64 sm:h-72 w-full select-none">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Subtle Grid Lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Primary Pipeline Flow Path:
              SOFTWARE (15,20) -> API (32,50) -> DATA (50,80) -> INTELLIGENCE (68,50) -> APPLICATION (85,20) */}
          <path
            d="M 15 20 L 32 50 L 50 80 L 68 50 L 85 20"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />

          {/* Feedback/Integration Loop back from APPLICATION to SOFTWARE */}
          <path
            d="M 85 20 Q 50 2 15 20"
            fill="none"
            stroke="rgba(255,106,0,0.15)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />

          {/* Animated Orange Signal on Path */}
          <path
            d="M 15 20 L 32 50 L 50 80 L 68 50 L 85 20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeDasharray="4 24"
            className="animate-flow-dash"
          />

          {/* Direct API to Intelligence High-Speed Link */}
          <line
            x1="32"
            y1="50"
            x2="68"
            y2="50"
            stroke="rgba(255, 106, 0, 0.25)"
            strokeWidth="1"
            strokeDasharray="1 3"
          />
          <line
            x1="32"
            y1="50"
            x2="68"
            y2="50"
            stroke="var(--accent)"
            strokeWidth="1.4"
            strokeDasharray="3 16"
            className="animate-flow-dash"
          />
        </svg>

        {/* Nodes Layer */}
        {FLOW_NODES.map((node, idx) => {
          const Icon = node.icon;
          const isSelected = activeNode.id === node.id;
          const isPulsing = pulseIndex === idx;

          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => setActiveNode(node)}
              onClick={() => setActiveNode(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer transition-all duration-300 focus:outline-none ${
                isSelected ? "scale-110 z-20" : "hover:scale-105 z-10"
              }`}
              aria-label={`Inspect ${node.label} node`}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-2.5 sm:p-3 transition-all duration-300 ${
                  isSelected
                    ? "border border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] shadow-[0_0_22px_rgba(255,106,0,0.4)]"
                    : isPulsing
                      ? "border border-[var(--accent)]/50 bg-[var(--surface-raised)] text-[var(--text-primary)]"
                      : "border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-secondary)] group-hover:border-[var(--accent)]/50 group-hover:text-[var(--accent)]"
                }`}
              >
                <Icon size={17} className="sm:size-5" />
                {(isSelected || isPulsing) && (
                  <span className="absolute -top-1 -right-1 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-80" />
                    <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
                  </span>
                )}
              </div>

              <span
                className={`mt-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] transition-colors whitespace-nowrap ${
                  isSelected
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {node.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Telemetry Readout Footer */}
      <div className="mt-2 rounded-xl border border-[var(--border-color)] bg-[var(--ink)]/80 p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
              NODE:
            </span>
            <span className="font-mono text-xs font-bold text-[var(--text-primary)] tracking-wide">
              {activeNode.label}
            </span>
            <span className="rounded border border-[var(--border-color)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)] uppercase">
              {activeNode.category}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-[10px]">
            <Layers size={11} className="text-[var(--accent)]" />
            <span>{activeNode.description}</span>
          </div>
        </div>
        <p className="mt-2 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
          → <span className="text-[var(--accent)]">TELEMETRY:</span> {activeNode.telemetry}
        </p>
      </div>
    </div>
  );
}
