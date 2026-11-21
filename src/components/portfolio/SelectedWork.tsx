import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
import { SectionHeader } from "./SectionHeader";
import { useMediaQuery } from "../../hooks/use-media-query";
import { useVisible } from "../../hooks/use-visible";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
// Keep in sync with the showcase media query in styles.css.
const showcaseQuery =
  "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

function projectScrollDistance(track: HTMLElement, stage: HTMLElement) {
  // Reserve one stage height for pinning and another for the Experience cover.
  return Math.max(0, track.clientHeight - stage.clientHeight * 2);
}

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
          className="group/btn inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 font-mono text-xs font-semibold text-white uppercase tracking-wider transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_22px_rgba(255,106,0,0.45)] hover:-translate-y-0.5"
        >
          <span>LIVE DEMO</span>
          <ExternalLink
            size={14}
            className="transition-transform duration-300 group-hover/btn:rotate-12"
          />
        </a>
      )}

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
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
function DesktopShowcase({
  active,
  enabled,
  onChange,
}: {
  active: number;
  enabled: boolean;
  onChange: (index: number) => void;
}) {
  const N = PROJECTS.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const tabFillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 3D Scroll-driven Laptop Physics
  // lidAngle: 50° (closed forward) -> 0° (90° straight upright)
  const [lidAngle, setLidAngle] = useState(50);
  const [openProgress, setOpenProgress] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const visible = useVisible(trackRef, "0px", enabled);

  useEffect(() => {
    if (!enabled || !visible) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const { top } = track.getBoundingClientRect();
      const viewportHeight = stage.clientHeight;
      const revealDistance = viewportHeight * 0.9;
      if (track.dataset["workVisible"] !== "true") {
        track.dataset["workVisible"] = String(top <= viewportHeight * 0.68);
      }
      const reveal = 1 - Math.pow(1 - clamp((revealDistance - top) / revealDistance), 3);
      setLidAngle((1 - reveal) * 50);
      setOpenProgress(reveal);

      const travel = projectScrollDistance(track, stage);
      const cover = viewportHeight > 0 ? clamp((-top - travel) / viewportHeight) : 0;
      stage.style.opacity = String(1 - clamp((cover - 0.25) / 0.75));
      const rawPosition = travel > 0 ? clamp(-top / travel) * (N - 1) : 0;
      const currentProject = Math.min(Math.max(0, N - 2), Math.floor(rawPosition));
      const transition = clamp((rawPosition - currentProject - 0.25) / 0.5);
      const position = currentProject + transition * transition * (3 - 2 * transition);
      onChange(Math.round(position));
      tabFillRefs.current.forEach((fill, index) => {
        if (fill) fill.style.transform = `scaleY(${clamp(1 - Math.abs(position - index))})`;
      });
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${N > 1 ? position / (N - 1) : 1})`;
      }
    };
    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      cancelAnimationFrame(frame);
    };
  }, [N, enabled, onChange, visible]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const idx = clamp(i, 0, N - 1);
      const top = track.getBoundingClientRect().top + window.scrollY;
      const total = projectScrollDistance(track, stage);
      const target = top + (N > 1 ? (idx / (N - 1)) * total : 0);
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [N],
  );

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;

    const r = e.currentTarget.getBoundingClientRect();
    setMouseTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const project = PROJECTS[clamp(active, 0, N - 1)] ?? PROJECTS[0]!;

  return (
    <div
      ref={trackRef}
      className="work-showcase relative"
      style={{ height: `calc(${100 + Math.max(0, N - 1) * 50}svh + var(--work-overlap, 0px))` }}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
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

        <div className="work-stage-layout relative mx-auto flex h-full w-full max-w-7xl flex-col px-6 lg:px-10 pt-24 pb-8 z-10">
          {/* ── Giant outlined project number positioned at the RIGHT side ── */}
          <span
            key={`num-${active}`}
            aria-hidden="true"
            className="work-stage-number work-in pointer-events-none absolute right-4 xl:right-8 bottom-4 select-none font-bold leading-none tracking-[-0.06em] text-[13rem] xl:text-[17rem] text-right"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--text-primary) 16%, transparent)",
              zIndex: 0,
            }}
          >
            {project.number}
          </span>

          <SectionHeader
            label="02 / Selected Work"
            caption="What I’ve built"
            className="border-b border-[var(--border-color)] pb-4"
          >
            <span className="whitespace-nowrap text-xs tabular-nums text-[var(--text-primary)]">
              <span className="font-semibold text-[var(--accent)]">{project.number}</span>
              <span className="text-[var(--text-muted)]"> / {String(N).padStart(2, "0")}</span>
            </span>
          </SectionHeader>

          {/* ── Body ─────────────────────────────────── */}
          <div className="work-stage-project grid min-h-0 flex-1 grid-cols-12 items-center gap-6 xl:gap-10 py-6">
            {/* Left: project index rail */}
            <nav
              aria-label="Projects"
              className="work-stage-rail col-span-1 flex h-full flex-col items-center justify-center gap-3"
            >
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
                      active === i
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover/tab:text-[var(--text-primary)]"
                    }`}
                  >
                    {p.number}
                  </span>
                  <span className="work-stage-rail-meter relative h-14 w-[2px] overflow-hidden rounded-full bg-[var(--border-color)]">
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
            <div
              key={`text-${active}`}
              className="work-stage-details col-span-4 flex min-w-0 flex-col justify-center pr-4"
            >
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
                className="work-stage-actions work-in mt-7 pt-6 border-t border-[var(--border-color)]"
                style={{ animationDelay: "290ms" }}
              >
                <ProjectActions project={project} />
              </div>
            </div>

            {/* Right: Realistic 3D Laptop Mockup with scroll-driven opening effect */}
            <div
              className="col-span-7 flex h-full items-center justify-center"
              onPointerMove={onMove}
              onPointerLeave={() => setMouseTilt({ x: 0, y: 0 })}
            >
              <div className="work-stage-mockup w-full max-w-[880px] pb-10">
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
              {active < N - 1 ? "SCROLL TO EXPLORE" : "Last project"}
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
function MobileCarousel({
  active,
  enabled,
  onChange,
}: {
  active: number;
  enabled: boolean;
  onChange: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const revealRef = useScrollReveal<HTMLDivElement>(undefined, String(enabled));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const goTo = useCallback((index: number, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current;
    const card = scroller?.children[index] as HTMLElement | undefined;
    if (!scroller || !card) return;
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior,
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!enabled || !scroller) return;
    const selected = Math.max(
      0,
      [...scroller.children].findIndex((card) => card.hasAttribute("data-active")),
    );
    goTo(selected, "instant");
    const onScroll = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIndex = 0;
      let bestDistance = Infinity;
      Array.from(scroller.children).forEach((element, index) => {
        const card = element as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (distance < bestDistance) {
          bestIndex = index;
          bestDistance = distance;
        }
      });
      onChange(bestIndex);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [enabled, goTo, onChange]);

  const browse = (index: number) => goTo(index, reducedMotion ? "instant" : "smooth");

  return (
    <div ref={revealRef} className="work-carousel py-16 sm:py-24">
      <div data-scroll-reveal className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="02 / Selected Work"
          caption="What I’ve built"
          className="border-b border-[var(--border-color)] pb-4 mb-8"
        />
      </div>

      <div data-scroll-depth data-mobile-scroll-reveal>
        <div
          data-scroll-visual
          ref={scrollerRef}
          className="relative no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-6 scroll-px-6 -my-2"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-active={active === i ? "" : undefined}
              className={`group shrink-0 snap-center w-[88%] sm:w-[75%] rounded-2xl border bg-[var(--surface)] p-4 sm:p-5 transition-all duration-500 ease-editorial ${
                active === i
                  ? "border-[var(--accent)]/50 shadow-[0_14px_38px_-8px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.06),0_0_24px_rgba(232,93,0,0.22)] dark:shadow-[0_22px_48px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(232,93,0,0.25)] ring-1 ring-[var(--accent)]/25 scale-100"
                  : "border-[var(--border-color)] shadow-sm opacity-85 scale-[0.98]"
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
              <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
                {p.description}
              </p>
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
      </div>

      {/* Controls */}
      <div
        data-scroll-reveal
        className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-[var(--text-muted)]">Swipe to explore</span>
          <div className="flex items-center gap-2">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                id={`work-dot-${p.id}`}
                type="button"
                aria-label={`Go to project ${p.number}`}
                onClick={() => browse(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ease-editorial ${
                  active === i
                    ? "w-8 bg-[var(--accent)]"
                    : "w-3 bg-[var(--border-color)] hover:bg-[var(--text-muted)]"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="work-mobile-prev"
            type="button"
            aria-label="Previous project"
            onClick={() => browse(active - 1)}
            disabled={active === 0}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            id="work-mobile-next"
            type="button"
            aria-label="Next project"
            onClick={() => browse(active + 1)}
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
  const showcase = useMediaQuery(showcaseQuery);
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="relative border-t border-[var(--border-color)]">
      <DesktopShowcase enabled={showcase} active={active} onChange={setActive} />
      <MobileCarousel enabled={!showcase} active={active} onChange={setActive} />
    </section>
  );
}
