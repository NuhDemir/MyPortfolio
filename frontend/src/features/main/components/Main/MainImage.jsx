import React, { memo, forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "@core";

const LOGO_LIGHT = "/logo/logo-portfolio.png";
const LOGO_DARK = "/logo/logo-portfolio-dark.png";

const MainImage = forwardRef(({ isPlaying }, ref) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const toasterRef = useRef(null);
  const imgRef = useRef(null);
  const quoteRef = useRef({ current: null, timer: null });
  const spinRef = useRef(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const logoSrc = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  const assignRefs = (node) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (isPlaying) {
      spinRef.current = gsap.to(img, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "linear",
      });
    } else {
      if (spinRef.current) {
        spinRef.current.kill();
        spinRef.current = null;
      }
      gsap.to(img, {
        rotation: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    return () => {
      if (spinRef.current) {
        spinRef.current.kill();
        spinRef.current = null;
      }
    };
  }, [isPlaying]);

  const showQuote = () => {
    if (quoteRef.current.timer) clearTimeout(quoteRef.current.timer);
    if (toasterRef.current) {
      toasterRef.current.textContent = quoteRef.current.current;
      gsap.to(toasterRef.current, {
        opacity: 1, y: 15, visibility: "visible", duration: 0.3, ease: "power2.out",
      });
    }
  };

  const hideQuote = () => {
    quoteRef.current.timer = setTimeout(() => {
      if (toasterRef.current) {
        gsap.to(toasterRef.current, {
          opacity: 0, y: 0, visibility: "hidden", duration: 0.3, ease: "power2.in",
        });
      }
    }, 150);
  };

  return (
    <div
      ref={assignRefs}
      className={`main-image ${isPlaying ? "main-image--spinning" : ""}`}
      onMouseEnter={showQuote}
      onMouseLeave={hideQuote}
      onTouchStart={showQuote}
      onTouchEnd={hideQuote}
    >
      {!isImageReady && (
        <div className="main-image-loader" aria-live="polite">
          <div className="main-image-loader-chip">YUKLENIYOR</div>
          <div className="main-image-loader-track" aria-hidden="true">
            <span className="main-image-loader-bar" />
          </div>
        </div>
      )}

      {hasImageError && (
        <div className="main-image-error" aria-live="polite">
          <span>Hero yuklenmedi</span>
        </div>
      )}

      <img
        ref={imgRef}
        key={logoSrc}
        src={logoSrc}
        alt="Hero illustration"
        className="main-image-visual"
        onLoad={() => setIsImageReady(true)}
        onError={() => setHasImageError(true)}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
});

MainImage.displayName = "MainImage";
export default memo(MainImage);
