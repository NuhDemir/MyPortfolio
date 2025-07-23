import { useEffect, useState } from "react";
import { gsap } from "gsap";

export const useGsapSplashAnimation = (
  containerRef,
  lettersRef,
  matrixCanvasRef,
  loaderRef,
  onComplete
) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const letters = lettersRef.current;
    const canvas = matrixCanvasRef.current;
    const loader = loaderRef.current;

    if (!container || !letters.length || !canvas || !loader) return;

    const hasPlayedAnimation = sessionStorage.getItem("matrixSplashPlayed");
    if (hasPlayedAnimation) {
      setAnimationComplete(true);
      if (onComplete) onComplete();
      gsap.set(container, { autoAlpha: 0 });
      return;
    }

    // Basit matrix efekti
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px Courier New`;

      for (let i = 0; i < drops.length; i++) {
        const char =
          matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const matrixInterval = setInterval(drawMatrix, 80);

    // Başlangıç durumu
    gsap.set(container, { autoAlpha: 1 });
    gsap.set(letters, { opacity: 0, y: 50 });
    gsap.set(".subtitle", { opacity: 0 });
    gsap.set(loader, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(matrixInterval);
        gsap.to(container, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setAnimationComplete(true);
            sessionStorage.setItem("matrixSplashPlayed", "true");
            if (onComplete) onComplete();
          },
        });
      },
    });

    // Basit animasyon sırası
    tl.to(loader, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(
        loader,
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            const progress = this.progress();
            if (loader) {
              loader.style.setProperty("--progress", `${progress * 100}%`);
            }
          },
        },
        "+=0.2"
      )
      .to(
        letters,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        ".subtitle",
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to({}, { duration: 0.8 }); // Son bekleyiş

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      tl.kill();
      clearInterval(matrixInterval);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf([letters, ".subtitle", loader]);
    };
  }, [containerRef, lettersRef, matrixCanvasRef, loaderRef, onComplete]);

  return { animationComplete };
};
