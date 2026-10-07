import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";

import { SkillOrb } from "./hero/SkillOrb";
import { Magnetic } from "./hero/MagneticButton";
import { LineReveal } from "./hero/LineReveal";
import { PERSONAL_INFO, HERO_ROLES, TECH_STACK } from "./portfolioData";
import "./hero/hero.css";

const STACK_NAMES = Array.from(
  new Set(
    TECH_STACK.map((t) => t.name.toUpperCase()).concat([
      "PYTHON",
      "FASTAPI",
      "REACT",
      "TYPESCRIPT",
      "LANGCHAIN",
      "RAG",
      "LLMS",
      "FLUTTER",
      "POSTGRESQL",
    ])
  )
).slice(0, 12);

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const spot = useMotionTemplate`radial-gradient(650px circle at ${px} ${py}, var(--accent-glow), transparent 60%)`;

  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 600], [0, -120]);
  const fade = useTransform(scrollY, [0, 480], [1, 0]);

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIndex((r) => (r + 1) % HERO_ROLES.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1;
    const h = typeof window !== "undefined" ? window.innerHeight : 1;
    mx.set(e.clientX / (w || 1));
    my.set(e.clientY / (h || 1));
  };

  return (
    <section id="hero" className="hero" onMouseMove={handleMouseMove}>
      <div className="grain" />
      <motion.div className="spot" style={{ background: spot }} />
      <div className="grid-bg" />

      {/* Hero 2-Column Grid */}
      <div className="hero-grid">
        {/* Main Content Column */}
        <motion.div className="content" style={{ y: lift, opacity: fade }}>
          {/* Availability Status Badge */}
          <motion.div
            className="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <i className="dot" /> OPEN TO AI & SOFTWARE ROLES
          </motion.div>

          {/* Hero Headline with Masked Reveals using original name */}
          <h1 aria-label={PERSONAL_INFO.name}>
            <LineReveal delay={0.3}>Nirmal</LineReveal>
            <LineReveal delay={0.42}>Kumar P R</LineReveal>
          </h1>

          {/* Rotating Roles Carousel using HERO_ROLES */}
          <div className="role">
            <span className="slash">/</span>
            <span className="roles">
              {HERO_ROLES.map((r, i) => (
                <motion.span
                  key={r}
                  className="r"
                  initial={false}
                  animate={{
                    y: i === roleIndex ? "0%" : i < roleIndex ? "-110%" : "110%",
                    opacity: i === roleIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.7, ease } as Transition}
                >
                  {r}
                </motion.span>
              ))}
            </span>
          </div>

          {/* Supporting Description from portfolioData */}
          <motion.p
            className="lede"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            {PERSONAL_INFO.subheadline}
          </motion.p>

          {/* Magnetic Interactive CTAs */}
          <motion.div
            className="ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease } as Transition}
          >
            <Magnetic href="#work" className="btn solid">
              <span>View my work</span>
              <b>↓</b>
            </Magnetic>
            <Magnetic
              href={PERSONAL_INFO.resumeUrl || "/resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="btn line"
            >
              <span>Download resume</span>
              <b>↗</b>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right Visual Column (3D Interactive Neural Core & Skill Orbit) */}
        <div className="hero-visual">
          {mounted && <SkillOrb mx={mx} my={my} lift={lift} fade={fade} />}
        </div>
      </div>

      {/* Side Vertical Social Links */}
      <div className="side">
        <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer">
          GITHUB
        </a>
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer">
          LINKEDIN
        </a>
      </div>

      {/* Infinite Horizontal Tech Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...STACK_NAMES, ...STACK_NAMES, ...STACK_NAMES].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
