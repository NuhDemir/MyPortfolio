import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

const TITLE_TEXT = "NUH demir";

const Title = forwardRef((_, ref) => {
  const titleRootRef = useRef(null);
  const doodleRef = useRef(null);
  const letterRefs = useRef([]);
  const chars = useMemo(() => Array.from(TITLE_TEXT), []);

  useLayoutEffect(() => {
    const letters = letterRefs.current.filter(Boolean);
    if (!letters.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(letters, {
        autoAlpha: 0,
        y: -220,
        x: () => gsap.utils.random(-90, 90),
        rotate: () => gsap.utils.random(-38, 38),
        scale: () => gsap.utils.random(0.65, 1.2),
      });

      gsap.to(letters, {
        keyframes: [
          { autoAlpha: 1, duration: 0.01 },
          { y: 24, duration: 0.52, ease: "power2.in" },
          {
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            duration: 0.74,
            ease: "bounce.out",
          },
        ],
        stagger: { each: 0.045, from: "random" },
        delay: 0.28,
        clearProps: "opacity,visibility,transform",
      });

      if (doodleRef.current) {
        gsap.fromTo(
          doodleRef.current,
          {
            autoAlpha: 0,
            scale: 0,
            y: -20,
            rotate: -80,
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.6,
            delay: 0.72,
            ease: "back.out(2)",
            clearProps: "opacity,visibility,transform",
          },
        );
      }
    }, titleRootRef);

    return () => {
      ctx.revert();
      letterRefs.current = [];
    };
  }, []);

  const setTitleRef = (node) => {
    titleRootRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <h1 ref={setTitleRef} className="main-title" aria-label={TITLE_TEXT}>
      <span className="main-title-text">
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={`main-title-letter${char === " " ? " main-title-letter--space" : ""}`}
            ref={(node) => {
              letterRefs.current[index] = node;
            }}
            aria-hidden="true"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span ref={doodleRef} className="main-title-doodle" aria-hidden="true">
        *
      </span>
    </h1>
  );
});

export default Title;
