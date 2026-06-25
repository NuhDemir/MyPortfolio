import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const DURATION = 0.35;

export const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;

    if (!containerRef.current) return;

    window.scrollTo({ top: 0, behavior: "instant" });

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        containerRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATION, ease: "power2.out" },
      );
    });

    return () => ctxRef.current?.revert();
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="page-transition-wrapper"
      style={{ minHeight: "100vh", willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
};
