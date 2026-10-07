import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Comprehensive scroll reveal system using GSAP ScrollTrigger.
 *
 * Supported data-attributes on child elements:
 *
 *   class="sr"              → default fade-up reveal
 *   data-sr="up"            → fade up (default)
 *   data-sr="down"          → fade down
 *   data-sr="left"          → slide from left
 *   data-sr="right"         → slide from right
 *   data-sr="scale"         → scale up from 0.85
 *   data-sr="blur"          → blur-to-sharp
 *   data-sr="clip-up"       → clip-path reveal upward
 *   data-sr="fade"          → pure opacity fade, no movement
 *
 *   data-sr-delay="0.2"     → additional delay (seconds)
 *   data-sr-duration="0.8"  → custom duration
 *   data-sr-distance="40"   → custom travel distance in px
 *
 * For staggered groups, wrap children in a parent with:
 *   data-sr-stagger="0.08"  → stagger value for direct children with class="sr-child"
 *
 * Each .sr element triggers independently based on its own viewport position.
 * Stagger groups (.sr-stagger) animate children together when the parent enters.
 */
export function useScrollReveal(
  _legacySelector?: string,
  _legacyOptions?: Record<string, unknown>
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      // ── Individual element reveals ──────────────────────────────
      const singles = ref.current!.querySelectorAll<HTMLElement>(".sr");

      singles.forEach((el) => {
        const direction = el.dataset["sr"] || "up";
        const delay = parseFloat(el.dataset["srDelay"] || "0");
        const duration = parseFloat(el.dataset["srDuration"] || "0.75");
        const distance = parseFloat(el.dataset["srDistance"] || "32");

        const from: gsap.TweenVars = { opacity: 0 };
        const to: gsap.TweenVars = {
          opacity: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        };

        switch (direction) {
          case "down":
            from.y = -distance;
            to.y = 0;
            break;
          case "left":
            from.x = -distance;
            to.x = 0;
            break;
          case "right":
            from.x = distance;
            to.x = 0;
            break;
          case "scale":
            from.scale = 0.85;
            from.y = distance * 0.4;
            to.scale = 1;
            to.y = 0;
            break;
          case "blur":
            from.filter = "blur(8px)";
            from.y = distance * 0.5;
            to.filter = "blur(0px)";
            to.y = 0;
            (to as Record<string, unknown>)["clearProps"] = "filter";
            break;
          case "clip-up":
            from.clipPath = "inset(100% 0% 0% 0%)";
            from.y = 0;
            to.clipPath = "inset(0% 0% 0% 0%)";
            (to as Record<string, unknown>)["clearProps"] = "clipPath";
            break;
          case "fade":
            // Pure opacity, no movement
            break;
          case "up":
          default:
            from.y = distance;
            to.y = 0;
            break;
        }

        gsap.fromTo(el, from, to);
      });

      // ── Stagger group reveals ──────────────────────────────────
      const staggerGroups =
        ref.current!.querySelectorAll<HTMLElement>("[data-sr-stagger]");

      staggerGroups.forEach((group) => {
        const stagger = parseFloat(group.dataset["srStagger"] || "0.08");
        const direction = group.dataset["sr"] || "up";
        const delay = parseFloat(group.dataset["srDelay"] || "0");
        const duration = parseFloat(group.dataset["srDuration"] || "0.65");
        const distance = parseFloat(group.dataset["srDistance"] || "28");

        const children = group.querySelectorAll<HTMLElement>(".sr-child");
        if (!children.length) return;

        const from: gsap.TweenVars = { opacity: 0 };
        const to: gsap.TweenVars = {
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        };

        switch (direction) {
          case "left":
            from.x = -distance;
            to.x = 0;
            break;
          case "right":
            from.x = distance;
            to.x = 0;
            break;
          case "scale":
            from.scale = 0.88;
            from.y = distance * 0.4;
            to.scale = 1;
            to.y = 0;
            break;
          case "blur":
            from.filter = "blur(6px)";
            from.y = distance * 0.5;
            to.filter = "blur(0px)";
            to.y = 0;
            (to as Record<string, unknown>)["clearProps"] = "filter";
            break;
          case "down":
            from.y = -distance;
            to.y = 0;
            break;
          case "up":
          default:
            from.y = distance;
            to.y = 0;
            break;
        }

        gsap.fromTo(children, from, to);
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}
