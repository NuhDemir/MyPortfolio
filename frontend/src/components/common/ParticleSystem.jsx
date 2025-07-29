import React, { useEffect, useRef } from "react";
import "./style/ParticleSystem.css"; // Oluşturduğumuz CSS dosyasını import ediyoruz

const ParticleSystem = ({ audioData, scrollY, isDarkMode, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // Parçacıkları ve canvas'ı başlat
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particleCount = window.innerWidth < 768 ? 50 : 100;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.2, // Opaklığı biraz azalttık
      hue: Math.random() * 360,
      baseSize: Math.random() * 2 + 1,
    }));

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Mouse pozisyonunu takip et
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animasyon döngüsü
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const audioIntensity =
        audioData && isPlaying
          ? audioData.reduce((sum, val) => sum + val, 0) /
            audioData.length /
            128
          : 0;

      particlesRef.current.forEach((p, index) => {
        // Pozisyonu güncelle
        p.x += p.vx;
        p.y += p.vy;

        // Ses reaktif efektleri
        if (isPlaying && audioData) {
          const freqIndex = Math.floor(
            (index / particlesRef.current.length) * (audioData.length / 2)
          );
          const freqValue = audioData[freqIndex] / 255;
          p.size = p.baseSize + freqValue * 6 * audioIntensity;
        } else {
          p.size = p.baseSize;
        }

        // Mouse etkileşimi (daha yumuşak)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          const force = (150 - distance) / 150;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
        }

        // Kenardan sekme yerine diğer taraftan çıkma (sınırsız hissi)
        if (p.x > canvas.width + 5) p.x = -5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.y > canvas.height + 5) p.y = -5;
        if (p.y < -5) p.y = canvas.height + 5;

        // Renk
        const hue = (p.hue + audioIntensity * 40 + scrollY * 0.05) % 360;
        const saturation = isDarkMode ? 75 : 85;
        const lightness = isDarkMode ? 60 : 55;
        p.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${p.opacity})`;

        // YENİ: Parçacık parıltısı
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;

        // Parçacığı çiz
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // YENİ: Yakındaki parçacıklarla bağlantı çizgileri
        for (let i = index + 1; i < particlesRef.current.length; i++) {
          const other = particlesRef.current[i];
          const dist = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
              ((100 - dist) / 100) * 0.2
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Her çizim döngüsünden sonra gölgeyi sıfırla
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [audioData, scrollY, isDarkMode, isPlaying]);

  return (
    <div className="particle-canvas-container">
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};

export default ParticleSystem;
