import { useEffect, useState } from "react";
import gsap from "gsap";

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

  useEffect(
    () => {
      // Referansların varlığını kontrol et
      const elements = [
        splashContainerRef.current,
        ...lettersRef.current,
        particleCanvasRef.current,
        subtitleRef.current,
        loaderBarFillRef.current,
        loaderContainerRef.current,
      ];
      if (elements.some((el) => !el)) return;

      // Animasyonu daha önce oynatıldıysa atla
      const hasPlayed = sessionStorage.getItem("splashAnimationPlayed");
      if (hasPlayed) {
        setAnimationComplete(true);
        if (onComplete) onComplete();
        gsap.set(splashContainerRef.current, { display: "none" });
        return;
      }

      // Canvas ve Parçacık Sistemi
      const canvas = particleCanvasRef.current;
      const ctx = canvas.getContext("2d");
      let particles = [];
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const createParticles = () => {
        const particleCount = 70;
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 2 + 1,
            // Temadan renk al (örnek)
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
        requestAnimationFrame(animateParticles);
      };

      createParticles();
      animateParticles();

      // GSAP Animasyon Zaman Çizelgesi (Timeline)
      const tl = gsap.timeline({
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
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "+=0.5"
      )
        .to(
          loaderBarFillRef.current,
          {
            width: "100%",
            duration: 1.5,
            ease: "power2.inOut",
          },
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
          {
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to({}, { duration: 0.5 }); // Sonunda kısa bir bekleme süresi

      // Temizlik fonksiyonu
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        tl.kill();
      };
    },
    [
      /* bağımlılıkları ekle */
    ]
  );

  return { animationComplete };
};
