"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function FadeUp({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const hidden = reduce ? false : { opacity: 0, y: 18 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={immediate || reduce ? shown : undefined}
      whileInView={immediate || reduce ? undefined : shown}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ProofCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const hidden = reduce ? false : { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.article
      className={cn(
        "border border-line bg-white p-5 transition-colors duration-200 hover:border-ink",
        className,
      )}
      initial={hidden}
      animate={reduce ? shown : undefined}
      whileInView={reduce ? undefined : shown}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease }}
      whileHover={reduce ? undefined : { y: -3 }}
    >
      {children}
    </motion.article>
  );
}
