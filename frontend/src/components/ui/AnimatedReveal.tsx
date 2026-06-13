import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, fadeLeft, fadeRight, scaleIn, blurToFocus } from "@/lib/animations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type AnimationVariant = "fadeUp" | "fadeLeft" | "fadeRight" | "scaleIn" | "blurToFocus";

const variantsMap = {
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
  blurToFocus,
};

interface AnimatedRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  once?: boolean;
  className?: string;
}

export function AnimatedReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  once = true,
  className,
  ...props
}: AnimatedRevealProps) {
  const { ref, isInView } = useScrollReveal(once);
  const selectedVariant = variantsMap[variant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariant}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
