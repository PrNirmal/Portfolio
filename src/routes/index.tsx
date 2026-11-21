import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CustomCursor } from "../components/portfolio/CustomCursor";
import { Navbar } from "../components/portfolio/Navbar";
import { PortfolioIntro } from "../components/portfolio/PortfolioIntro";
import { Hero } from "../components/portfolio/Hero";
import { Profile } from "../components/portfolio/Profile";
import { SelectedWork } from "../components/portfolio/SelectedWork";
import { ExperienceTimeline } from "../components/portfolio/ExperienceTimeline";
import { TechStack } from "../components/portfolio/TechStack";
import { EducationCertifications } from "../components/portfolio/EducationCertifications";
import { Contact } from "../components/portfolio/Contact";
import { Footer } from "../components/portfolio/Footer";
import { PERSONAL_INFO } from "../components/portfolio/portfolioData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirmal Kumar P R — Junior AI Engineer & Software Developer" },
      {
        name: "description",
        content:
          "Junior AI Engineer with extensive experience in software development, enterprise SaaS, Generative AI, RAG and intelligent automation.",
      },
      {
        property: "og:title",
        content: "Nirmal Kumar P R — Junior AI Engineer & Software Developer",
      },
      {
        property: "og:description",
        content: "Building software and intelligent applications that solve real problems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Nirmal Kumar P R — Junior AI Engineer & Software Developer",
      },
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
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(scheduleUpdate);
    resize.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    update();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <PortfolioIntro />
      <div
        id="top"
        className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)] antialiased"
      >
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

          {/* 03. Experience Timeline */}
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
    </>
  );
}
