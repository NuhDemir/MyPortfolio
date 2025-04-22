import React, { useRef } from "react";
import { useGsapSplashAnimation } from "../../hooks/useGsapSplashAnimation";
import "./style/splash.css";

const Splash = ({ onComplete }) => {
  const splashContainerRef = useRef(null);
  const lettersRef = useRef([]);

  // "NUH DEMİR" yazısının harfleri
  const letters = "HOŞGELDİNİZ".split("");

  // GSAP animasyonunu başlat
  const { animationComplete } = useGsapSplashAnimation(
    splashContainerRef,
    lettersRef,
    onComplete
  );

  return (
    <div
      ref={splashContainerRef}
      className={`splash-container ${animationComplete ? "hide" : ""}`}
    >
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
    </div>
  );
};

export default Splash;
