import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

const BUTTON_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 26,
  mass: 0.5,
};

export default function HoverButton({
  children,
  className = '',
  whileHover,
  whileTap,
  transition,
  ...props
}: HTMLMotionProps<'button'>) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.button className={className} {...props}>
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      className={className}
      whileHover={whileHover ?? { scale: 1.02 }}
      whileTap={whileTap ?? { scale: 0.97 }}
      transition={transition ?? BUTTON_SPRING}
      {...props}
    >
      {children}
    </motion.button>
  );
}
