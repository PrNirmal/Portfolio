import type { ReactNode } from "react";

export function LineReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="mask">
      <span className="hero-line-reveal" style={{ animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  );
}
