import React, { useRef } from "react";
import { useGsapSplashAnimation } from "../../hooks/useGsapSplashAnimation";
import styles from "./Splash.module.css";

const Splash = ({ onComplete }) => {
  const splashContainerRef = useRef(null);
  const lettersRef = useRef([]);
  const particleCanvasRef = useRef(null);
  const subtitleRef = useRef(null);
  const loaderBarFillRef = useRef(null);
  const loaderContainerRef = useRef(null);

  const letters = "NUH DEMİR".split("");

  const { animationComplete } = useGsapSplashAnimation(
    splashContainerRef,
    lettersRef,
    particleCanvasRef,
    subtitleRef,
    loaderBarFillRef,
    loaderContainerRef,
    onComplete
  );

  return (
    <div
      ref={splashContainerRef}
      className={`${styles.splashContainer} ${
        animationComplete ? styles.hide : ""
      }`}
    >
      <canvas ref={particleCanvasRef} className={styles.particleCanvas} />

      <div className={styles.mainContent}>
        <div className={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <div key={index} className={styles.letterWrapper}>
              <span
                ref={(el) => (lettersRef.current[index] = el)}
                className={styles.splashLetter}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.subtitleContainer}>
          <span ref={subtitleRef} className={styles.subtitle}>
            FULL STACK DEVELOPER
          </span>
        </div>

        <div ref={loaderContainerRef} className={styles.loaderContainer}>
          <div ref={loaderBarFillRef} className={styles.loaderBarFill}></div>
        </div>
      </div>

      <div className={styles.cornerDecorations}>
        <div className={`${styles.corner} ${styles.cornerTopLeft}`}></div>
        <div className={`${styles.corner} ${styles.cornerTopRight}`}></div>
        <div className={`${styles.corner} ${styles.cornerBottomLeft}`}></div>
        <div className={`${styles.corner} ${styles.cornerBottomRight}`}></div>
      </div>
    </div>
  );
};

export default Splash;
