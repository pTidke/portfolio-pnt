"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import type { ReactNode } from "react";

/* Premium easing + spring presets, used everywhere for a coherent feel. */
export const EASE = [0.22, 1, 0.36, 1] as const; // easeOutExpo-ish
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

/* Stagger container — children reveal in sequence. */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

/* A single revealed child: lifts + fades in. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/* Convenience wrapper: a block that staggers its children in.
   `inView` reveals on scroll-into-view (once); otherwise on mount. */
export function Stagger({
  children,
  className,
  inView = false,
}: {
  children: ReactNode;
  className?: string;
  inView?: boolean;
}) {
  const reveal = inView
    ? ({ whileInView: "show", viewport: { once: true, margin: "-12% 0px" } } as const)
    : ({ animate: "show" } as const);
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      {...reveal}
    >
      {children}
    </motion.div>
  );
}

/* Convenience wrapper: a single child of a Stagger. */
export function Item({
  children,
  className,
  variants = revealUp,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
