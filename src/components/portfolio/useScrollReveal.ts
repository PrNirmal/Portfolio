import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const desktopDepthQuery = "(min-width: 1024px) and (min-height: 740px) and (pointer: fine)";

/**
 * A depth anchor measures layout while its visual child moves with scroll.
 * A reveal plays once on itself, or staggers its direct data-scroll-item children.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  legacySelector?: string,
  layoutKey?: string,
) {
  const ref = useRef<T | null>(null);
  const revealed = useRef(new WeakSet<HTMLElement>());

  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    const media = gsap.matchMedia(scope);
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: desktopDepthQuery,
        compact: "(max-width: 639px)",
      },
      (context) => {
        if (!context.conditions?.["motion"]) return undefined;
        const desktop = context.conditions["desktop"];
        const depthAnchors = Array.from(scope.querySelectorAll<HTMLElement>("[data-scroll-depth]"));
        if (scope.hasAttribute("data-scroll-depth")) depthAnchors.unshift(scope);

        for (const anchor of depthAnchors) {
          const visual = anchor.querySelector<HTMLElement>("[data-scroll-visual]");
          if (!visual || !anchor.getClientRects().length) continue;
          const mode = anchor.dataset["scrollDepth"];
          if (mode === "parallax") {
            gsap.fromTo(
              visual,
              { y: desktop ? 50 : 16 },
              {
                y: desktop ? -70 : -20,
                ease: "none",
                scrollTrigger: {
                  trigger: anchor,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            continue;
          }
          const tilted = desktop && mode === "tilt";
          const distance = desktop ? (mode === "entry" ? 36 : 28) : 12;
          const depth = {
            y: distance,
            scale: tilted ? 0.97 : 1,
            ...(tilted
              ? { rotationX: 4, transformPerspective: 900, transformOrigin: "50% 100%" }
              : {}),
          };
          const rest = { y: 0, scale: 1, ...(tilted ? { rotationX: 0 } : {}) };
          gsap.fromTo(visual, depth, {
            ...rest,
            ease: "none",
            scrollTrigger: {
              trigger: anchor,
              start: "clamp(top 92%)",
              end: "clamp(top 65%)",
              scrub: true,
            },
          });
        }

        const entrances = scope.querySelectorAll<HTMLElement>(
          legacySelector ? `[data-scroll-reveal], ${legacySelector}` : "[data-scroll-reveal]",
        );
        const pending = new Map<Element, gsap.core.Timeline>();
        const observer = new IntersectionObserver(
          (entries) => {
            for (const { target, isIntersecting } of entries) {
              const timeline = pending.get(target);
              if (!isIntersecting || !timeline) continue;
              observer.unobserve(target);
              pending.delete(target);
              if (target instanceof HTMLElement) revealed.current.add(target);
              timeline.play();
            }
          },
          { rootMargin: "0px 0px 32px" },
        );

        // Leave already visible content at rest, including direct anchor landings and filter results.
        // Set the starting pose offscreen so scrolling never exposes the final pose before a reveal.
        const offscreen = Array.from(entrances).filter((trigger) => {
          if (revealed.current.has(trigger) || !trigger.getClientRects().length) return false;
          if (trigger.getBoundingClientRect().top >= window.innerHeight) return true;
          revealed.current.add(trigger);
          return false;
        });

        for (const trigger of offscreen) {
          const rule = trigger.querySelector<HTMLElement>(":scope > [data-scroll-rule]");
          const children = trigger.querySelectorAll<HTMLElement>(":scope > [data-scroll-item]");
          const variant = trigger.dataset["scrollReveal"];
          const tile = variant === "tile";
          const headline = variant === "headline";
          const direction =
            desktop && variant === "left" ? -1 : desktop && variant === "right" ? 1 : 0;
          const scaled = tile || variant === "scale";
          const highlights = trigger.querySelectorAll<HTMLElement>("[data-scroll-highlight]");
          const grid = tile ? trigger.parentElement : null;
          const columns = grid
            ? Number(getComputedStyle(grid).getPropertyValue("--scroll-columns")) || 1
            : 1;
          const column = grid ? Array.from(grid.children).indexOf(trigger) % columns : 0;
          const timeline = gsap.timeline({ paused: true, delay: column * 0.035 });

          if (rule) {
            gsap.set(rule, { scaleX: 0 });
            timeline.to(rule, {
              scaleX: 1,
              duration: 0.35,
              ease: "power2.out",
              clearProps: "transform",
            });
          }
          if (!rule || children.length) {
            const targets = children.length ? children : [trigger];
            gsap.set(targets, {
              opacity: 0,
              x: direction * 22,
              y: direction ? 0 : desktop ? (headline ? 28 : tile ? 12 : 22) : 12,
              ...(scaled ? { scale: desktop ? 0.94 : 0.97 } : {}),
            });
            timeline.to(
              targets,
              {
                opacity: 1,
                x: 0,
                y: 0,
                ...(scaled ? { scale: 1 } : {}),
                duration: desktop ? (headline ? 0.75 : 0.62) : 0.42,
                stagger: desktop ? 0.065 : 0.045,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              rule ? 0.05 : 0,
            );
          }
          if (highlights.length) {
            gsap.set(highlights, { backgroundSize: "0% 40%" });
            timeline.to(
              highlights,
              {
                backgroundSize: "100% 40%",
                duration: 0.8,
                stagger: 0.09,
                ease: "power3.out",
                clearProps: "backgroundSize",
              },
              0.18,
            );
          }
          pending.set(trigger, timeline);
          observer.observe(trigger);
        }
        return () => {
          observer.disconnect();
          pending.clear();
        };
      },
    );

    // Filtering and responsive layout changes can move every later section.
    const frame =
      layoutKey === undefined ? 0 : requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [legacySelector, layoutKey]);

  return ref;
}
