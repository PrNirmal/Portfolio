import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";

export interface MagneticButtonProps extends HTMLMotionProps<"a"> {
  children: ReactNode;
}

export function Magnetic({ children, className, ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });

  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };

  return (
    <motion.a
      ref={ref}
      style={{ x, y }}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export default Magnetic;
