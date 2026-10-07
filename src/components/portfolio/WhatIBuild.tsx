import { useState } from "react";
import { ArrowUpRight, Sparkles, Layers, Activity } from "lucide-react";
import { WHAT_I_BUILD_ITEMS } from "./portfolioData";
import { useScrollReveal } from "./useScrollReveal";

export function WhatIBuild() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeItem = WHAT_I_BUILD_ITEMS[activeIndex] ?? WHAT_I_BUILD_ITEMS[0]!;
  const sectionRef = useScrollReveal(".wib-reveal");

  return (
    <section ref={sectionRef} id="capabilities" className="relative border-t border-[var(--border-color)] py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="wib-reveal flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              02 / WHAT I BUILD
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            DISCIPLINES & CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Interactive List */}
          <div className="lg:col-span-7">
            <div className="wib-reveal mb-10">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.035em] text-[var(--text-primary)] uppercase">
                WHAT I BUILD
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[50ch]">
                Architectures connecting resilient software engineering, production SaaS products, and applied generative intelligence.
              </p>
            </div>

            {/* Editorial List */}
            <div className="divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
              {WHAT_I_BUILD_ITEMS.map((item, idx) => {
                const isActive = activeIndex === idx;

                return (
                  <div
                    key={item.number}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`group relative py-7 sm:py-8 px-3 sm:px-5 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--surface-raised)]/70 text-[var(--text-primary)]"
                        : "opacity-60 hover:opacity-100 hover:bg-[var(--surface)]/40"
                    }`}
                  >
                    {/* Active orange left border indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] transition-all duration-300 ${
                        isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span
                          className={`font-mono text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                            isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                          }`}
                        >
                          {item.number}
                        </span>

                        <div>
                          <h3
                            className={`text-xl sm:text-2xl font-bold tracking-[-0.02em] transition-colors duration-300 ${
                              isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {item.title}
                          </h3>

                          {/* Short Description */}
                          <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                            {item.description}
                          </p>

                          {/* Extended Detail revealed on active item */}
                          {isActive && (
                            <p className="mt-2.5 text-xs font-mono text-[var(--text-secondary)] leading-relaxed max-w-[52ch]">
                              → {item.detail}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full border transition-all duration-300 ${
                            isActive
                              ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_14px_rgba(255,106,0,0.4)] translate-x-0.5 -translate-y-0.5"
                              : "border-[var(--border-color)] text-[var(--text-muted)]"
                          }`}
                        >
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Capability Visual */}
          <div className="wib-reveal lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 mb-6">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-primary)] font-medium">
                    CAPABILITY TOPOLOGY
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider">
                  0{activeIndex + 1} / 04 ACTIVE
                </span>
              </div>

              {/* Title representation */}
              <div className="mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  CURRENT DOMAIN:
                </span>
                <h4 className="mt-1 text-xl font-bold tracking-tight text-[var(--accent)] font-mono">
                  {activeItem.title}
                </h4>
              </div>

              {/* Visualized Sub-Nodes Layout */}
              <div className="grid grid-cols-2 gap-3.5">
                {activeItem.items.map((nodeName, index) => (
                  <div
                    key={`${activeItem.title}-${nodeName}-${index}`}
                    className="relative flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] p-4 transition-all duration-300 hover:border-[var(--accent)]/50 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                        SUB-NODE 0{index + 1}
                      </span>
                      <span className="size-1.5 rounded-full bg-[var(--accent)] opacity-80" />
                    </div>

                    <div className="my-3">
                      <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {nodeName}
                      </span>
                    </div>

                    <div className="border-t border-[var(--border-color)]/70 pt-2 flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
                      <span>SYNCED</span>
                      <Activity size={10} className="text-[var(--accent)]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Descriptive Footer Bar */}
              <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--ink)]/70 p-3.5 font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
                <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-[10px] uppercase tracking-wider mb-1">
                  <Layers size={12} />
                  <span>ARCHITECTURE INSIGHT</span>
                </div>
                <span>{activeItem.detail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
