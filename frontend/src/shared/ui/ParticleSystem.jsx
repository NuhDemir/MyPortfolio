import React, { useEffect, useRef } from "react";
import "@shared/styles/common/ParticleSystem.css";

// Animasyon döngüsünü daha okunaklı hale getirmek için yardımcı fonksiyonlar
const updateParticle = (
  p,
  canvas,
  audioIntensity,
  isPlaying,
  audioData,
  mouse,
  scrollY
) => {
  // Fizik ve Pozisyon
  p.x += p.vx;
  p.y += p.vy;

  // Ses reaktif boyut
  if (isPlaying && audioData) {
    const freqIndex = Math.floor((p.id / p.total) * (audioData.length / 2));
    const freqValue = audioData[freqIndex] / 255;
    p.size = p.baseSize + freqValue * 5 * audioIntensity;
  } else {
    p.size = p.baseSize;
  }

  // Mouse etkileşimi
  const dx = mouse.x - p.x;
  const dy = mouse.y - p.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 150) {
    const force = (150 - distance) / 150;
    p.x -= dx * force * 0.03;
    p.y -= dy * force * 0.03;
  }

  // Kenarlardan diğer tarafa geçme
  if (p.x > canvas.width + 5) p.x = -5;
  if (p.x < -5) p.x = canvas.width + 5;
  if (p.y > canvas.height + 5) p.y = -5;
  if (p.y < -5) p.y = canvas.height + 5;

  // Nostaljik "glitch" efekti
  if (Math.random() > 0.99) {
    p.vx += (Math.random() - 0.5) * 0.2;
    p.vy += (Math.random() - 0.5) * 0.2;
  }
};

const drawParticle = (ctx, p, isDarkMode, audioIntensity, scrollY) => {
  // Renk hesaplama
  const hue = (p.hue + audioIntensity * 30 + scrollY * 0.05) % 360;
  const saturation = isDarkMode ? 70 : 80;
  const lightness = isDarkMode ? 65 : 60;
  const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${p.opacity})`;

  // Parıltı ve çizim
  ctx.shadowColor = color;
  ctx.shadowBlur = p.size * 1.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

const drawConnections = (ctx, particles, p, index, isDarkMode, scrollY) => {
  for (let i = index + 1; i < particles.length; i++) {
    const other = particles[i];
    const dist = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
    if (dist < 120) {
      const hue = (p.hue + scrollY * 0.05) % 360;
      const saturation = isDarkMode ? 70 : 80;
      const lightness = isDarkMode ? 65 : 60;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(other.x, other.y);
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
        ((120 - dist) / 120) * 0.15
      })`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
};

const ParticleSystem = ({
  audioData,
  scrollY,
  isDarkMode,
  isPlaying,
  styleVariant = "", // Varsayılan olarak boş, 'vhs-style' gibi değerler alabilir
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      total: particleCount,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.3 + 0.1,
      hue: Math.random() * 360,
      size: Math.random() * 2 + 1,
      baseSize: Math.random() * 2 + 1,
    }));
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      return undefined;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }
    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const audioIntensity =
        audioData && isPlaying
          ? audioData.reduce((a, b) => a + b, 0) / audioData.length / 128
          : 0;

      particlesRef.current.forEach((p, index) => {
        updateParticle(
          p,
          canvas,
          audioIntensity,
          isPlaying,
          audioData,
          mouseRef.current,
          scrollY
        );
        drawParticle(ctx, p, isDarkMode, audioIntensity, scrollY);
        drawConnections(
          ctx,
          particlesRef.current,
          p,
          index,
          isDarkMode,
          scrollY
        );
      });
      ctx.shadowBlur = 0; // Her döngü sonunda gölgeyi sıfırla

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [audioData, scrollY, isDarkMode, isPlaying]);

  const containerClasses = `
    particle-canvas-container 
    ${isDarkMode ? "theme-dark" : ""} 
    ${styleVariant}
  `.trim();

  return (
    <div className={containerClasses}>
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="particle-noise-overlay" />
    </div>
  );
};

export default ParticleSystem;
