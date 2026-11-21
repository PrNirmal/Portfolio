import { SectionHeader } from "./SectionHeader";
import React, { useRef, useEffect, useMemo } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { Code2, Cpu, Smartphone, Database } from "lucide-react";

import { useMediaQuery } from "../../hooks/use-media-query";
import { desktopDepthQuery, useScrollReveal } from "./useScrollReveal";

const ease = [0.16, 1, 0.3, 1] as const;

interface CardItem {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  text: string;
  tags: string[];
}

const CARDS: CardItem[] = [
  {
    icon: Code2,
    title: "Software & Web Development",
    text: "FastAPI, Python, React, TypeScript REST services, asynchronous backends, and responsive client architectures.",
    tags: ["FastAPI", "Python", "React", "REST APIs"],
  },
  {
    icon: Cpu,
    title: "AI Applications & Generative AI",
    text: "Applied LLM integration, semantic retrieval-augmented generation (RAG), vector databases, and prompt orchestration.",
    tags: ["RAG Pipelines", "LLM APIs", "ChromaDB", "Prompt Engineering"],
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    text: "Cross-platform mobile application development with Flutter, cloud data synchronization, and native device performance.",
    tags: ["Flutter", "Cross-Platform", "State Management", "Firebase"],
  },
  {
    icon: Database,
    title: "Enterprise Systems & SaaS",
    text: "Production enterprise systems, role-based access control (RBAC), relational database schemas, and end-to-end automated testing.",
    tags: ["Enterprise SaaS", "PostgreSQL", "Playwright", "RBAC"],
  },
];

const Hl = ({ children }: { children: React.ReactNode }) => (
  <span className="pf-hl" data-scroll-highlight>
    {children}
  </span>
);

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finalValue = to.toFixed(1) + "+";

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || reducedMotion || played.current) return;
    const counter = animate(0, to, {
      duration: 1.1,
      ease,
      onUpdate: (value) => {
        played.current = true;
        element.textContent = value.toFixed(1) + "+";
      },
    });
    return () => {
      counter.stop();
      element.textContent = finalValue;
    };
  }, [inView, reducedMotion, to, finalValue]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {finalValue}
      </span>
      <span className="sr-only">{finalValue}</span>
    </>
  );
}

