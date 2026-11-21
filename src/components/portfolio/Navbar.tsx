import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, FileText } from "lucide-react";
import { PERSONAL_INFO } from "./portfolioData";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [elevated, setElevated] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("#main-content > section"),
    ).reverse();
    const root = document.documentElement;
    const anchorOffset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 76;
    const navSections = new Set(["work", "experience", "stack", "contact"]);
    let frame = 0;
    const update = () => {
      frame = 0;
      const boundary = anchorOffset + 1;
      const current = sections.find((section) => section.getBoundingClientRect().top <= boundary);
      const id = current?.id ?? "hero";
      const scrolled = window.scrollY > 20;
      setElevated(scrolled);
      setDark(!scrolled || id === "hero" || id === "experience" || id === "stack");
      setActiveSection(navSections.has(id) ? id : "");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(scheduleUpdate);
    sections.forEach((section) => observer.observe(section));
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("pageshow", scheduleUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  const navLinks = [
    { label: "WORK", id: "work" },
    { label: "EXPERIENCE", id: "experience" },
    { label: "STACK", id: "stack" },
    { label: "CONTACT", id: "contact" },
  ];

  return (
    <header
      className="site-nav fixed top-0 left-0 right-0 z-50"
      data-nav-elevated={elevated}
      data-nav-theme={dark ? "dark" : "light"}
    >
      <div className="site-nav-row mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex min-w-0 items-center gap-2.5 cursor-pointer"
          aria-label="Nirmal Kumar P R Home"
        >
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
              NIRMAL KUMAR P R
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors">
              JUNIOR AI ENGINEER
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeSection === link.id ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors relative py-1 ${
                activeSection === link.id
                  ? "text-[var(--accent)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-0 right-0 h-[1.5px] origin-left bg-[var(--accent)] transition-transform duration-300 ${activeSection === link.id ? "scale-x-100" : "scale-x-0"}`}
              />
            </a>
          ))}

          {/* Resume distinct button */}
          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white shadow-[0_0_12px_rgba(255,106,0,0.18)]"
          >
            <FileText size={12} className="transition-transform group-hover:scale-110" />
            <span>RESUME</span>
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="shrink-0 rounded-lg border border-[var(--border-color)] p-2 text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)] md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-var(--anchor-offset))] overflow-y-auto border-b border-[var(--border-color)] bg-[var(--surface)] px-6 py-6 shadow-2xl transition-colors md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={activeSection === link.id ? "location" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-mono text-sm tracking-[0.18em] py-2 transition-colors ${
                  activeSection === link.id
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-[var(--border-color)] pt-2">
              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/15 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                <FileText size={14} />
                <span>DOWNLOAD RESUME</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
