import { useEffect, useState } from "react";
import { useAnimation } from "framer-motion";

export const revealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const useScrollReveal = ({
  variant = "fadeUp",
  threshold = 0.1,
  delay = 0,
  once = true,
  duration = 0.55,
} = {}) => {
  const controls = useAnimation();
  const [node, setNode] = useState(null);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          controls.start("visible");
          if (once) observer.disconnect();
        } else if (!once) {
          controls.start("hidden");
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, controls, threshold, once]);

  return {
    ref: setNode,
    variants: revealVariants[variant] || revealVariants.fadeUp,
    initial: "hidden",
    animate: controls,
    transition: { duration, delay, ease: [0.22, 0, 0, 1] },
  };
};
