import { useState } from "react";
import { Eye, Network, Layers, GitMerge, ScanLine, Activity, type LucideIcon } from "lucide-react";

interface VisionStage {
  id: string;
  name: string;
  detail: string;
  icon: LucideIcon;
}

const VISION_STAGES: VisionStage[] = [
  { id: "img", name: "IMAGE", detail: "High-resolution fundus input matrix (512×512×3)", icon: Eye },
  {
    id: "feat",
    name: "FEATURE EXTRACTION",
    detail: "Multi-scale shallow convolutional feature maps capturing localized texture",
    icon: ScanLine,
  },
  {
    id: "trans",
    name: "TRANSFORMER",
    detail: "Shifted window (Swin) self-attention for long-range spatial dependencies",
    icon: Network,
  },
  {
    id: "unet",
    name: "U-NET DECODER",
    detail: "Skip connections with hierarchical residual deconvolution",
    icon: GitMerge,
  },
  {
    id: "seg",
    name: "SEGMENTATION",
    detail: "Pixel-level blood vessel and lesion probability mask output",
    icon: Layers,
  },
];

export function SegmentationVisual() {
  const [activeStage, setActiveStage] = useState(4); // default to segmentation mask

  return (
    <div className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 sm:p-7 overflow-hidden backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-primary)]/90 font-medium">
            COMPUTER VISION SEGMENTATION
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider">
          SWIN TRANSFORMER + U-NET
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Abstract Retinal Segmentation Canvas */}
        <div className="md:col-span-5 relative h-52 sm:h-60 rounded-xl border border-[var(--border-color)] bg-[var(--ink)] p-4 flex flex-col items-center justify-center overflow-hidden">
          {/* Concentric retinal grid circles */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.8"
            />
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            <circle
              cx="50"
              cy="50"
              r="18"
              fill="none"
              stroke="rgba(255,106,0,0.25)"
              strokeWidth="0.8"
            />
            <circle cx="50" cy="50" r="4.5" fill="var(--accent)" opacity="0.8" />

            {/* Abstract Blood Vessel Tree in orange and monochrome tones */}
            <path
              d="M 50 50 Q 38 28 22 20 M 50 50 Q 62 28 78 18 M 50 50 Q 35 68 18 78 M 50 50 Q 66 68 82 82"
              fill="none"
              stroke={activeStage >= 3 ? "var(--accent)" : "rgba(255,255,255,0.18)"}
              strokeWidth={activeStage >= 3 ? "1.6" : "1"}
              strokeDasharray={activeStage >= 3 ? "none" : "2 2"}
              className="transition-all duration-500"
            />

            {/* Microvascular branches */}
            <path
              d="M 38 28 Q 30 15 15 12 M 62 28 Q 72 15 88 12 M 35 68 Q 25 80 12 88 M 66 68 Q 75 80 88 88"
              fill="none"
              stroke={activeStage >= 4 ? "var(--accent-hover)" : "rgba(255,255,255,0.08)"}
              strokeWidth={activeStage >= 4 ? "1.2" : "0.7"}
              strokeDasharray={activeStage >= 4 ? "none" : "1 3"}
              className="transition-all duration-500"
            />

            {/* Orange Lesion Overlays when Segmentation is active */}
            {activeStage === 4 && (
              <>
                <circle
                  cx="34"
                  cy="36"
                  r="5"
                  fill="var(--accent)"
                  fillOpacity="0.4"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  className="animate-pulse"
                />
                <circle
                  cx="68"
                  cy="40"
                  r="4"
                  fill="var(--accent)"
                  fillOpacity="0.4"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  className="animate-pulse"
                />
                <circle
                  cx="42"
                  cy="68"
                  r="6"
                  fill="var(--accent)"
                  fillOpacity="0.4"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  className="animate-pulse"
                />
              </>
            )}
          </svg>

          {/* Canvas Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>RES: 512×512</span>
            <span className="text-[var(--accent)] font-semibold">
              {activeStage === 4 ? "MASK: OPTIMIZED DICE LOSS" : "FEATURE REPRESENTATION"}
            </span>
          </div>
        </div>

        {/* Pipeline Sequence Stages */}
        <div className="md:col-span-7 flex flex-col gap-2">
          {VISION_STAGES.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = activeStage === idx;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300 focus:outline-none cursor-pointer ${
                  isCurrent
                    ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_16px_rgba(255,106,0,0.25)] scale-[1.01]"
                    : "border-[var(--border-color)] bg-[var(--surface-raised)]/60 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-raised)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">0{idx + 1}</span>
                  <Icon
                    size={14}
                    className={isCurrent ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}
                  />
                  <div>
                    <span
                      className={`block font-mono text-xs font-semibold ${
                        isCurrent ? "text-[var(--accent)]" : "text-[var(--text-primary)] group-hover:text-[var(--accent)]"
                      }`}
                    >
                      {st.name}
                    </span>
                    <span className="block text-[11px] text-[var(--text-muted)] leading-snug font-mono">
                      {st.detail}
                    </span>
                  </div>
                </div>
                <Activity
                  size={12}
                  className={`shrink-0 transition-opacity ${
                    isCurrent ? "text-[var(--accent)] opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
