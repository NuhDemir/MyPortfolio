import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const TRANSITION_DURATION = 0.8;
const EASE = "power2.inOut";

export const usePageTransition = () => {
  const containerRef = useRef(null);
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: TRANSITION_DURATION / 2, ease: "power2.out" }
        );
      }
      prevLocationRef.current = location.pathname;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();

    tl.to(container, {
      x: "100%",
      opacity: 0,
      duration: TRANSITION_DURATION / 2,
      ease: EASE,
      onComplete: () => {
        prevLocationRef.current = location.pathname;
        window.scrollTo({ top: 0, behavior: "instant" });
      },
    });

    tl.fromTo(
      container,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: TRANSITION_DURATION / 2, ease: EASE }
    );

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return { containerRef };
};
