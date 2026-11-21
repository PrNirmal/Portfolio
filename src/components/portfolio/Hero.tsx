import { useState, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useMediaQuery } from "../../hooks/use-media-query";
import { useVisible } from "../../hooks/use-visible";
import { desktopDepthQuery } from "./useScrollReveal";
import { LineReveal } from "./hero/LineReveal";
import { Magnetic } from "./hero/MagneticButton";
import { SkillOrb } from "./hero/SkillOrb";
import { PERSONAL_INFO, HERO_ROLES, TECH_STACK } from "./portfolioData";

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
    ]),
  ),
).slice(0, 12);

const HERO_FADE_START = 0.75;
const HERO_EXIT_RANGE = [HERO_FADE_START, 1];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const visible = useVisible(heroRef);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const [roleIndex, setRoleIndex] = useState(0);
  const desktop = useMediaQuery(desktopDepthQuery);
  const exitProgress = useMotionValue(0);
  const fade = useTransform(exitProgress, HERO_EXIT_RANGE, [1, 0]);
  const desktopLift = useTransform(exitProgress, HERO_EXIT_RANGE, [0, -24]);
  const compactLift = useTransform(exitProgress, HERO_EXIT_RANGE, [0, -10]);
  const spotX = useTransform(mx, (value) => `${value * 100}%`);
  const spotY = useTransform(my, (value) => `${value * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${spotX} ${spotY}, var(--accent-glow), transparent 60%)`;
  const exitStyle = {
    y: reducedMotion ? 0 : desktop ? desktopLift : compactLift,
    opacity: reducedMotion ? 1 : fade,
  };

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reducedMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Scroll padding offsets anchor navigation. The fade uses the actual viewport edge.
      const { top, height } = hero.getBoundingClientRect();
      const progress = height > 0 ? Math.max(0, Math.min(1, -top / height)) : 0;
      exitProgress.set(progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);

    update();
    resize.observe(hero);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, [exitProgress, reducedMotion]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % HERO_ROLES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero"
      data-hero-visible={visible}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || reducedMotion) return;
        mx.set(event.clientX / window.innerWidth);
        my.set(event.clientY / window.innerHeight);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <div className="grain" />
      <motion.div
        className="spot"
        style={{ background: desktop && !reducedMotion ? spotlight : "" }}
      />
      <div className="grid-bg" />

      <div className="hero-grid">
        <motion.div className="content" style={exitStyle}>
          <div className="status">
            <i className="dot" /> OPEN TO AI & SOFTWARE ROLES
          </div>
          <h1 aria-label={PERSONAL_INFO.name}>
            <LineReveal delay={0.18}>Nirmal</LineReveal>
            <LineReveal delay={0.3}>Kumar P R</LineReveal>
          </h1>
          <div className="role">
            <span className="slash">/</span>
            <span className="roles">
              {HERO_ROLES.map((role, index) => (
                <motion.span
                  key={role}
                  className="r"
                  aria-hidden={index !== roleIndex}
                  initial={false}
                  animate={{
                    y: index === roleIndex ? "0%" : index < roleIndex ? "-110%" : "110%",
                    opacity: index === roleIndex ? 1 : 0,
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {role}
                </motion.span>
              ))}
            </span>
          </div>
          <p className="lede">{PERSONAL_INFO.subheadline}</p>
          <div className="ctas">
            <Magnetic href="#work" className="btn solid">
              <span>View my work</span>
              <b aria-hidden="true">↓</b>
            </Magnetic>
            <Magnetic
              href={PERSONAL_INFO.resumeUrl || "/resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="btn line"
            >
              <span>Download resume</span>
              <b aria-hidden="true">↗</b>
            </Magnetic>
          </div>
        </motion.div>
        <motion.div className="hero-visual" style={exitStyle}>
          <SkillOrb mx={mx} my={my} />
        </motion.div>
      </div>

      {/* Side Vertical Social Links */}
      <motion.div className="side" style={{ opacity: exitStyle.opacity }}>
        <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer">
          GITHUB
        </a>
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer">
          LINKEDIN
        </a>
      </motion.div>

      {/* Infinite Horizontal Tech Marquee */}
      <motion.div className="marquee" aria-hidden="true" style={{ opacity: exitStyle.opacity }}>
        <div className="track">
          {[...STACK_NAMES, ...STACK_NAMES, ...STACK_NAMES].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
