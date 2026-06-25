import { useRef, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const HALF_DURATION = 0.4;

export const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const [stage, setStage] = useState("entering");
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const childrenAtPathRef = useRef({});
  const ctxRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    childrenAtPathRef.current[location.pathname] = children;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.pathname !== displayPath) {
      setStage("exiting");
    }
  }, [location.pathname, displayPath]);

  const transitionToEntering = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setDisplayPath(location.pathname);
    setStage("entering");
  }, [location.pathname]);

  useEffect(() => {
    if (stage === "exiting" && containerRef.current) {
      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.to(containerRef.current, {
          x: "100%",
          opacity: 0,
          duration: HALF_DURATION,
          ease: "power2.in",
          onComplete: transitionToEntering,
        });
      });
    }
  }, [stage, transitionToEntering]);

  useEffect(() => {
    if (stage === "entering" && containerRef.current) {
      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { x: "-100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: HALF_DURATION,
            ease: "power2.out",
            onComplete: () => setStage("entered"),
          }
        );
      });
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  const displayChildren =
    stage === "exiting"
      ? childrenAtPathRef.current[displayPath]
      : children;

  return (
    <div
      ref={containerRef}
      className="page-transition-wrapper"
      style={{ minHeight: "100vh", willChange: "transform, opacity" }}
    >
      {displayChildren}
    </div>
  );
};
