"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type MotionDensity = "plus" | "avancado" | "premium";

const tokens = {
  plus: { y: 12, duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  avancado: { y: 18, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  premium: { y: 28, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

type FadeProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  density?: MotionDensity;
  y?: number;
};

export function Fade({
  children,
  className,
  delay = 0,
  immediate = false,
  density = "avancado",
  y,
}: FadeProps) {
  const reduce = useReducedMotion();
  const token = tokens[density];
  const hidden = reduce ? false : { opacity: 0, y: y ?? token.y };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={immediate || reduce ? shown : undefined}
      whileInView={immediate || reduce ? undefined : shown}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: token.duration, delay, ease: token.ease }}
    >
      {children}
    </motion.div>
  );
}

export function FadeUp(props: Omit<FadeProps, "density">) {
  return <Fade density="avancado" {...props} />;
}

export function Reveal(props: Omit<FadeProps, "density">) {
  return <Fade density="premium" {...props} />;
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
      transition={{ duration: 0.4, delay, ease: tokens.avancado.ease }}
      whileHover={reduce ? undefined : { y: -3 }}
    >
      {children}
    </motion.article>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.65, ease: tokens.premium.ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RuleGrow({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("h-px origin-left bg-ink", className)}
      initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: tokens.premium.ease }}
    />
  );
}

export function FloatCta({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.15, ease: tokens.premium.ease }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
