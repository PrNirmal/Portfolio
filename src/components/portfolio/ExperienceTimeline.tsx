import { SectionHeader } from "./SectionHeader";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Building2 } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { EXPERIENCES } from "./portfolioData";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline() {
  const sectionRef = useScrollReveal();
  const spineLineRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const line = spineLineRef.current;
    if (!section || !line) return;

    const media = gsap.matchMedia(section);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const entries = Array.from(section.querySelectorAll<HTMLElement>(".experience-entry"));
      const first = entries[0];
      const last = entries.at(-1);
      if (!first || !last) return;

      let markerPositions: number[] = [];
      let previousIndex = -1;
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: first,
            start: "top 65%",
            endTrigger: last,
            end: "bottom 65%",
            scrub: true,
            onRefresh: (trigger) => {
              markerPositions = entries.map((entry) => entry.offsetTop - first.offsetTop);
              updateMarker(trigger);
            },
            onUpdate: updateMarker,
          },
        },
      );

      function updateMarker(trigger: ScrollTrigger) {
        const distance = trigger.progress * (trigger.end - trigger.start);
        const index = Math.max(
          0,
          markerPositions.filter((position) => position <= distance).length - 1,
        );
        if (index === previousIndex) return;
        previousIndex = index;
        setActiveIdx(index);
      }
    });

    return () => media.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative border-t border-[var(--border-color)] py-20 sm:py-28 lg:py-32 overflow-hidden transition-colors duration-500"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <SectionHeader
          reveal
          label="03 / Experience"
          caption="Where I’ve worked"
          className="exp-header border-b border-[var(--border-color)] pb-4 mb-10 sm:mb-14"
        />

        {/* Narrative Title */}
        <div className="mb-14" data-scroll-reveal="headline">
          <h2
            data-scroll-item
            className="exp-title text-3xl sm:text-5xl font-bold tracking-[-0.035em] text-[var(--text-primary)] uppercase"
          >
            EXPERIENCE
          </h2>
          <p
            data-scroll-item
            className="exp-subtitle mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[50ch]"
          >
            Professional software development and applied AI engineering across enterprise SaaS and
            production architectures.
          </p>
        </div>

        {/* Editorial Timeline (No bloated SaaS cards) */}
        <div className="relative mt-12">
          {/* Static track */}
          <div
            aria-hidden="true"
            className="absolute bottom-2.5 left-[7px] top-3.5 w-[2px] bg-[var(--border-color)] opacity-40 rounded-full"
          />

          {/* Scroll-drawn vertical timeline line */}
          <div
            ref={spineLineRef}
            aria-hidden="true"
            className="absolute bottom-2.5 left-[7px] top-3.5 w-[2px] origin-top bg-gradient-to-b from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] shadow-[0_0_10px_var(--accent)] rounded-full"
          />

          <div className="space-y-16 sm:space-y-20">
            {EXPERIENCES.map((item, index) => {
              const isActive = activeIdx === index;
              const isPassed = activeIdx > index;

              return (
                <div key={index} className="experience-entry relative pl-8 sm:pl-10 group">
                  {/* Node dot on timeline */}
                  <div
                    className={`timeline-dot absolute left-0 top-1.5 flex size-4 items-center justify-center rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--bg)] shadow-[0_0_14px_rgba(255,106,0,0.8)] scale-110 ring-2 ring-[var(--accent)]/30"
                        : isPassed
                          ? "border-[var(--accent)] bg-[var(--accent)]/20 shadow-[0_0_8px_rgba(255,106,0,0.35)]"
                          : "border-[var(--border-color)] bg-[var(--surface)] opacity-40"
                    }`}
                  >
                    <div
                      className={`size-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[var(--accent)] animate-ping"
                          : isPassed
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--text-muted)]"
                      }`}
                    />
                    {(isActive || isPassed) && (
                      <div className="absolute size-2 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>

                  <div data-scroll-depth="entry">
                    <div className="border-b border-[var(--border-color)] pb-10" data-scroll-visual>
                      <div data-scroll-reveal>
                        {/* DATE & STATUS */}
                        <div
                          data-scroll-item
                          className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]"
                        >
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[var(--accent)]" />
                            <span>{item.period}</span>
                          </span>
                          {item.isCurrent && (
                            <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-0.5 text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">
                              ACTIVE ROLE
                            </span>
                          )}
                        </div>

                        {/* ROLE & COMPANY */}
                        <div
                          data-scroll-item
                          className="mt-3 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
                        >
                          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {item.role}
                          </h3>
                          <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                            <Building2 size={15} className="text-[var(--accent)]" />
                            <span>{item.company}</span>
                          </div>
                        </div>

                        {/* SUBTITLE */}
                        <p
                          data-scroll-item
                          className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium"
                        >
                          {item.subtitle}
                        </p>

                        {/* DESCRIPTION */}
                        <p
                          data-scroll-item
                          className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[68ch]"
                        >
                          {item.description}
                        </p>

                        {/* COMPACT AREAS / STACK */}
                        <div data-scroll-item className="mt-6">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-2.5">
                            {item.isCurrent
                              ? "CORE RESPONSIBILITIES & DOMAINS:"
                              : "PRODUCTION TECHNOLOGIES:"}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.capabilities.map((cap) => (
                              <span
                                key={cap}
                                className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-raised)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)] transition-all duration-200 group-hover:border-[var(--accent)]/30 group-hover:text-[var(--text-primary)]"
                              >
                                {cap}
                              </span>
                            ))}
                            {item.technologies &&
                              item.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-semibold text-[var(--accent)]"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
