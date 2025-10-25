import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// Ses dosyasını bir kere yükleyip tekrar kullanmak için referans
const introAudio = new Audio("/audio/intro.mp3");
introAudio.volume = 0.8; // Sesi çok yüksek olmasın

export const useGsapSplashAnimation = (
  splashContainerRef,
  lettersRef,
  particleCanvasRef,
  subtitleRef,
  loaderBarFillRef,
  loaderContainerRef,
  onComplete
) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const audioPlayedRef = useRef(false); // Sesin sadece bir kere çalmasını sağlamak için

  useEffect(() => {
    const elements = [
      splashContainerRef.current,
      ...lettersRef.current,
      particleCanvasRef.current,
      subtitleRef.current,
      loaderBarFillRef.current,
      loaderContainerRef.current,
    ];
    if (elements.some((el) => !el)) return;

    const hasPlayed = sessionStorage.getItem("splashAnimationPlayed");
    if (hasPlayed) {
      setAnimationComplete(true);
      if (onComplete) onComplete();
      gsap.set(splashContainerRef.current, { display: "none" });
      return;
    }

    // --- SES ÇALMA FONKSİYONU ---
    const playIntroSound = () => {
      if (!audioPlayedRef.current) {
        // Tarayıcıların otomatik oynatma politikasını aşmak için play() bir Promise döndürür
        const playPromise = introAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Giriş sesi otomatik oynatılamadı:", error);
            // Hata durumunda kullanıcı etkileşimini beklemek için bir olay dinleyicisi eklenebilir
            const playOnClick = () => {
              introAudio.play();
              window.removeEventListener("click", playOnClick);
            };
            window.addEventListener("click", playOnClick);
          });
        }
        audioPlayedRef.current = true; // Sesi tekrar çalma
      }
    };

    // Canvas ve Parçacık Sistemi
    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 30 : 60; // Mobilde parçacık sayısını azalt
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          color:
            Math.random() > 0.5
              ? "var(--color-primary)"
              : "var(--color-accent)",
        });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    createParticles();
    animateParticles();

    // GSAP Animasyon Zaman Çizelgesi
    const tl = gsap.timeline({
      onStart: playIntroSound, // Animasyon başladığında sesi çalmayı dene
      onComplete: () => {
        gsap.to(splashContainerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            setAnimationComplete(true);
            sessionStorage.setItem("splashAnimationPlayed", "true");
            if (onComplete) onComplete();
          },
        });
      },
    });

    // Animasyon sekansı
    tl.to(
      loaderContainerRef.current,
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "+=0.5"
    )
      .to(
        loaderBarFillRef.current,
        { width: "100%", duration: 1.5, ease: "power2.inOut" },
        "-=0.2"
      )
      .to(
        lettersRef.current,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=1"
      )
      .to(
        subtitleRef.current,
        { opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      )
      .to({}, { duration: 0.5 });

    // Temizlik
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [
    onComplete,
    splashContainerRef,
    lettersRef,
    particleCanvasRef,
    subtitleRef,
    loaderBarFillRef,
    loaderContainerRef,
  ]);

  return { animationComplete };
};
