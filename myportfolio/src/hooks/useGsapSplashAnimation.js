import { useEffect, useState } from "react";
import gsap from "gsap";

export const useGsapSplashAnimation = (
  containerRef,
  lettersRef,
  onComplete,
  backgroundCanvasRef
) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const letters = lettersRef.current;
    const backgroundCanvas = backgroundCanvasRef?.current;
    const loaderBarContainer = container?.querySelector(
      ".splash-loader-bar-container"
    );
    const loaderBar = container?.querySelector(".splash-loader-bar");

    if (
      !container ||
      letters.length === 0 ||
      !backgroundCanvas ||
      !loaderBarContainer ||
      !loaderBar
    )
      return;

    const hasPlayedAnimation = sessionStorage.getItem("splashAnimationPlayed");
    if (hasPlayedAnimation) {
      setAnimationComplete(true);
      if (onComplete) onComplete();
      gsap.set(container, { autoAlpha: 0 });
      return;
    }

    gsap.set(container, { autoAlpha: 1 });
    gsap.set(loaderBarContainer, { opacity: 0, y: 20 });
    gsap.set(loaderBar, { width: "0%" });

    // --- Parçacık Sistemi (Orijinal Renk Tonlarıyla) ---
    const particles = [];
    if (backgroundCanvas) {
      const particleCount = 70;
      // Renkleri CSS değişkenlerinden alamasak da, aynı değerleri kullanacağız
      const particleColors = ["#0AC285", "#00296B", "#E0E0E0"]; // Yeşil, Mavi ve açık gri/beyaz

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "splash-particle";
        const size = Math.random() * 2.5 + 1; // Daha küçük, dijital parçacıklar
        const chosenColor =
          particleColors[Math.floor(Math.random() * particleColors.length)];

        Object.assign(particle.style, {
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: chosenColor,
          opacity: 0,
          // Parçacıklara da hafif bir parlama ekleyebiliriz
          boxShadow: `0 0 ${Math.random() * 4 + 3}px ${
            chosenColor === "#E0E0E0" ? "rgba(224,224,224,0.7)" : chosenColor
          }`,
        });
        backgroundCanvas.appendChild(particle);
        particles.push(particle);
      }

      particles.forEach((particle) => {
        gsap.set(particle, {
          x: Math.random() * backgroundCanvas.offsetWidth,
          y: Math.random() * backgroundCanvas.offsetHeight,
        });
        gsap.to(particle, {
          x: `+=${(Math.random() - 0.5) * 150}`,
          y: `+=${(Math.random() - 0.5) * 150}`,
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 6 + 4,
          delay: Math.random() * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(particle, {
          opacity: Math.random() * 0.2,
          duration: Math.random() * 1.2 + 0.6,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2.5,
          ease: "power1.inOut",
        });
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: () => {
            setAnimationComplete(true);
            sessionStorage.setItem("splashAnimationPlayed", "true");
            if (onComplete) onComplete();
          },
        });
      },
    });

    tl.addLabel("start", "+=0.3");

    tl.to(
      loaderBarContainer,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "start"
    ).to(
      loaderBar,
      {
        width: "100%",
        duration: 1.6,
        ease: "circ.inOut", // Biraz daha yumuşak bir geçiş
      },
      "start+=0.1"
    );

    tl.fromTo(
      letters,
      {
        y: 50,
        opacity: 0,
        rotationX: -80,
        transformOrigin: "50% 100%",
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        stagger: 0.09,
        duration: 0.55,
        ease: "back.out(1.4)",
        onStart: function () {
          this.targets().forEach((letter) => {
            if (Math.random() < 0.1) {
              gsap.to(letter, {
                x: () => (Math.random() - 0.5) * 8,
                opacity: () => Math.random() * 0.6 + 0.4,
                color: "var(--theme-accent-green)", // Glitch sırasında renk değişimi
                duration: 0.06,
                repeat: 2,
                yoyo: true,
                delay: Math.random() * 0.15,
                ease: "steps(1)",
                onComplete: () =>
                  gsap.to(letter, {
                    color: "var(--theme-text-color)",
                    duration: 0.1,
                  }), // Rengi geri döndür
              });
            }
          });
        },
      },
      "start+=0.4"
    );

    // Metin parlama efekti (CSS değişkenlerini kullanır)
    tl.to(
      letters,
      {
        // textShadow CSS değişkeniyle tanımlandığı için direkt onu kullanabiliriz
        // Ancak GSAP'ta textShadow'u dinamik olarak değiştirmek daha esnek olabilir
        // CSS'deki '--theme-glow' değişkenini burada taklit edelim
        textShadow: `0 0 5px var(--theme-accent-green), 0 0 10px var(--theme-accent-green), 0 0 15px var(--theme-accent-green), 0 0 25px rgba(10, 194, 133, 0.5)`,
        color: gsap.utils.wrap([
          "var(--theme-text-color)",
          "var(--theme-accent-green)",
        ]), // Renkler arasında geçiş
        duration: 0.35,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          each: 0.04,
          from: "center",
        },
      },
      "-=0.4"
    ).to(letters, {
      // Parlamayı ve rengi normale döndür
      textShadow: "0 0 3px rgba(0, 41, 107, 0.5)", // CSS'deki temel gölgeye geri dön
      color: "var(--theme-text-color)",
      duration: 0.3,
      ease: "power1.inOut",
      stagger: 0.03,
    });

    tl.to({}, { duration: 0.7 }, ">");

    return () => {
      tl.kill();
      if (backgroundCanvas) {
        particles.forEach((particle) => {
          if (particle.parentNode === backgroundCanvas) {
            backgroundCanvas.removeChild(particle);
          }
          gsap.killTweensOf(particle);
        });
        while (backgroundCanvas.firstChild) {
          backgroundCanvas.removeChild(backgroundCanvas.firstChild);
        }
      }
    };
  }, [containerRef, lettersRef, backgroundCanvasRef, onComplete]);

  return { animationComplete };
};
