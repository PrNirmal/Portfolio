import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, FileText } from "lucide-react";
import { PERSONAL_INFO } from "./portfolioData";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Hero section: no nav tab should be highlighted when on hero section
      const heroEl = document.getElementById("hero");
      const heroThreshold = heroEl
        ? heroEl.offsetTop + heroEl.offsetHeight - 180
        : window.innerHeight * 0.8;

      if (window.scrollY < heroThreshold) {
        setActiveSection("");
        return;
      }

      // Identify active section using getBoundingClientRect
      const sections = ["work", "experience", "stack", "contact"];
      let currentSection = "";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom > 180) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "WORK", href: "#work", id: "work" },
    { label: "EXPERIENCE", href: "#experience", id: "experience" },
    { label: "STACK", href: "#stack", id: "stack" },
    { label: "CONTACT", href: "#contact", id: "contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === "#top" || href === "#hero") {
      setActiveSection("");
      if (typeof window.__lenis?.scrollTo === "function") {
        window.__lenis.scrollTo(0, { duration: 1.6 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-editorial ${
        isScrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border-color)] py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, "#top")}
          className="group flex items-center gap-2.5 cursor-pointer"
          aria-label="Nirmal Kumar P R Home"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          <div className="flex flex-col">
            <span
              className={`font-mono text-xs font-bold tracking-[0.2em] transition-colors group-hover:text-[var(--accent)] ${
                isScrolled ? "text-[var(--text-primary)]" : "text-[#f5f3ee]"
              }`}
            >
              NIRMAL KUMAR P R
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                isScrolled ? "text-[var(--text-muted)]" : "text-[#a8a29e]"
              }`}
            >
              JUNIOR AI ENGINEER
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors relative py-1 ${
                activeSection === link.id
                  ? "text-[var(--accent)] font-semibold"
                  : isScrolled
                  ? "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  : "text-[#a8a29e] hover:text-[#f5f3ee]"
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--accent)]" />
              )}
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
          className={`rounded-lg p-2 transition-colors md:hidden ${
            isScrolled
              ? "border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
              : "border border-white/20 text-[#f5f3ee] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-white/5 backdrop-blur-sm"
          }`}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`border-b px-6 py-6 md:hidden shadow-2xl transition-colors ${
            isScrolled
              ? "bg-[var(--surface)]/95 border-[var(--border-color)] backdrop-blur-xl"
              : "bg-[#121215]/95 border-white/10 text-[#f5f3ee] backdrop-blur-xl"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-mono text-sm tracking-[0.18em] py-2 transition-colors ${
                  activeSection === link.id
                    ? "text-[var(--accent)] font-semibold"
                    : isScrolled
                    ? "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                    : "text-[#cfcac0] hover:text-[#f5f3ee]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className={`pt-2 border-t ${isScrolled ? "border-[var(--border-color)]" : "border-white/10"}`}>
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
