import { useEffect, useRef } from "react";
import gsap from "gsap";

const useLoadingAnimation = (show) => {
  const splashRef = useRef();

  useEffect(() => {
    if (show) {
      gsap.fromTo(
        splashRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.to(splashRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [show]);

  return splashRef;
};

export default useLoadingAnimation;
