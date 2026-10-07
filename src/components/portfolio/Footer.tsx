import { ArrowUp } from "lucide-react";
import { PERSONAL_INFO } from "./portfolioData";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--surface)] py-6 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Colophon */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--text-primary)]">
              {PERSONAL_INFO.name}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
              {PERSONAL_INFO.role}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 font-mono text-xs text-[var(--text-muted)]">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              Email
            </a>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
            <span>© {PERSONAL_INFO.copyrightYear} {PERSONAL_INFO.name}</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex size-8 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
