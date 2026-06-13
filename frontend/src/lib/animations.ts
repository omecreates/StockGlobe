export const ease = [0.16, 1, 0.3, 1]; // Premium custom easing

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease } 
  }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease } 
  }
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease } 
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.8, ease } 
  }
};

export const blurToFocus = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { duration: 1, ease } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

// Use for cards, dashboard elements
export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.3, ease: "easeOut" }
};
