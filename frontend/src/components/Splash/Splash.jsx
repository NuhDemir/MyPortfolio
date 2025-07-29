import React, { useRef } from "react";
import { useGsapSplashAnimation } from "../../hooks/useGsapSplashAnimation";
import styles from "./Splash.module.css";

const Splash = ({ onComplete }) => {
  const splashContainerRef = useRef(null);
  const lettersRef = useRef([]);
  const particleCanvasRef = useRef(null); // Matrix yerine parçacık canvas'ı
  const subtitleRef = useRef(null); // Subtitle için ref
  const loaderBarFillRef = useRef(null); // Yükleme çubuğunun dolan kısmı için ref
  const loaderContainerRef = useRef(null); // Yükleme çubuğunun tamamı için ref

  const letters = "NUH DEMİR".split("");

  // Hook'u yeni referanslarla güncelle
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
      {/* Arka plan parçacıkları için Canvas */}
      <canvas ref={particleCanvasRef} className={styles.particleCanvas} />

      {/* Ana içerik ortalanmış bir kutu içinde */}
      <div className={styles.mainContent}>
        <div className={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <div key={index} className={styles.letterWrapper}>
              <span
                ref={(el) => (lettersRef.current[index] = el)}
                className={styles.splashLetter}
              >
                {/* Boşluk karakteri için özel render */}
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

      {/* Stilize edilmiş köşe dekorasyonları */}
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
