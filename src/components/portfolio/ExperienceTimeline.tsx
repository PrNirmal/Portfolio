import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Building2 } from "lucide-react";
import { EXPERIENCES } from "./portfolioData";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spineLineRef = useRef<HTMLDivElement | null>(null);
  const spineTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !spineLineRef.current) return;

    const ctx = gsap.context(() => {
      // Section header reveal
      const header = sectionRef.current!.querySelector(".exp-header");
      if (header) {
        gsap.fromTo(
          header,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: header, start: "top 88%" },
          }
        );
      }

      // Section title reveal with blur
      const title = sectionRef.current!.querySelector(".exp-title");
      if (title) {
        gsap.fromTo(
          title,
          { y: 24, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            clearProps: "filter",
            scrollTrigger: { trigger: title, start: "top 88%" },
          }
        );
      }

      // Section subtitle reveal
      const subtitle = sectionRef.current!.querySelector(".exp-subtitle");
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: subtitle, start: "top 88%" },
          }
        );
      }

      const entries = sectionRef.current!.querySelectorAll<HTMLElement>(".experience-entry");
      if (entries.length > 0) {
        const firstEntry = entries[0];
        const lastEntry = entries[entries.length - 1];

        if (firstEntry && lastEntry) {
          // Function to update line height to reach the bottom of the last experience entry
          const updateLineHeight = () => {
            const totalDistance = (lastEntry.offsetTop + lastEntry.offsetHeight) - 14 - 10;
            if (spineTrackRef.current) {
              spineTrackRef.current.style.height = `${Math.max(totalDistance, 60)}px`;
            }
            if (spineLineRef.current) {
              spineLineRef.current.style.height = `${Math.max(totalDistance, 60)}px`;
            }
          };

          updateLineHeight();

          // Draw the vertical spine line downward precisely as scroll progresses through the entire experience section
          gsap.fromTo(
            spineLineRef.current!,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: firstEntry,
                start: "top 65%",
                endTrigger: lastEntry,
                end: "bottom 70%",
                scrub: 0.3,
                onRefresh: updateLineHeight,
              },
            }
          );
        }

        // Track active entry based on scroll position
        entries.forEach((entry, idx) => {
          ScrollTrigger.create({
            trigger: entry,
            start: "top 65%",
            end: "bottom 65%",
            onEnter: () => setActiveIdx(idx),
            onEnterBack: () => setActiveIdx(idx),
          });
        });
      }

      // Stagger experience entries — each entry triggers independently
      entries.forEach((entry) => {
        // The entire entry card slides up
        gsap.fromTo(
          entry,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 88%",
            },
          }
        );

        // Inner items stagger within the entry
        const items = entry.querySelectorAll(".reveal-item");
        gsap.fromTo(
          items,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative border-t border-[var(--border-color)] py-20 sm:py-28 lg:py-32 overflow-hidden transition-colors duration-500"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="exp-header flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              03 / EXPERIENCE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            ENGINEERING TRACK RECORD
          </span>
        </div>

        {/* Narrative Title */}
        <div className="mb-14">
          <h2 className="exp-title text-3xl sm:text-5xl font-bold tracking-[-0.035em] text-[var(--text-primary)] uppercase">
            EXPERIENCE
          </h2>
          <p className="exp-subtitle mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[50ch]">
            Professional software development and applied AI engineering across enterprise SaaS and production architectures.
          </p>
        </div>

        {/* Editorial Timeline (No bloated SaaS cards) */}
        <div className="relative mt-12">
          {/* Static track */}
          <div
            ref={spineTrackRef}
            aria-hidden="true"
            className="absolute left-[7px] top-3.5 w-[2px] bg-[var(--border-color)] opacity-40 rounded-full"
          />

          {/* Scroll-drawn vertical timeline line */}
          <div
            ref={spineLineRef}
            aria-hidden="true"
            className="absolute left-[7px] top-3.5 w-[2px] origin-top bg-gradient-to-b from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] shadow-[0_0_10px_var(--accent)] rounded-full"
          />

          <div className="space-y-16 sm:space-y-20">
            {EXPERIENCES.map((item, index) => {
              const isActive = activeIdx === index;
              const isPassed = activeIdx > index;

              return (
                <div
                  key={index}
                  className="experience-entry relative pl-8 sm:pl-10 group"
                >
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

                <div className="border-b border-[var(--border-color)] pb-10">
                  {/* DATE & STATUS */}
                  <div className="reveal-item flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
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
                  <div className="reveal-item mt-3 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                      <Building2 size={15} className="text-[var(--accent)]" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  {/* SUBTITLE */}
                  <p className="reveal-item mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                    {item.subtitle}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="reveal-item mt-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[68ch]">
                    {item.description}
                  </p>

                  {/* COMPACT AREAS / STACK */}
                  <div className="reveal-item mt-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-2.5">
                      {item.isCurrent ? "CORE RESPONSIBILITIES & DOMAINS:" : "PRODUCTION TECHNOLOGIES:"}
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
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
