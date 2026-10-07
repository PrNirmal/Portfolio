import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CustomCursor } from "../components/portfolio/CustomCursor";
import { Navbar } from "../components/portfolio/Navbar";
import { Hero } from "../components/portfolio/Hero";
import { Profile } from "../components/portfolio/Profile";
import { SelectedWork } from "../components/portfolio/SelectedWork";
import { ExperienceTimeline } from "../components/portfolio/ExperienceTimeline";
import { TechStack } from "../components/portfolio/TechStack";
import { EducationCertifications } from "../components/portfolio/EducationCertifications";
import { Contact } from "../components/portfolio/Contact";
import { Footer } from "../components/portfolio/Footer";
import { PERSONAL_INFO } from "../components/portfolio/portfolioData";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirmal Kumar P R — Junior AI Engineer & Software Developer" },
      {
        name: "description",
        content:
          "Junior AI Engineer with extensive experience in software development, enterprise SaaS, Generative AI, RAG and intelligent automation.",
      },
      { property: "og:title", content: "Nirmal Kumar P R — Junior AI Engineer & Software Developer" },
      {
        property: "og:description",
        content: "Building software and intelligent applications that solve real problems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nirmal Kumar P R — Junior AI Engineer & Software Developer" },
      {
        name: "twitter:description",
        content: "Building software and intelligent applications that solve real problems.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: PERSONAL_INFO.name,
          jobTitle: PERSONAL_INFO.role,
          email: `mailto:${PERSONAL_INFO.email}`,
          telephone: PERSONAL_INFO.phoneRaw,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Chennai",
            addressCountry: "India",
          },
          sameAs: [PERSONAL_INFO.github, PERSONAL_INFO.linkedin],
        }),
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis smooth scroll with luxurious, velvety easing & reduced speed
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.65,
      touchMultiplier: 0.85,
    });

    window.__lenis = lenis;

    lenis.on("scroll", (e: { progress: number }) => {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${e.progress})`;
      }
      ScrollTrigger.update();
    });

    const rafTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafTicker);
    gsap.ticker.lagSmoothing(0);

    // Natural Light -> Deep Dark -> Light Theme Progression
    // Light: #F3F1EB -> Deep Dark: #0D0D0D -> Light: #F3F1EB
    type RGB = [number, number, number];

    const colorStops = {
      light: {
        bg: [243, 241, 235] as RGB, // #F3F1EB
        surface: [234, 231, 223] as RGB, // #EAE7DF
        surfaceRaised: [223, 219, 209] as RGB, // #DFDBD1
        textPrimary: [17, 17, 17] as RGB, // #111111
        textSecondary: [85, 81, 75] as RGB, // #55514B
        textMuted: [119, 113, 106] as RGB, // #77716A
        borderAlpha: 0.10,
        borderRGB: [0, 0, 0] as RGB,
        accent: [232, 93, 0] as RGB, // #E85D00
        gridLine: "rgba(0, 0, 0, 0.04)",
      },
      dark: {
        bg: [10, 10, 11] as RGB, // #0A0A0B (matches Hero canvas)
        surface: [18, 18, 20] as RGB, // #121214
        surfaceRaised: [26, 26, 28] as RGB, // #1A1A1C
        textPrimary: [245, 243, 238] as RGB, // #F5F3EE
        textSecondary: [175, 170, 161] as RGB, // #AFAAA1
        textMuted: [138, 133, 123] as RGB, // #8A857B
        borderAlpha: 0.08,
        borderRGB: [255, 255, 255] as RGB,
        accent: [255, 106, 40] as RGB, // #FF6A28
        gridLine: "rgba(255, 255, 255, 0.03)",
      },
    };

    const interp = (c1: RGB, c2: RGB, factor: number) => {
      const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
      const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
      const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const applyTheme = (from: typeof colorStops.light, to: typeof colorStops.dark, factor: number) => {
      const docStyle = document.documentElement.style;

      docStyle.setProperty("--bg", interp(from.bg, to.bg, factor));
      docStyle.setProperty("--surface", interp(from.surface, to.surface, factor));
      docStyle.setProperty("--surface-raised", interp(from.surfaceRaised, to.surfaceRaised, factor));
      docStyle.setProperty("--text-primary", interp(from.textPrimary, to.textPrimary, factor));
      docStyle.setProperty("--text-secondary", interp(from.textSecondary, to.textSecondary, factor));
      docStyle.setProperty("--text-muted", interp(from.textMuted, to.textMuted, factor));
      docStyle.setProperty("--accent", interp(from.accent, to.accent, factor));

      // Border alpha interpolation
      const bAlpha = from.borderAlpha + factor * (to.borderAlpha - from.borderAlpha);
      const bRGB: RGB = factor > 0.5 ? to.borderRGB : from.borderRGB;
      docStyle.setProperty(
        "--border-color",
        `rgba(${bRGB[0]}, ${bRGB[1]}, ${bRGB[2]}, ${bAlpha.toFixed(3)})`
      );

      docStyle.setProperty(
        "--grid-line",
        factor > 0.5 ? to.gridLine : from.gridLine
      );
    };

    const profileEl = document.getElementById("profile");
    const experienceEl = document.getElementById("experience");
    const educationEl = document.getElementById("education");

    let trig0: ScrollTrigger | null = null;
    let trig1: ScrollTrigger | null = null;
    let trig2: ScrollTrigger | null = null;

    if (profileEl) {
      // 01. Hero (Deep Dark) → Profile & Work (Natural Light): ultra-smooth scrub into Section 2
      trig0 = ScrollTrigger.create({
        trigger: profileEl,
        start: "top 90%",
        end: "top 25%",
        scrub: 1.2,
        onUpdate: (self) => {
          const factor = Math.min(1, Math.max(0, self.progress));
          applyTheme(colorStops.dark, colorStops.light, factor);
        },
      });
    }

    if (experienceEl) {
      // 02. Profile & Work (Natural Light) → Experience & TechStack (Deep Dark)
      trig1 = ScrollTrigger.create({
        trigger: experienceEl,
        start: "top 65%",
        end: "top 10%",
        scrub: 1.2,
        onUpdate: (self) => {
          const factor = Math.min(1, Math.max(0, self.progress));
          applyTheme(colorStops.light, colorStops.dark, factor);
        },
      });
    }

    if (educationEl) {
      // 03. Experience (Deep Dark) → Education, Contact & Footer (Natural Light)
      trig2 = ScrollTrigger.create({
        trigger: educationEl,
        start: "top 70%",
        end: "top 20%",
        scrub: 1.2,
        onUpdate: (self) => {
          const factor = Math.min(1, Math.max(0, self.progress));
          applyTheme(colorStops.dark, colorStops.light, factor);
        },
      });
    }

    // Sync theme on initial load or resize/refresh
    const syncTheme = () => {
      if (trig2 && trig2.progress > 0) {
        applyTheme(colorStops.dark, colorStops.light, Math.min(1, Math.max(0, trig2.progress)));
      } else if (trig1 && trig1.progress > 0) {
        applyTheme(colorStops.light, colorStops.dark, Math.min(1, Math.max(0, trig1.progress)));
      } else if (trig0 && trig0.progress > 0) {
        applyTheme(colorStops.dark, colorStops.light, Math.min(1, Math.max(0, trig0.progress)));
      } else {
        // Hero section starts in cohesive dark theme
        applyTheme(colorStops.dark, colorStops.light, 0);
      }
    };

    ScrollTrigger.addEventListener("refresh", syncTheme);
    syncTheme();

    // Smooth section advance on slight scroll between Hero & Section 2 (Profile)
    let isTransitioning = false;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;
      const currentY = window.scrollY;
      const profileElement = document.getElementById("profile");
      if (!profileElement) return;

      const profileTop = profileElement.offsetTop;
      const heroThreshold = window.innerHeight * 0.45;

      // When user is on the Hero and scrolls down with slight intent:
      if (currentY < heroThreshold && e.deltaY > 10) {
        isTransitioning = true;
        lenis.scrollTo(profileElement, {
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
          lock: true,
          force: true,
          onComplete: () => {
            isTransitioning = false;
          },
        });
      }
      // Reverse: When near top of Profile and user scrolls up:
      else if (
        currentY >= profileTop - 60 &&
        currentY <= profileTop + 140 &&
        e.deltaY < -10
      ) {
        isTransitioning = true;
        lenis.scrollTo(0, {
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
          lock: true,
          force: true,
          onComplete: () => {
            isTransitioning = false;
          },
        });
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTransitioning || !e.touches[0]) return;
      const currentY = window.scrollY;
      const profileElement = document.getElementById("profile");
      if (!profileElement) return;

      const profileTop = profileElement.offsetTop;
      const heroThreshold = window.innerHeight * 0.45;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (currentY < heroThreshold && deltaY > 20) {
        isTransitioning = true;
        lenis.scrollTo(profileElement, {
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
          force: true,
          onComplete: () => {
            isTransitioning = false;
          },
        });
      } else if (
        currentY >= profileTop - 60 &&
        currentY <= profileTop + 140 &&
        deltaY < -20
      ) {
        isTransitioning = true;
        lenis.scrollTo(0, {
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
          force: true,
          onComplete: () => {
            isTransitioning = false;
          },
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      gsap.ticker.remove(rafTicker);
      delete window.__lenis;
      lenis.destroy();
      ScrollTrigger.removeEventListener("refresh", syncTheme);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div id="top" className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)] antialiased grain-overlay engineering-grid transition-colors duration-200">
      {/* Subtle Top Orange Scroll Progress Indicator */}
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left z-50 pointer-events-none"
      />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Sticky Minimal Navigation */}
      <Navbar />

      {/* Main Narrative Sections */}
      <main id="main-content" className="relative">
        {/* 01. Hero with letter-by-letter scroll role sequence */}
        <Hero />

        {/* 01. Profile Editorial Section */}
        <Profile />

        {/* 02. Selected Work (AI Document Assistant & Diabetic Retinopathy) */}
        <SelectedWork />

        {/* 03. Experience Timeline (Scroll-drawn spine & Dark -> Light transition) */}
        <ExperienceTimeline />

        {/* 04. Tech Stack Complete Arsenal & Authentic Logos */}
        <TechStack />

        {/* 05. Education & Certifications */}
        <EducationCertifications />

        {/* 07. Contact Section */}
        <Contact />
      </main>

      {/* 11. Minimal Footer */}
      <Footer />
    </div>
  );
}
