import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMediaQuery } from "../../hooks/use-media-query";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let moved = false;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!moved) {
        moved = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY, opacity: 1 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest("[data-cursor='view']");
      const interactiveEl = target.closest("a, button, input, textarea, [role='button']");

      if (projectEl) {
        setIsProject(true);
        setIsHovered(true);
        setCursorText("VIEW ↗");
      } else if (interactiveEl) {
        setIsProject(false);
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsProject(false);
        setIsHovered(false);
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      if (moved) gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      gsap.killTweensOf(cursor);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className={`pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,border-color] duration-200 ease-out will-change-transform ${
        isProject
          ? "flex h-16 w-16 items-center justify-center bg-[var(--accent)] text-white font-mono text-[10px] font-bold tracking-wider shadow-lg shadow-[var(--accent)]/30"
          : isHovered
            ? "h-8 w-8 border border-[var(--accent)] bg-[var(--accent)]/15 backdrop-blur-[1px]"
            : "h-2.5 w-2.5 bg-[var(--accent)] shadow-[0_0_10px_rgba(255,106,0,0.6)]"
      }`}
    >
      {isProject && (
        <span ref={textRef} className="select-none leading-none">
          {cursorText}
        </span>
      )}
    </div>
  );
}
