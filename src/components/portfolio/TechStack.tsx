import { useState, useRef } from "react";
import { TECH_STACK, type TechItem } from "./portfolioData";
import { TechIcon } from "./TechIcons";
import { useScrollReveal } from "./useScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { ChevronLeft, ChevronRight, Layers, LayoutGrid } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   Mobile Compact Micro-Capsule: Sleek, high-density badge
   ──────────────────────────────────────────────────────────── */
function MobileTechCapsule({ item }: { item: TechItem }) {
  const hasLogo = Boolean(item.officialLogo);

  return (
    <div className="group relative flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/90 p-2.5 transition-all duration-200 active:scale-[0.98] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-raised)]">
      {/* Official Logo or Monogram in compact squircle */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-raised)] transition-transform group-hover:scale-105">
        {hasLogo ? (
          <TechIcon name={item.officialLogo || ""} size={18} />
        ) : (
          <span className="font-mono text-[10px] font-bold text-[var(--accent)]">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
            {item.category}
          </span>
          {item.isConcept && (
            <span className="shrink-0 font-mono text-[7px] uppercase tracking-wider text-[var(--accent)] border border-[var(--accent)]/30 rounded px-1 py-0.2 bg-[var(--accent)]/10">
              CONCEPT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [mobileMode, setMobileMode] = useState<"deck" | "grid">("grid");

  const categories = [
    "ALL",
    "Languages",
    "AI / ML",
    "Frameworks",
    "Database",
    "Tools",
    "Practices",
  ];

  const specificCategories = categories.filter((c) => c !== "ALL");

  const filteredItems =
    selectedCategory === "ALL"
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === selectedCategory);

  const activeDeckIndex = Math.max(specificCategories.indexOf(selectedCategory), 0);
  const currentDeckCategory = specificCategories[activeDeckIndex] ?? "Languages";
  const prevDeckIndex =
    (activeDeckIndex - 1 + specificCategories.length) % specificCategories.length;
  const nextDeckIndex = (activeDeckIndex + 1) % specificCategories.length;
  const goToPrevCategory = () =>
    setSelectedCategory(specificCategories[prevDeckIndex] ?? currentDeckCategory);
  const goToNextCategory = () =>
    setSelectedCategory(specificCategories[nextDeckIndex] ?? currentDeckCategory);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "ALL") setMobileMode("grid");
  };

  const selectDeck = () => {
    setSelectedCategory(currentDeckCategory);
    setMobileMode("deck");
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (event.touches.length === 1 && touch) {
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStart.current = null;
    }
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const dx = start.x - touch.clientX;
    const dy = start.y - touch.clientY;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goToNextCategory();
    else goToPrevCategory();
  };

  const sectionRef = useScrollReveal(undefined, `${selectedCategory}:${mobileMode}`);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative border-t border-[var(--border-color)] py-20 sm:py-28 lg:py-32 overflow-hidden transition-colors duration-500"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          reveal
          label="04 / Tech Stack"
          caption="What I use"
          className="border-b border-[var(--border-color)] pb-4 mb-10 sm:mb-14"
        />

        <div
          data-scroll-reveal
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12"
        >
          <div data-scroll-item>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.035em] text-[var(--text-primary)] uppercase">
              TECH STACK
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[52ch]">
              Production technologies, frameworks, and architecture patterns utilized in real
              software and applied AI projects.
            </p>
          </div>

          {/* Desktop Category Filter Pills */}
          <div
            data-scroll-item
            className="hidden sm:flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[var(--accent)] text-white font-semibold shadow-[0_0_14px_rgba(255,106,0,0.4)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── MOBILE ONLY: Horizontal Category Rail & Interactive Compact Views ── */}
        <div className="sm:hidden mb-6">
          {/* Horizontal scrollable category bar (single line, no multi-row wrapping) */}
          <div
            data-scroll-reveal
            className="no-scrollbar -mx-6 px-6 flex items-center gap-1.5 overflow-x-auto pb-2 scroll-px-6"
          >
            {categories.map((cat) => {
              const count =
                cat === "ALL"
                  ? TECH_STACK.length
                  : TECH_STACK.filter((t) => t.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={`mobile-tab-${cat}`}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  aria-pressed={isActive}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[var(--accent)] text-white font-semibold shadow-[0_0_12px_rgba(255,106,0,0.35)]"
                      : "border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-muted)]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${isActive ? "bg-white/20 text-white" : "bg-[var(--surface-raised)] text-[var(--text-muted)]"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle (Swipe Deck vs Compact Matrix) */}
          <div className="flex items-center justify-between mt-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {mobileMode === "deck"
                ? `CATEGORY DECK (${activeDeckIndex + 1} OF ${specificCategories.length})`
                : selectedCategory === "ALL"
                  ? "ALL TECHNOLOGIES"
                  : `${selectedCategory} MATRIX`}
            </span>
            <div className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-0.5">
              <button
                type="button"
                onClick={selectDeck}
                aria-pressed={mobileMode === "deck"}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
                  mobileMode === "deck"
                    ? "bg-[var(--accent)] text-white font-semibold shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Layers size={11} />
                <span>DECK</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMode("grid")}
                aria-pressed={mobileMode === "grid"}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
                  mobileMode === "grid"
                    ? "bg-[var(--accent)] text-white font-semibold shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <LayoutGrid size={11} />
                <span>COMPACT</span>
              </button>
            </div>
          </div>

          {/* Mode A: Unique Swipeable Category Deck */}
          {mobileMode === "deck" && (
            <div data-scroll-depth>
              <div
                data-scroll-visual
                onTouchStart={onTouchStart}
                onTouchCancel={() => {
                  touchStart.current = null;
                }}
                onTouchEnd={onTouchEnd}
                className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/70 p-4 shadow-sm touch-pan-y"
              >
                {/* Deck Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                        0{activeDeckIndex + 1} / {currentDeckCategory}
                      </span>
                      <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--accent)]">
                        {filteredItems.length} {filteredItems.length === 1 ? "TECH" : "TECHS"}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mt-0.5">
                      SWIPE ⇄ OR USE BUTTONS
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={goToPrevCategory}
                      aria-label="Previous Category"
                      className="grid size-7 place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-muted)] active:scale-95 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextCategory}
                      aria-label="Next Category"
                      className="grid size-7 place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-muted)] active:scale-95 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Compact micro-capsule grid */}
                <div className="grid grid-cols-2 gap-2 min-h-[180px] content-start">
                  {filteredItems.map((item) => (
                    <MobileTechCapsule key={`${item.category}-${item.name}`} item={item} />
                  ))}
                </div>

                {/* Deck Footer Stepper */}
                <div className="mt-4 flex flex-wrap items-center gap-2 justify-between border-t border-[var(--border-color)] pt-3">
                  <button
                    type="button"
                    onClick={goToPrevCategory}
                    className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <ChevronLeft size={12} />
                    <span>{specificCategories[prevDeckIndex]}</span>
                  </button>

                  {/* Stepper Dots */}
                  <div className="flex items-center gap-1">
                    {specificCategories.map((cat, idx) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        aria-pressed={activeDeckIndex === idx}
                        aria-label={`Jump to ${cat}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeDeckIndex === idx
                            ? "w-5 bg-[var(--accent)]"
                            : "w-1.5 bg-[var(--border-color)]"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextCategory}
                    className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>{specificCategories[nextDeckIndex]}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode B: Compact Micro-Capsule Grid */}
          {mobileMode === "grid" && (
            <div>
              {selectedCategory === "ALL" ? (
                <div className="space-y-4">
                  {specificCategories.map((cat) => {
                    const items = TECH_STACK.filter((t) => t.category === cat);
                    return (
                      <div key={`grouped-${cat}`} data-scroll-depth>
                        <div
                          data-scroll-visual
                          className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/60 p-3"
                        >
                          <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2 mb-2.5">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                              {cat}
                            </span>
                            <span className="font-mono text-[9px] text-[var(--text-muted)]">
                              {items.length} items
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {items.map((item) => (
                              <MobileTechCapsule
                                key={`${item.category}-${item.name}`}
                                item={item}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div data-scroll-depth>
                  <div data-scroll-visual className="grid grid-cols-2 gap-2">
                    {filteredItems.map((item) => (
                      <MobileTechCapsule key={`${item.category}-${item.name}`} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── DESKTOP ONLY: Interactive Wall Grid (Original Layout Preserved) ── */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 [--scroll-columns:3] md:[--scroll-columns:4] lg:[--scroll-columns:6] gap-3 sm:gap-4">
          {filteredItems.map((item) => {
            const hasLogo = Boolean(item.officialLogo);

            return (
              <div key={`${item.category}-${item.name}`} data-scroll-reveal="tile">
                <div
                  data-scroll-item
                  className="group relative flex h-full flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-4 transition-[translate,background-color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:bg-[var(--surface-raised)] hover:shadow-[0_8px_24px_rgba(255,106,0,0.12)]"
                >
                  {/* Top: Category or Concept indicator */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {item.category}
                    </span>
                    {item.isConcept ? (
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--accent)] border border-[var(--accent)]/30 rounded px-1.5 py-0.2 bg-[var(--accent)]/10">
                        CONCEPT
                      </span>
                    ) : (
                      <span className="size-1 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Center: Official Logo or Typographic Mark */}
                  <div className="my-5 flex items-center justify-center">
                    {hasLogo ? (
                      <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_0_16px_rgba(255,106,0,0.2)]">
                        <TechIcon name={item.officialLogo || ""} size={24} />
                      </div>
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] font-mono text-xs font-bold text-[var(--accent)] transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent)]/50">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Name */}
                  <div className="border-t border-[var(--border-color)]/60 pt-2 text-center">
                    <span className="font-mono text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
