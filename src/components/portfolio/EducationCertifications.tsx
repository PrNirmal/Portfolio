import { GraduationCap, Award, Calendar } from "lucide-react";
import { EDUCATION, CERTIFICATIONS } from "./portfolioData";
import { useScrollReveal } from "./useScrollReveal";

export function EducationCertifications() {
  const sectionRef = useScrollReveal();
  return (
    <section ref={sectionRef} id="education" className="relative border-t border-[var(--border-color)] py-20 sm:py-28 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="sr flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-14" data-sr="up">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              05 / EDUCATION
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            ACADEMIC & CERTIFICATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Education Column */}
          <div className="lg:col-span-6">
            <div className="sr flex items-center gap-2.5 mb-6" data-sr="left">
              <GraduationCap size={18} className="text-[var(--accent)]" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
                DEGREE PROGRAM
              </span>
            </div>

            <div className="sr rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-8" data-sr="scale" data-sr-delay="0.08">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {EDUCATION.degree}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)]">{EDUCATION.institution}</p>

              <div className="mt-6 pt-5 border-t border-[var(--border-color)]/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                  <Calendar size={13} className="text-[var(--accent)]" />
                  <span>{EDUCATION.period}</span>
                </div>
                <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-bold text-[var(--accent)]">
                  CGPA: {EDUCATION.cgpa}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications Column */}
          <div className="lg:col-span-6">
            <div className="sr flex items-center gap-2.5 mb-6" data-sr="right">
              <Award size={18} className="text-[var(--accent)]" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
                INDUSTRY CREDENTIALS
              </span>
            </div>

            <div className="space-y-4" data-sr-stagger="0.1" data-sr="up">
              {CERTIFICATIONS.map((cert, index) => (
                <div
                  key={index}
                  className="sr-child rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--surface-raised)]"
                >
                  <h4 className="font-mono text-sm font-bold text-[var(--text-primary)]">{cert.title}</h4>
                  <div className="mt-2 flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
                    <span>ISSUER</span>
                    <span className="font-semibold text-[var(--accent)]">{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
