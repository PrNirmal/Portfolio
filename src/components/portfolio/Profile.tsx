import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { Code2, Cpu, Smartphone, Database } from "lucide-react";

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

/* Animated highlighter underline inside the paragraph - half height of the text */
const Hl = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="pf-hl"
    initial={{ backgroundSize: "0% 40%" }}
    whileInView={{ backgroundSize: "100% 40%" }}
    viewport={{ once: true }}
    transition={{ duration: 0.9, ease, delay: 0.4 }}
  >
    {children}
  </motion.span>
);

/* Count-up number animation */
function Count({
  to,
  decimals = 1,
  suffix = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) {
  const [val, setVal] = useState("0" + (decimals > 0 ? ".0" : "") + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.5,
      ease,
      onUpdate: (v) => {
        setVal(v.toFixed(decimals) + suffix);
      },
    });
    return () => c.stop();
  }, [inView, to, decimals, suffix]);

  return <span ref={ref}>{val}</span>;
}

/* 3D tilt card with cursor spotlight - no navigate arrow */
function Card({ c, i }: { c: CardItem; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const move = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
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
    <motion.article
      ref={ref}
      className="pf-card"
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay: i * 0.08 }}
    >
      <span className="pf-idx">0{i + 1}</span>
      <div className="pf-icon">
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <div className="pf-body">
        <h3>{c.title}</h3>
        <p>{c.text}</p>
        <div className="pf-tags">
          {c.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Profile() {
  const sec = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sec,
    offset: ["start end", "end start"],
  });
  const numY = useTransform(scrollYProgress, [0, 1], [50, -70]);

  return (
    <section id="profile" className="pf" ref={sec}>
      <style>{css}</style>
      <div className="pf-glow-wrap">
        <div className="pf-glow" />
      </div>
      <div className="pf-wrap">
        <header className="pf-head">
          <span className="pf-label">
            Profile <i />
          </span>
          <span className="pf-sub">Foundation &amp; Engineering</span>
        </header>

        <motion.div
          className="pf-rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        />

        <div className="pf-grid">
          <div className="pf-left">
            <div className="pf-left-sticky">
              <div className="pf-hello">
                <motion.span className="pf-num" style={{ y: numY }}>
                  01
                </motion.span>
                <h2>
                  Hello, I'm Nirmal
                  <motion.em
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease, delay: 0.4 }}
                  />
                </h2>
              </div>

              <motion.p
                className="pf-lead"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease }}
              >
                I'm Nirmal Kumar P R, a{" "}
                <Hl>Computer Science and Engineering graduate (2025)</Hl> with 1+ years of
                experience as a <Hl>Junior AI Engineer</Hl>. I work on web, backend and mobile application
                development, backend services, and integrating AI tools to solve real-world problems.
              </motion.p>

              <motion.p
                className="pf-copy"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease, delay: 0.1 }}
              >
                I enjoy learning new technologies, building clean and reliable services, and exploring how AI can be
                applied in practical ways to improve software applications. I'm passionate about continuous learning
                and contributing to meaningful products and teams.
              </motion.p>

              <motion.div
                className="pf-stats"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease, delay: 0.2 }}
              >
                <div>
                  <strong>
                    <Count to={1.3} suffix="+" />
                  </strong>
                  <small>Years of experience</small>
                </div>
                <div>
                  <strong>B.E. CSE</strong>
                  <small>Graduate (2025)</small>
                </div>
              </motion.div>
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
.pf-head{display:flex;justify-content:space-between;align-items:center;font:600 12px ${mono};letter-spacing:.25em;text-transform:uppercase}
.pf-label{color:var(--accent, #e85d00);display:flex;align-items:center;gap:10px}
.pf-label i{width:7px;height:7px;border-radius:50%;background:var(--accent, #e85d00);animation:pfp 2s infinite}
.pf-sub{color:var(--text-muted, #77716a);font-weight:500;letter-spacing:.2em}
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
.pf-hl{display:inline;background-image:linear-gradient(rgba(232,93,0,.26),rgba(232,93,0,.26));background-position:0 88%;background-repeat:no-repeat;box-decoration-break:clone;-webkit-box-decoration-break:clone;font-weight:600;padding:0 2px}
.pf-copy{margin:24px 0 0;font-size:16px;line-height:1.8;color:var(--text-muted, #77716a)}
.pf-stats{display:flex;margin-top:40px}
.pf-stats>div{padding-right:32px}
.pf-stats>div+div{padding-left:32px;border-left:1px solid var(--border-color, rgba(0,0,0,0.12))}
.pf-stats strong{display:block;font:700 clamp(24px,2.2vw,30px)/1.15 var(--font-body, Inter, sans-serif);letter-spacing:-.02em;color:var(--text-primary, #111);font-variant-numeric:tabular-nums}
.pf-stats small{display:block;margin-top:8px;font:500 11px ${mono};letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted, #77716a)}
.pf-cards{display:flex;flex-direction:column;gap:20px;perspective:1200px}
.pf-card{--x:50%;--y:50%;position:relative;display:flex;gap:24px;padding:30px 32px;border-radius:18px;background:var(--surface, #eae7df);
  border:1px solid var(--border-color, rgba(0,0,0,0.1));overflow:hidden;transition:box-shadow .4s cubic-bezier(.16,1,.3,1),background .4s,border-color .4s;will-change:transform}
.pf-card::before{content:"";position:absolute;inset:0;opacity:0;transition:opacity .35s;pointer-events:none;
  background:radial-gradient(420px circle at var(--x) var(--y),rgba(232,93,0,.15),transparent 65%)}
.pf-card::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;opacity:0;transition:opacity .35s;pointer-events:none;
  background:radial-gradient(300px circle at var(--x) var(--y),rgba(232,93,0,.6),transparent 60%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.pf-card:hover{background:var(--surface-raised, #f6f3ee);border-color:rgba(232,93,0,.3);box-shadow:0 24px 50px -20px rgba(0,0,0,0.12),0 0 0 1px rgba(232,93,0,0.15)}
.pf-card:hover::before,.pf-card:hover::after{opacity:1}
.pf-idx{position:absolute;right:26px;top:22px;font:600 11px ${mono};letter-spacing:.2em;color:var(--text-muted, #77716a);opacity:.75;transition:color .3s,opacity .3s,transform .3s}
.pf-card:hover .pf-idx{color:var(--accent, #e85d00);opacity:1;transform:scale(1.05)}
.pf-icon{flex:0 0 54px;height:54px;border-radius:15px;display:grid;place-items:center;color:var(--accent, #e85d00);
  background:linear-gradient(145deg,rgba(232,93,0,.14),rgba(232,93,0,.05));border:1px solid rgba(232,93,0,.25);transition:transform .45s cubic-bezier(.2,.9,.3,1.4),background .3s,color .3s,box-shadow .3s}
.pf-card:hover .pf-icon{transform:rotate(-6deg) scale(1.08);background:var(--accent, #e85d00);color:#fff;box-shadow:0 10px 24px -6px rgba(232,93,0,.4)}
.pf-body{position:relative;z-index:1;min-width:0;flex:1}
.pf-body h3{margin:3px 0 0;font:700 13px ${mono};letter-spacing:.16em;text-transform:uppercase;color:var(--text-primary, #111)}
.pf-body p{margin:10px 0 0;font-size:14px;line-height:1.65;color:var(--text-muted, #77716a);max-width:54ch}
.pf-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.pf-tags span{padding:5px 12px;border-radius:999px;border:1px solid var(--border-color, rgba(0,0,0,0.1));background:rgba(255,255,255,.45);
  font:500 11px ${mono};letter-spacing:.04em;color:var(--text-muted, #77716a);transition:all .25s ease}
.pf-card:hover .pf-tags span{border-color:rgba(232,93,0,.22);color:var(--text-secondary, #55514b)}
.pf-tags span:hover{background:var(--accent, #e85d00);border-color:var(--accent, #e85d00);color:#fff;transform:translateY(-2px);box-shadow:0 4px 12px -2px rgba(232,93,0,.35)}
@keyframes pfp{50%{box-shadow:0 0 0 7px rgba(232,93,0,0)}0%{box-shadow:0 0 0 0 rgba(232,93,0,.5)}}
@media(max-width:960px){.pf{padding:90px 0}.pf-grid{grid-template-columns:1fr;gap:52px}.pf-left{position:static;height:auto}.pf-left-sticky{position:static}.pf-card{padding:24px}.pf-num{font-size:104px}}
@media(max-width:560px){.pf-card{flex-direction:column;gap:16px}.pf-sub{display:none}.pf-stats>div{padding-right:24px}.pf-stats>div+div{padding-left:24px}}
@media(prefers-reduced-motion:reduce){.pf-label i{animation:none}.pf-card{transform:none!important}.pf-rule,.pf h2 em,.pf-hl{transform:none!important;background-size:100% 40%!important}}
`;
