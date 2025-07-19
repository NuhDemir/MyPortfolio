import React, { useRef } from "react";
import { useGsapSplashAnimation } from "../../hooks/useGsapSplashAnimation";
import "./style/splash.css";

const Splash = ({ onComplete }) => {
  const splashContainerRef = useRef(null);
  const lettersRef = useRef([]);
  const backgroundCanvasRef = useRef(null); // Parçacık/grid arka planı için

  // "HOŞGELDİNİZ" yazısının harfleri
  const letters = "HOŞGELDİNİZ".split("");

  // GSAP animasyonunu başlat
  const { animationComplete } = useGsapSplashAnimation(
    splashContainerRef,
    lettersRef,
    onComplete,
    backgroundCanvasRef // Yeni ref'i ilet
  );

  return (
    <div
      ref={splashContainerRef}
      className={`splash-container ${animationComplete ? "hide" : ""}`}
    >
      {/* Canvas/Grid/Scanlines için Arka Plan Elemanı */}
      <div ref={backgroundCanvasRef} className="splash-background-canvas"></div>
      <div className="scanline-overlay"></div> {/* Scanlines efekti için */}
      <div className="letters-container">
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={(el) => (lettersRef.current[index] = el)}
            className="splash-letter"
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div className="splash-loader-bar-container">
        <div className="splash-loader-bar"></div>
      </div>
    </div>
  );
};

export default Splash;
