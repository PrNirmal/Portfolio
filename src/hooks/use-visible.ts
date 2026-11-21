import { useEffect, useState, type RefObject } from "react";

export function useVisible(ref: RefObject<Element | null>, rootMargin = "0px", enabled = true) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let intersects = false;
    const update = () => setVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = Boolean(entry?.isIntersecting);
        update();
      },
      { rootMargin },
    );

    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [enabled, ref, rootMargin]);

  return enabled && visible;
}
