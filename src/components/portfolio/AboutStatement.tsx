import { ABOUT_CONTENT } from "./portfolioData";
import { useScrollReveal } from "./useScrollReveal";

export function AboutStatement() {
  const sectionRef = useScrollReveal(".about-reveal");
  return (
    <section ref={sectionRef} id="about" className="relative border-t border-[var(--border-color)] py-20 sm:py-28 lg:py-32 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="about-reveal flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              07 / ABOUT
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            PHILOSOPHY & PERSPECTIVE
          </span>
        </div>

        <div className="about-reveal max-w-4xl relative">
          <span
            aria-hidden="true"
            className="absolute -top-12 -left-6 font-mono text-8xl font-extrabold text-[var(--text-primary)]/[0.03] select-none pointer-events-none"
          >
            07
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-tight">
            "{ABOUT_CONTENT.headline}"
          </h2>

          <div className="mt-8 border-l-2 border-[var(--accent)] pl-6">
            <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-[55ch]">
              {ABOUT_CONTENT.supporting}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
