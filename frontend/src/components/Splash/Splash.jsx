import React, { useEffect, useRef, useState } from "react";

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const [animationPhase, setAnimationPhase] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const nameLetters = "NUH DEMİR".split("");
  const titles = ["CREATIVE", "DEVELOPER", "DESIGNER"];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  // Particle system
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Loading
      await new Promise((resolve) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 15 + 5;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            resolve();
          }
          setProgress(currentProgress);
        }, 150);
      });

      // Phase 2: Letters animation
      setAnimationPhase("letters");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Phase 3: Title cycling
      setAnimationPhase("titles");
      let titleCycle = 0;
      const titleInterval = setInterval(() => {
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        titleCycle++;
        if (titleCycle >= 6) {
          clearInterval(titleInterval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onComplete && onComplete(), 800);
          }, 1000);
        }
      }, 600);
    };

    const timer = setTimeout(sequence, 500);
    return () => clearTimeout(timer);
  }, [onComplete, titles.length]);

  return (
    <div
      ref={containerRef}
      className={`splash-container ${isExiting ? "exiting" : ""}`}
    >
      <canvas ref={particleCanvasRef} className="particle-canvas" />

      {/* Geometric decorations */}
      <div className="geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        {/* Header badge */}
        <div className="header-badge">
          <span className="badge-text">PORTFOLIO 2025</span>
        </div>

        {/* Name letters */}
        <div className="name-container">
          {nameLetters.map((letter, index) => (
            <div
              key={index}
              className={`letter ${
                animationPhase === "letters" ? "animate" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter === " " ? "" : letter}
            </div>
          ))}
        </div>

        {/* Animated title */}
        <div className="title-container">
          <div
            className={`title ${animationPhase === "titles" ? "active" : ""}`}
          >
            {titles[currentTitleIndex]}
          </div>
        </div>

        {/* Progress section */}
        <div className="progress-section">
          <div className="progress-label">
            {animationPhase === "loading" &&
              `LOADING... ${Math.round(progress)}%`}
            {animationPhase === "letters" && "INITIALIZING..."}
            {animationPhase === "titles" && "READY TO EXPLORE"}
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: animationPhase === "loading" ? `${progress}%` : "100%",
                transition:
                  animationPhase === "loading" ? "none" : "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Terminal window decoration */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="terminal-content">
            <div className="terminal-line">&gt; npm start</div>
            <div className="terminal-line">&gt; Building portfolio...</div>
            <div className="terminal-line cursor-blink">&gt; Ready_</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .splash-container {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f5f5f0 0%, #e8e8e0 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          font-family: "Monaco", "Menlo", "Courier New", monospace;
          overflow: hidden;
          transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .splash-container.exiting {
          transform: scale(0.8) rotate(2deg);
          opacity: 0;
        }

        .particle-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .geometric-shapes {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          background: #000;
          opacity: 0.1;
        }

        .shape-1 {
          width: 60px;
          height: 60px;
          top: 10%;
          left: 15%;
          transform: rotate(45deg);
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 40px;
          height: 40px;
          top: 20%;
          right: 20%;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 80px;
          height: 3px;
          bottom: 25%;
          left: 10%;
          animation: slide 10s linear infinite;
        }

        .shape-4 {
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 43px solid #000;
          bottom: 15%;
          right: 15%;
          animation: bounce 4s ease-in-out infinite;
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 90%;
          width: 100%;
        }

        .header-badge {
          background: #000;
          color: #fff;
          padding: 8px 20px;
          font-size: clamp(10px, 2vw, 14px);
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          transform: rotate(-2deg);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }

        .badge-text {
          display: inline-block;
          animation: glitch 3s ease-in-out infinite;
        }

        .name-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: clamp(4px, 1.5vw, 12px);
          margin-bottom: 2rem;
          perspective: 1000px;
        }

        .letter {
          display: inline-block;
          font-size: clamp(2rem, 8vw, 6rem);
          font-weight: 900;
          color: #000;
          background: #fff;
          border: 4px solid #000;
          padding: 0.1em 0.2em;
          box-shadow: 8px 8px 0 #000;
          transform: translateY(100px) rotateX(-90deg);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }

        .letter:empty {
          width: 0.5em;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .letter.animate {
          transform: translateY(0) rotateX(0);
          opacity: 1;
        }

        .letter::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          transition: left 0.5s ease;
        }

        .letter.animate::before {
          left: 100%;
        }

        .title-container {
          height: 4rem;
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
        }

        .title {
          font-size: clamp(1rem, 4vw, 2rem);
          font-weight: 700;
          color: #000;
          background: #ffff00;
          padding: 0.5em 1em;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          transform: scale(0.8) rotate(-1deg);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          letter-spacing: 2px;
        }

        .title.active {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }

        .progress-section {
          width: 100%;
          max-width: 300px;
          margin-bottom: 2rem;
        }

        .progress-label {
          font-size: clamp(12px, 2.5vw, 16px);
          font-weight: 700;
          color: #000;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          padding: 2px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #ffd93d);
          position: relative;
          transition: width 0.1s ease;
        }

        .progress-fill::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8)
          );
          animation: scan 2s linear infinite;
        }

        .terminal-window {
          background: #000;
          border: 3px solid #000;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 350px;
          margin-top: 1rem;
          font-family: "Monaco", monospace;
        }

        .terminal-header {
          background: #333;
          padding: 8px 12px;
          border-bottom: 1px solid #555;
          display: flex;
          align-items: center;
        }

        .terminal-dots {
          display: flex;
          gap: 6px;
        }

        .terminal-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #666;
        }

        .terminal-dots span:nth-child(1) {
          background: #ff5f57;
        }
        .terminal-dots span:nth-child(2) {
          background: #ffbd2e;
        }
        .terminal-dots span:nth-child(3) {
          background: #28ca42;
        }

        .terminal-content {
          padding: 12px;
          color: #00ff00;
          font-size: clamp(10px, 2vw, 14px);
          line-height: 1.4;
        }

        .terminal-line {
          margin-bottom: 4px;
          opacity: 0;
          animation: typewriter 0.5s ease forwards;
        }

        .terminal-line:nth-child(1) {
          animation-delay: 3s;
        }
        .terminal-line:nth-child(2) {
          animation-delay: 3.5s;
        }
        .terminal-line:nth-child(3) {
          animation-delay: 4s;
        }

        .cursor-blink::after {
          content: "";
          display: inline-block;
          width: 8px;
          height: 1em;
          background: #00ff00;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        /* Animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-20px);
          }
          100% {
            transform: translateX(300px);
          }
        }

        @keyframes typewriter {
          to {
            opacity: 1;
          }
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-badge {
            padding: 6px 16px;
            margin-bottom: 1.5rem;
          }

          .name-container {
            gap: clamp(2px, 1vw, 8px);
            margin-bottom: 1.5rem;
          }

          .letter {
            border-width: 3px;
            box-shadow: 6px 6px 0 #000;
          }

          .title {
            border-width: 2px;
            box-shadow: 3px 3px 0 #000;
            padding: 0.4em 0.8em;
          }

          .progress-bar {
            height: 16px;
            border-width: 2px;
            box-shadow: 2px 2px 0 #000;
          }

          .terminal-window {
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          }

          .shape-1,
          .shape-2 {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            max-width: 95%;
          }

          .letter {
            border-width: 2px;
            box-shadow: 4px 4px 0 #000;
          }

          .progress-section {
            max-width: 250px;
          }

          .terminal-window {
            max-width: 280px;
          }

          .geometric-shapes {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