/* 3D tilt card with cursor spotlight - modern header row */
function Card({ c, i }: { c: CardItem; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const canTilt = useMediaQuery(desktopDepthQuery + " and (prefers-reduced-motion: no-preference)");
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!canTilt || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--x", `${px * 100}%`);
    ref.current.style.setProperty("--y", `${py * 100}%`);
    ry.set((px - 0.5) * 8);
    rx.set(-(py - 0.5) * 8);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  const Icon = c.icon;

  return (
    <div data-scroll-depth="tilt">
      <div data-scroll-visual>
        <motion.article
          ref={ref}
          className="pf-card"
          onPointerMove={move}
          onPointerLeave={leave}
          style={canTilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : {}}
          data-scroll-reveal
        >
          <div className="pf-card-head" data-scroll-item>
            <div className="pf-icon">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="pf-title-wrap">
              <h3 className="pf-card-title">{c.title}</h3>
            </div>
            <span className="pf-idx-badge">0{i + 1}</span>
          </div>

          <p className="pf-card-text" data-scroll-item>
            {c.text}
          </p>

          <div className="pf-tags" data-scroll-item>
            {c.tags.map((t) => (
              <span key={t} className="pf-tag">
                {t}
              </span>
            ))}
          </div>
        </motion.article>
      </div>
    </div>
  );
}

export function Profile() {
  const sec = useScrollReveal();

  // Dynamically calculate experience duration from June 2, 2025 to the current date
  const experience = useMemo(() => {
    const startDate = new Date(2025, 5, 2); // June 2, 2025
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - startDate.getTime());
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    const decimalYears = Math.max(0.1, Math.round(diffYears * 10) / 10);
    const wholeYears = Math.max(1, Math.floor(diffYears));
    return { decimalYears, wholeYears };
  }, []);

  return (
    <section id="profile" className="pf" ref={sec} data-scroll-depth="parallax">
      <style>{css}</style>
      <div className="pf-glow-wrap">
        <div className="pf-glow" />
      </div>
      <div className="pf-wrap">
        <SectionHeader reveal label="Profile" caption="Who I am" />

        <div className="flow-root" data-scroll-reveal>
          <div className="pf-rule" data-scroll-rule aria-hidden="true" />
        </div>

        <div className="pf-grid">
          <div className="pf-left">
            <div className="pf-left-sticky">
              <div className="pf-hello">
                <span className="pf-num" data-scroll-visual aria-hidden="true">
                  01
                </span>
                <h2 data-scroll-reveal data-mobile-scroll-reveal="headline">
                  Hello, I'm Nirmal
                  <em data-scroll-rule aria-hidden="true" />
                </h2>
              </div>

              <p className="pf-lead" data-scroll-reveal>
                I'm Nirmal Kumar P R, a <Hl>Computer Science and Engineering graduate (2025)</Hl>{" "}
                with {experience.wholeYears}+ years of experience as a <Hl>Junior AI Engineer</Hl>.
                I work on web, backend and mobile application development, backend services, and
                integrating AI tools to solve real-world problems.
              </p>

              <p className="pf-copy" data-scroll-reveal>
                I enjoy learning new technologies, building clean and reliable services, and
                exploring how AI can be applied in practical ways to improve software applications.
                I'm passionate about continuous learning and contributing to meaningful products and
                teams.
              </p>

              <div className="pf-stats" data-scroll-reveal>
                <div>
                  <strong>
                    <Count to={experience.decimalYears} />
                  </strong>
                  <small>Years of experience</small>
                </div>
                <div>
                  <strong>B.E. CSE</strong>
                  <small>Graduate (2025)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="pf-cards">
            {CARDS.map((c, i) => (
              <Card key={c.title} c={c} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;

const mono = "var(--font-code, 'JetBrains Mono', ui-monospace, monospace)";
const css = `
.pf{position:relative;background:var(--bg, #f3f1eb);color:var(--text-primary, #111);padding:130px 0;font-family:var(--font-body, Inter, system-ui, sans-serif);border-top:1px solid var(--border-color, rgba(0,0,0,0.1))}
.pf-glow-wrap{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.pf-glow{position:absolute;width:700px;height:700px;left:-200px;top:20%;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(232,93,0,.12),transparent 65%);filter:blur(30px)}
.pf-wrap{position:relative;max-width:1280px;margin:0 auto;padding:0 24px}
@media(min-width:1024px){.pf-wrap{padding:0 40px}}
.pf-rule{height:1px;background:linear-gradient(90deg,var(--accent, #e85d00),var(--border-color, rgba(0,0,0,0.12)) 30%,var(--border-color, rgba(0,0,0,0.12)));transform-origin:left;margin:22px 0 76px}
.pf-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:72px;align-items:stretch}
.pf-left{position:relative;height:100%}
.pf-left-sticky{position:sticky;top:104px;display:flex;flex-direction:column}
.pf-hello{position:relative;padding-top:70px}
.pf-num{position:absolute;left:-6px;top:-10px;font:800 148px/1 ${mono};letter-spacing:-.06em;user-select:none;pointer-events:none;
  color:transparent;-webkit-text-stroke:1.5px rgba(232,93,0,.35);background:linear-gradient(180deg,rgba(232,93,0,.4) 0%,rgba(232,93,0,.08) 70%,transparent 100%);
  -webkit-background-clip:text;background-clip:text;opacity:.6}
.pf h2{position:relative;margin:0;display:flex;align-items:center;gap:20px;font:700 16px ${mono};letter-spacing:.2em;text-transform:uppercase;color:var(--text-primary, #111)}
.pf h2 em{flex:0 0 56px;height:1px;background:var(--accent, #e85d00);transform-origin:left}
.pf-lead{margin:32px 0 0;font-size:clamp(18px,1.6vw,22px);line-height:1.65;font-weight:450;letter-spacing:-.01em;color:var(--text-primary, #111)}
.pf-hl{display:inline;background-image:linear-gradient(rgba(232,93,0,.26),rgba(232,93,0,.26));background-position:0 88%;background-size:100% 40%;background-repeat:no-repeat;box-decoration-break:clone;-webkit-box-decoration-break:clone;font-weight:600;padding:0 2px}
.pf-copy{margin:24px 0 0;font-size:16px;line-height:1.8;color:var(--text-muted, #77716a)}
.pf-stats{display:flex;margin-top:40px}
.pf-stats>div{padding-right:32px}
.pf-stats>div+div{padding-left:32px;border-left:1px solid var(--border-color, rgba(0,0,0,0.12))}
.pf-stats strong{display:block;font:700 clamp(24px,2.2vw,30px)/1.15 var(--font-body, Inter, sans-serif);letter-spacing:-.02em;color:var(--text-primary, #111);font-variant-numeric:tabular-nums}
.pf-stats small{display:block;margin-top:8px;font:500 11px ${mono};letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted, #77716a)}
.pf-cards{display:flex;flex-direction:column;gap:16px;}
.pf-card{--x:50%;--y:50%;position:relative;display:flex;flex-direction:column;padding:24px 26px;border-radius:20px;background:var(--surface, #eae7df);
  border:1px solid var(--border-color, rgba(0,0,0,0.1));overflow:hidden;transition:box-shadow .35s cubic-bezier(.16,1,.3,1),background .35s,border-color .35s}
.pf-card::before{content:"";position:absolute;inset:0;opacity:0;transition:opacity .35s;pointer-events:none;
  background:radial-gradient(420px circle at var(--x) var(--y),rgba(232,93,0,.15),transparent 65%)}
.pf-card::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;opacity:0;transition:opacity .35s;pointer-events:none;
  background:radial-gradient(300px circle at var(--x) var(--y),rgba(232,93,0,.6),transparent 60%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.pf-card:hover{background:var(--surface-raised, #f6f3ee);border-color:rgba(232,93,0,.32);box-shadow:0 20px 48px -16px rgba(0,0,0,0.12),0 0 0 1px rgba(232,93,0,0.15)}
.pf-card:hover::before,.pf-card:hover::after{opacity:1}
.pf-card-head{display:flex;align-items:center;gap:14px;position:relative;z-index:1}
.pf-icon{flex:0 0 46px;height:46px;border-radius:13px;display:grid;place-items:center;color:var(--accent, #e85d00);
  background:linear-gradient(145deg,rgba(232,93,0,.16),rgba(232,93,0,.06));border:1px solid rgba(232,93,0,.26);transition:transform .35s cubic-bezier(.2,.9,.3,1.4),background .3s,color .3s,box-shadow .3s}
.pf-card:hover .pf-icon{transform:rotate(-6deg) scale(1.08);background:var(--accent, #e85d00);color:#fff;box-shadow:0 10px 24px -6px rgba(232,93,0,.4)}
.pf-title-wrap{flex:1;min-width:0}
.pf-card-title{margin:0;font:700 16px/1.3 var(--font-body, Inter, sans-serif);letter-spacing:-0.01em;color:var(--text-primary, #111)}
.pf-idx-badge{flex-shrink:0;font:700 11px ${mono};letter-spacing:.12em;color:var(--accent, #e85d00);background:rgba(232,93,0,.08);
  border:1px solid rgba(232,93,0,.22);padding:3px 9px;border-radius:999px;transition:all .25s ease}
.pf-card:hover .pf-idx-badge{background:rgba(232,93,0,.15);border-color:var(--accent, #e85d00)}
.pf-card-text{position:relative;z-index:1;margin:14px 0 0;font-size:14px;line-height:1.65;color:var(--text-secondary, #55514b)}
.pf-tags{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}
.pf-tag{padding:4px 11px;border-radius:8px;border:1px solid var(--border-color, rgba(0,0,0,0.1));background:rgba(255,255,255,.55);
  font:500 11px ${mono};letter-spacing:.02em;color:var(--text-secondary, #55514b);transition:all .25s ease}
.pf-card:hover .pf-tag{border-color:rgba(232,93,0,.22);background:rgba(255,255,255,.85);color:var(--text-primary, #111)}
.pf-tag:hover{background:var(--accent, #e85d00);border-color:var(--accent, #e85d00);color:#fff;transform:translateY(-2px);box-shadow:0 4px 12px -2px rgba(232,93,0,.35)}
@media(max-width:960px){.pf{padding:80px 0}.pf-grid{grid-template-columns:1fr;gap:48px}.pf-left{position:static;height:auto}.pf-left-sticky{position:static}.pf-num{font-size:104px}}
@media(max-width:640px){.pf{padding:68px 0}.pf-wrap{padding:0 18px}.pf-grid{gap:36px}.pf-hello{padding-top:40px}.pf-num{font-size:80px;top:-16px}
  .pf-lead{font-size:16.5px;line-height:1.6;margin-top:20px}.pf-copy{font-size:14px;line-height:1.68;margin-top:14px}.pf-stats{margin-top:28px}
  .pf-stats>div{padding-right:20px}.pf-stats>div+div{padding-left:20px}
  .pf-cards{gap:12px}
  .pf-card{padding:16px 16px;border-radius:16px;background:var(--surface-raised, #ffffff);border-color:rgba(0,0,0,0.08);box-shadow:0 4px 16px -2px rgba(0,0,0,0.05)}
  .pf-card:active{transform:scale(0.99)}
  .pf-card-head{gap:11px}
  .pf-icon{flex:0 0 38px;height:38px;border-radius:10px}
  .pf-card-title{font-size:14.5px}
  .pf-idx-badge{font-size:10px;padding:2px 8px}
  .pf-card-text{font-size:13.5px;line-height:1.58;margin-top:10px}
  .pf-tags{margin-top:12px;gap:6px}
  .pf-tag{padding:3px 8.5px;font-size:10.5px;border-radius:6px}
}
@media(prefers-reduced-motion:reduce){.pf-card{transform:none!important}}
`;
