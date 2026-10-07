import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  stagger?: number;
  duration?: number;
}

export function SplitWordsReveal({
  children,
  className = "",
  as: Component = "h1",
  delay = 0.1,
  stagger = 0.04,
  duration = 0.9,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".reveal-word-inner");
    gsap.fromTo(
      words,
      {
        y: "110%",
        opacity: 0,
        rotateX: -10,
      },
      {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration,
        stagger,
        delay,
        ease: "power3.out",
      },
    );
  }, [delay, stagger, duration, children]);

  const words = children.split(" ");

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block ${className}`,
      "aria-label": children,
    },
    words.flatMap((word, i) => [
      <span
        key={`word-${i}`}
        className="mask-reveal-container inline-block overflow-hidden pb-[0.1em]"
      >
        <span className="reveal-word-inner inline-block will-change-transform">{word}</span>
      </span>,
      i < words.length - 1 ? " " : null,
    ]),
  );
}

export function MaskReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !elRef.current) return;

    gsap.fromTo(
      elRef.current,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out",
      },
    );
  }, [delay, duration]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
