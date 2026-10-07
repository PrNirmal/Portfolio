import { useState } from "react";
import { Mail, Linkedin, Github, Check, Copy, ArrowUpRight, Phone } from "lucide-react";
import { PERSONAL_INFO } from "./portfolioData";
import { useScrollReveal } from "./useScrollReveal";

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const sectionRef = useScrollReveal();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phoneRaw);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative border-t border-[var(--border-color)] pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 lg:pb-14 overflow-hidden transition-colors duration-500"
    >
      {/* Background Subtle Orange Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.12)_0%,rgba(201,79,0,0.02)_60%,transparent_80%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        {/* Section Header */}
        <div className="sr inline-flex items-center gap-2.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)] mb-8 shadow-sm" data-sr="scale">
          <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>06 / GET IN TOUCH</span>
        </div>

        {/* Headline */}
        <div className="sr overflow-hidden" data-sr="blur" data-sr-distance="40">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.035em] text-[var(--text-primary)] leading-[1.05] uppercase">
            HAVE AN IDEA?
            <br />
            <span className="text-[var(--accent)]">LET'S BUILD SOMETHING.</span>
          </h2>
        </div>

        <p className="sr mx-auto mt-6 max-w-[48ch] text-base sm:text-lg text-[var(--text-muted)] leading-relaxed" data-sr="up" data-sr-delay="0.12">
          Open to opportunities in software engineering, AI engineering and AI application development.
        </p>

        {/* Direct Contact Actions Display */}
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5" data-sr-stagger="0.1" data-sr="up">
          <div className="sr-child inline-flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--surface-raised)]">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="group inline-flex items-center gap-2 pl-5 pr-3 py-4 font-mono text-xs text-[var(--text-primary)]"
              aria-label={`Send email to ${PERSONAL_INFO.email}`}
            >
              <Mail size={14} className="text-[var(--accent)]" />
              <span>{PERSONAL_INFO.email}</span>
              <ArrowUpRight
                size={14}
                className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <div className="h-4 w-px bg-[var(--border-color)]" />
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3.5 py-4 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              title="Copy email address"
              aria-label="Copy email address"
            >
              {copiedEmail ? (
                <Check size={14} className="text-[var(--accent)]" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          <div className="sr-child inline-flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--surface-raised)]">
            <a
              href={`tel:${PERSONAL_INFO.phoneRaw}`}
              className="group inline-flex items-center gap-2 pl-5 pr-3 py-4 font-mono text-xs text-[var(--text-primary)]"
              aria-label={`Call ${PERSONAL_INFO.phone}`}
            >
              <Phone size={14} className="text-[var(--accent)]" />
              <span>{PERSONAL_INFO.phone}</span>
              <ArrowUpRight
                size={14}
                className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <div className="h-4 w-px bg-[var(--border-color)]" />
            <button
              type="button"
              onClick={handleCopyPhone}
              className="px-3.5 py-4 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              title="Copy phone number"
              aria-label="Copy phone number"
            >
              {copiedPhone ? (
                <Check size={14} className="text-[var(--accent)]" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-10 border-t border-[var(--border-color)]/70" data-sr-stagger="0.08" data-sr="up" data-sr-delay="0.15">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="sr-child group flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-sm"
          >
            <Github size={15} className="text-[var(--accent)]" />
            <span>GITHUB</span>
            <ArrowUpRight
              size={13}
              className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="sr-child group flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-sm"
          >
            <Linkedin size={15} className="text-[var(--accent)]" />
            <span>LINKEDIN</span>
            <ArrowUpRight
              size={13}
              className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
