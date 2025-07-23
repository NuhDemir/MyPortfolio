import React, { useRef } from "react";
import { useGsapSplashAnimation } from "../../hooks/useGsapSplashAnimation";
import styles from "./Splash.module.css";

const Splash = ({ onComplete }) => {
  const splashContainerRef = useRef(null);
  const lettersRef = useRef([]);
  const matrixCanvasRef = useRef(null);
  const loaderRef = useRef(null);

  const letters = "NUH DEMİR".split("");

  const { animationComplete } = useGsapSplashAnimation(
    splashContainerRef,
    lettersRef,
    matrixCanvasRef,
    loaderRef,
    onComplete
  );

  return (
    <div
      ref={splashContainerRef}
      className={`${styles.splashContainer} ${
        animationComplete ? styles.hide : ""
      }`}
    >
      <canvas ref={matrixCanvasRef} className={styles.matrixCanvas} />

      <div className={styles.scanlineOverlay}></div>

      <div className={styles.mainContent}>
        <div className={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              className={styles.splashLetter}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className={styles.subtitleContainer}>
          <span className={styles.subtitle}>FULL STACK DEVELOPER</span>
        </div>

        <div className={styles.loaderContainer}>
          <div ref={loaderRef} className={styles.loaderBar}></div>
          <div className={styles.loaderText}>INITIALIZING MATRIX...</div>
        </div>
      </div>

      <div className={styles.cornerDecorations}>
        <div className={styles.cornerTopLeft}></div>
        <div className={styles.cornerTopRight}></div>
        <div className={styles.cornerBottomLeft}></div>
        <div className={styles.cornerBottomRight}></div>
      </div>

      <div className={styles.noiseOverlay}></div>
    </div>
  );
};

export default Splash;
