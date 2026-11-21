import type { ReactNode } from "react";

export function SectionHeader({
  label,
  caption,
  children,
  className = "",
  reveal = false,
}: {
  label: string;
  caption: string;
  children?: ReactNode;
  className?: string;
  reveal?: boolean;
}) {
  return (
    <header data-scroll-reveal={reveal ? "" : undefined} className={`section-header ${className}`}>
      <span className="section-header-label">
        {label}
        <span className="section-header-dot" aria-hidden="true" />
      </span>
      <span className="section-header-caption">{caption}</span>
      {children}
    </header>
  );
}
