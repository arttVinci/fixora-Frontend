import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;

  hover?: 'card' | 'none';
};

const CARD_SPRING = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 24,
  mass: 0.7,
};

export default function Reveal({
  children,
  delay = 0,
  className,
  hover = 'none',
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
      
      whileHover={
        !shouldReduceMotion && hover === 'card'
          ? { y: -5, transition: CARD_SPRING }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
