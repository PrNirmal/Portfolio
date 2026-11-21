import { useLayoutEffect, useRef } from "react";
import { PERSONAL_INFO } from "./portfolioData";

const storageKey = "portfolio-intro-seen";

// This also runs inline before first paint, so keep it independent of module state.
function playIntro(intro: HTMLElement, key: string) {
  if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // The intro is optional when the browser cannot remember that it played.
    return;
  }

  intro.setAttribute("data-playing", "");
}

const introScript = `(${playIntro.toString()})(document.currentScript.parentElement, ${JSON.stringify(storageKey)});`;

export function PortfolioIntro() {
  const introRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    // The inline script runs on a document load. This also covers client navigation.
    playIntro(intro, storageKey);
    const [animation] = intro.getAnimations();
    const finish = () => intro.removeAttribute("data-playing");
    void animation?.finished.then(finish, finish);
  }, []);

  return (
    <div ref={introRef} className="portfolio-intro" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: introScript }} suppressHydrationWarning />
      <div className="portfolio-intro-content">
        <div className="portfolio-intro-mark" aria-hidden="true">
          <span className="portfolio-intro-orbit" />
          <span className="portfolio-intro-orbit portfolio-intro-orbit-cross" />
          <span className="portfolio-intro-core" />
        </div>
        <p className="portfolio-intro-name">{PERSONAL_INFO.name}</p>
        <p className="portfolio-intro-status" role="status">
          Loading portfolio
        </p>
        <div className="portfolio-intro-track" aria-hidden="true" />
      </div>
    </div>
  );
}
