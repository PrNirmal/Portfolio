import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ExternalLink,
  Github,
  Clock,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
} from "lucide-react";
import { PROJECTS, type ProjectItem } from "./portfolioData";
import { LaptopMockup } from "./LaptopMockup";
import { useScrollReveal } from "./useScrollReveal";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ────────────────────────────────────────────────────────────
   Shared: project CTAs
   ──────────────────────────────────────────────────────────── */
function ProjectActions({ project }: { project: ProjectItem }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.liveDemo && (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noreferrer"
          id={`work-${project.id}-demo`}
          className="group/btn inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 font-mono text-xs font-semibold text-white uppercase tracking-wider transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_22px_rgba(255,106,0,0.45)] hover:-translate-y-0.5"
        >
          <span>LIVE DEMO</span>
          <ExternalLink size={14} className="transition-transform duration-300 group-hover/btn:rotate-12" />
        </a>
      )}

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          id={`work-${project.id}-github`}
          className="group/btn inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-raised)] px-4 py-2.5 font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5"
        >
          <Github size={14} />
          <span>GITHUB REPO</span>
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </a>
      )}

      {project.statusNote && !project.liveDemo && !project.github && (
        <div className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--accent-border)] bg-[var(--accent-soft)] px-3.5 py-2.5 font-mono text-xs text-[var(--text-secondary)] tracking-wider uppercase">
          <Clock size={13} className="text-[var(--accent)] animate-pulse" />
          <span>{project.statusNote}</span>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Desktop: pinned scroll-driven 3D laptop showcase
   ──────────────────────────────────────────────────────────── */
