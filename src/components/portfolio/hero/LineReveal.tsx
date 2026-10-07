import { type ReactNode } from "react";
import { motion, type Transition } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export interface LineRevealProps {
  children: ReactNode;
  delay?: number;
}

export function LineReveal({ children, delay = 0 }: LineRevealProps) {
  return (
    <span className="mask">
      <motion.span
        initial={{ y: "115%", rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1.1, ease, delay } as Transition}
        style={{ display: "inline-block" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default LineReveal;
