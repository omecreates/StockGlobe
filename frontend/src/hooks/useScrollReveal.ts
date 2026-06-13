import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollReveal(once = true, margin = "-50px") {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });

  return { ref, isInView };
}