function DesktopShowcase() {
  const N = PROJECTS.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const tabFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // 3D Scroll-driven Laptop Physics
  // lidAngle: 50° (closed forward) -> 0° (90° straight upright)
  const [lidAngle, setLidAngle] = useState(50);
  const [openProgress, setOpenProgress] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // Targets (set instantly by scroll / mouse) and smoothed values (eased each frame)
  const target = useRef({ reveal: 0, pos: 0, mx: 0, my: 0 });
  const current = useRef({ reveal: 0, pos: 0, mx: 0, my: 0 });
  const loopRef = useRef(0);

  const render = useCallback(() => {
    const c = current.current;
    const easedReveal = 1 - Math.pow(1 - c.reveal, 3);
    setLidAngle((1 - easedReveal) * 50);
    setOpenProgress(easedReveal);
    setMouseTilt({ x: c.mx, y: c.my });

    tabFillRefs.current.forEach((fill, i) => {
      if (!fill) return;
      fill.style.transform = `scaleY(${clamp(1 - Math.abs(c.pos - i))})`;
    });
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${N > 1 ? c.pos / (N - 1) : 1})`;
    }
    setActive((prev) => {
      const next = Math.round(c.pos);
      return prev === next ? prev : next;
    });
  }, [N]);

  const startLoop = useCallback(() => {
    if (loopRef.current) return;
    const tick = () => {
      const t = target.current;
      const c = current.current;
      const k = 0.09; // smoothing factor — lower = silkier
      c.reveal += (t.reveal - c.reveal) * k;
      c.pos += (t.pos - c.pos) * k;
      c.mx += (t.mx - c.mx) * 0.08;
      c.my += (t.my - c.my) * 0.08;

      const settled =
        Math.abs(t.reveal - c.reveal) < 0.0005 &&
        Math.abs(t.pos - c.pos) < 0.0005 &&
        Math.abs(t.mx - c.mx) < 0.0005 &&
        Math.abs(t.my - c.my) < 0.0005;

      if (settled) Object.assign(c, t);
      render();
      loopRef.current = settled ? 0 : requestAnimationFrame(tick);
    };
    loopRef.current = requestAnimationFrame(tick);
  }, [render]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // ── 1. Lid reveal: starts as the section enters, fully open once pinned
      const enterThreshold = viewportH * 0.9;
      target.current.reveal = clamp((enterThreshold - rect.top) / enterThreshold);

      // ── 2. Pinned project advancement with dwell plateaus
      const total = track.offsetHeight - viewportH;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      let pos = 0;
      if (N > 1) {
        const raw = p * (N - 1);
        const i = Math.min(N - 2, Math.floor(raw));
        const f = raw - i;
        pos = i + easeInOut(clamp((f - 0.25) / 0.5));
      }
      target.current.pos = pos;
      startLoop();
    };

    // Jump straight to the right state on mount (no animation from 0)
    measure();
    Object.assign(current.current, target.current);
    render();

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      loopRef.current = 0;
    };
  }, [N, render, startLoop]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = clamp(i, 0, N - 1);
      const top = track.getBoundingClientRect().top + window.scrollY;
      const total = track.offsetHeight - window.innerHeight;
      const target = top + (N > 1 ? (idx / (N - 1)) * total : 0);
      window.scrollTo({ top: target + 1, behavior: "smooth" });
    },
    [N],
  );

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    target.current.mx = (e.clientX - r.left) / r.width - 0.5;
    target.current.my = (e.clientY - r.top) / r.height - 0.5;
    startLoop();
  };

  const onLeave = () => {
    target.current.mx = 0;
    target.current.my = 0;
    startLoop();
  };

  const project = PROJECTS[clamp(active, 0, N - 1)] ?? PROJECTS[0]!;

  return (
    <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${Math.max(1, N) * 140}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient accent glow that drifts per project */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[520px] w-[520px] rounded-full blur-[120px] transition-all duration-[1200ms] ease-editorial"
          style={{
            background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
            top: active % 2 === 0 ? "20%" : "45%",
            left: active % 2 === 0 ? "55%" : "35%",
          }}
        />

        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-6 lg:px-10 pt-24 pb-8 z-10">
          {/* ── Giant outlined project number positioned at the RIGHT side ── */}
          <span
            key={`num-${active}`}
            aria-hidden="true"
            className="work-in pointer-events-none absolute right-4 xl:right-8 bottom-4 select-none font-bold leading-none tracking-[-0.06em] text-[13rem] xl:text-[17rem] text-right"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--text-primary) 16%, transparent)",
              zIndex: 0,
            }}
          >
            {project.number}
          </span>

          {/* ── Header ───────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                02 / SELECTED WORK
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-orange-pulse" />
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                ENGINEERED SYSTEMS &amp; CASE STUDIES
              </span>
              <span className="font-mono text-xs tabular-nums text-[var(--text-primary)]">
                <span className="text-[var(--accent)] font-semibold">{project.number}</span>
                <span className="text-[var(--text-muted)]"> / {String(N).padStart(2, "0")}</span>
              </span>
            </div>
          </div>

          {/* ── Body ─────────────────────────────────── */}
          <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-6 xl:gap-10 py-6">
            {/* Left: project index rail */}
            <nav aria-label="Projects" className="col-span-1 flex h-full flex-col items-center justify-center gap-3">
              <button
                id="work-prev"
                type="button"
                aria-label="Previous project"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronUp size={15} />
              </button>
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  id={`work-tab-${p.id}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show project ${p.number}: ${p.title}`}
                  aria-current={active === i}
                  className="group/tab flex flex-col items-center gap-2 py-1"
                >
                  <span
                    className={`font-mono text-[11px] font-semibold tabular-nums transition-colors duration-300 ${
                      active === i ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover/tab:text-[var(--text-primary)]"
                    }`}
                  >
                    {p.number}
                  </span>
                  <span className="relative h-14 w-[2px] overflow-hidden rounded-full bg-[var(--border-color)]">
                    <span
                      ref={(el) => {
                        tabFillRefs.current[i] = el;
                      }}
                      className="absolute inset-0 origin-top bg-[var(--accent)]"
                      style={{ transform: `scaleY(${i === 0 ? 1 : 0})` }}
                    />
                  </span>
                </button>
              ))}
              <button
                id="work-next"
                type="button"
                aria-label="Next project"
                onClick={() => goTo(active + 1)}
                disabled={active === N - 1}
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronDown size={15} />
              </button>
            </nav>

            {/* Center-left: animated project details */}
            <div key={`text-${active}`} className="col-span-4 flex flex-col justify-center pr-4">
              <span
                className="work-in font-mono text-xs font-bold tracking-[0.22em] text-[var(--accent)]"
                style={{ animationDelay: "0ms" }}
              >
                PROJECT {project.number}
              </span>

              <h3
                className="work-in mt-3 text-3xl xl:text-[2.35rem] font-bold tracking-[-0.025em] text-[var(--text-primary)] leading-[1.08]"
                style={{ animationDelay: "70ms" }}
              >
                {project.title}
              </h3>

              <span
                className="work-in mt-4 inline-flex w-fit rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]"
                style={{ animationDelay: "120ms" }}
              >
                {project.category}
              </span>

              <p
                className="work-in mt-5 text-[15px] text-[var(--text-muted)] leading-relaxed max-w-[42ch]"
                style={{ animationDelay: "170ms" }}
              >
                {project.description}
              </p>

              <div className="work-in mt-6" style={{ animationDelay: "230ms" }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]/70 block mb-2.5">
                  STACK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-[var(--border-color)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="work-in mt-7 pt-6 border-t border-[var(--border-color)]"
                style={{ animationDelay: "290ms" }}
              >
                <ProjectActions project={project} />
              </div>
            </div>

            {/* Right: Realistic 3D Laptop Mockup with scroll-driven opening effect */}
            <div
              className="col-span-7 flex h-full items-center justify-center"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div className="w-full max-w-[880px] pb-10">
                <LaptopMockup
                  projects={PROJECTS}
                  activeProjectIndex={active}
                  lidAngle={lidAngle}
                  openProgress={openProgress}
                  mouseTilt={mouseTilt}
                />
              </div>
            </div>
          </div>

          {/* ── Footer: progress ──────────────────────── */}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              <MousePointer2 size={12} className="text-[var(--accent)]" />
              {active < N - 1 ? "SCROLL TO EXPLORE" : "END OF CASE STUDIES"}
            </span>
            <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--border-color)]">
              <div
                ref={progressRef}
                className="absolute inset-0 origin-left bg-[var(--accent)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {openProgress < 0.95 ? "REVEALING DEMO" : "90° STRAIGHT VIEW"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Mobile / tablet: swipeable snap carousel
   ──────────────────────────────────────────────────────────── */
function MobileCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAutoScroll = useCallback(() => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    setIsPaused(true);
  }, []);

  const resumeAfterDelay = useCallback((delay = 3500) => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, delay);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = scrollerRef.current;
    const targetIdx = (i + PROJECTS.length) % PROJECTS.length;
    const child = el?.children[targetIdx] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll loop for mobile carousel
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % PROJECTS.length;
        goTo(next);
        return next;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, goTo]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  return (
    <div className="lg:hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="sr flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4 mb-8"
          data-sr="up"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              02 / SELECTED WORK
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            SWIPE TO EXPLORE →
          </span>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onTouchStart={pauseAutoScroll}
        onTouchEnd={() => resumeAfterDelay(3500)}
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={() => resumeAfterDelay(2000)}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-6 scroll-px-6 -my-2"
      >
        {PROJECTS.map((p, i) => (
          <article
            key={p.id}
            className={`group shrink-0 snap-center w-[88%] sm:w-[75%] rounded-2xl border bg-[var(--surface)] p-4 sm:p-5 transition-all duration-500 ease-editorial ${
              active === i
                ? "border-[var(--accent)]/50 shadow-[0_14px_38px_-8px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.06),0_0_24px_rgba(232,93,0,0.22)] dark:shadow-[0_22px_48px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(232,93,0,0.25)] ring-1 ring-[var(--accent)]/25 scale-100"
                : "border-[var(--border-color)] shadow-sm opacity-55 scale-[0.96]"
            }`}
          >
            <div className="pb-2">
              <LaptopMockup project={p} openProgress={1} lidAngle={0} />
            </div>
            <div className="mt-4 sm:mt-5 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.22em] text-[var(--accent)] whitespace-nowrap shrink-0">
                PROJECT {p.number}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--text-muted)] truncate min-w-0 text-right">
                {p.category}
              </span>
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] leading-tight">
              {p.title}
            </h3>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--border-color)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-[var(--border-color)]">
              <ProjectActions project={p} />
            </div>
          </article>
        ))}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              id={`work-dot-${p.id}`}
              type="button"
              aria-label={`Go to project ${p.number}`}
              onClick={() => {
                pauseAutoScroll();
                goTo(i);
                resumeAfterDelay();
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ease-editorial ${
                active === i ? "w-8 bg-[var(--accent)]" : "w-3 bg-[var(--border-color)] hover:bg-[var(--text-muted)]"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            id="work-mobile-prev"
            type="button"
            aria-label="Previous project"
            onClick={() => {
              pauseAutoScroll();
              goTo(active - 1);
              resumeAfterDelay();
            }}
            disabled={active === 0}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            id="work-mobile-next"
            type="button"
            aria-label="Next project"
            onClick={() => {
              pauseAutoScroll();
              goTo(active + 1);
              resumeAfterDelay();
            }}
            disabled={active === PROJECTS.length - 1}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SelectedWork() {
  const sectionRef = useScrollReveal();

  return (
    // NOTE: no overflow-hidden here — it would break the sticky pinning.
    <section ref={sectionRef} id="work" className="relative border-t border-[var(--border-color)]">
      <DesktopShowcase />
      <MobileCarousel />
    </section>
  );
}
