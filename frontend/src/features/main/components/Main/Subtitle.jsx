import React, { forwardRef, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const SUBTITLE_TEXT = "Frontend Developer & Mobile Developer";

const Subtitle = forwardRef((_, ref) => {
  const subtitleRootRef = useRef(null);
  const subtitleTextRef = useRef(null);
  const sparkRef = useRef(null);

  useLayoutEffect(() => {
    const subtitleNode = subtitleRootRef.current;
    const textNode = subtitleTextRef.current;

    if (!subtitleNode || !textNode) {
      return undefined;
    }

    const typingState = { charIndex: 0 };

    const ctx = gsap.context(() => {
      textNode.textContent = "";

      gsap.set(subtitleNode, {
        autoAlpha: 0,
        y: -220,
        x: gsap.utils.random(-80, 80),
        rotate: gsap.utils.random(-22, 22),
        scale: gsap.utils.random(0.72, 1.1),
      });

      const tl = gsap.timeline({ defaults: { immediateRender: false } });

      tl.to(subtitleNode, {
        autoAlpha: 1,
        y: 26,
        duration: 0.52,
        ease: "power2.in",
      })
        .to(subtitleNode, {
          x: 0,
          y: 0,
          rotate: -0.8,
          scale: 1,
          duration: 0.78,
          ease: "bounce.out",
        })
        .to(
          typingState,
          {
            charIndex: SUBTITLE_TEXT.length,
            duration: 1.55,
            ease: "none",
            snap: { charIndex: 1 },
            onUpdate: () => {
              textNode.textContent = SUBTITLE_TEXT.slice(0, typingState.charIndex);
            },
          },
          "-=0.05",
        );

      if (sparkRef.current) {
        tl.fromTo(
          sparkRef.current,
          {
            autoAlpha: 0,
            scale: 0,
            rotate: -85,
            y: -10,
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: -11,
            y: 0,
            duration: 0.5,
            ease: "back.out(2)",
          },
          "<0.2",
        );
      }
    }, subtitleNode);

    return () => {
      ctx.revert();
    };
  }, []);

  const setSubtitleRef = (node) => {
    subtitleRootRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <p ref={setSubtitleRef} className="main-subtitle" aria-label={SUBTITLE_TEXT}>
      <span ref={subtitleTextRef} className="main-subtitle-text main-subtitle-text--typing" />
      <span className="main-subtitle-cursor" aria-hidden="true">
        |
      </span>
      <span ref={sparkRef} className="main-subtitle-spark" aria-hidden="true">
        ~
      </span>
    </p>
  );
});

export default Subtitle;
