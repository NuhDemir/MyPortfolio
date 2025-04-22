import { useEffect, useState } from "react";
import gsap from "gsap";

export const useGsapSplashAnimation = (
  containerRef,
  lettersRef,
  onComplete,
  backgroundRef
) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const letters = lettersRef.current;
    const background = backgroundRef?.current;

    if (!container || letters.length === 0) return;

    // Check if animation has already played in this session
    const hasPlayedAnimation = sessionStorage.getItem("splashAnimationPlayed");

    // If animation already played, mark as complete and trigger callback
    if (hasPlayedAnimation) {
      setAnimationComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Make container visible
    gsap.set(container, { autoAlpha: 1 });

    // Create particles for background if background element exists
    if (background) {
      // Create particles
      const particleCount = 90;
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "splash-particle";

        // Random size between 10px and 40px
        const size = 10 + Math.random() * 30;

        // Style the particle
        Object.assign(particle.style, {
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          pointerEvents: "none",
        });

        background.appendChild(particle);
        particles.push(particle);
      }

      // Animate background
      gsap.set(background, {
        autoAlpha: 1,
        background:
          "radial-gradient(circle, rgba(25,25,50,1) 0%, rgba(10,10,25,1) 100%)",
      });

      // Create gradient background animation
      gsap.to(background, {
        background:
          "radial-gradient(circle, rgba(40,40,80,1) 0%, rgba(20,20,40,1) 100%)",
        duration: 3,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Animate particles
      particles.forEach((particle) => {
        gsap.fromTo(
          particle,
          {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0,
          },
          {
            scale: 1 + Math.random() * 2,
            opacity: 0.2 + Math.random() * 0.5,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 2,
            ease: "power2.out",
            repeat: 1,
            yoyo: true,
            onComplete: () => {
              // Clean up particles when animation is done
              if (particle.parentNode === background) {
                background.removeChild(particle);
              }
            },
          }
        );
      });
    }

    // Create main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setAnimationComplete(true);
          sessionStorage.setItem("splashAnimationPlayed", "true");
          if (onComplete) onComplete();

          // Fade out background
          if (background) {
            gsap.to(background, {
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.inOut",
            });
          }
        }, 800);
      },
    });

    // Text reveal animation with more fluid movement
    tl.fromTo(
      letters,
      {
        y: 120,
        opacity: 0,
        rotationX: -20,
        transformOrigin: "0% 50% -50",
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "elastic.out(1, 0.8)",
      }
    )
      // Add a subtle wave effect
      .fromTo(
        letters,
        {
          transformOrigin: "center bottom",
        },
        {
          y: (i) => Math.sin(i * 0.3) * 10,
          duration: 0.5,
          stagger: {
            each: 0.04,
            from: "start",
            repeat: 0,
            yoyo: true,
          },
          ease: "sine.inOut",
        },
        "-=0.5"
      )
      // Add a colorful highlight effect
      .fromTo(
        letters,
        {
          color: "inherit",
          textShadow: "none",
        },
        {
          color: (i) => {
            const colors = ["#0AC285", "#0AC285", "#0AC285", "#0AC285"];
            return colors[i % colors.length];
          },

          duration: 0.5,
          stagger: {
            each: 0.04,
            from: "center",
          },
          ease: "power2.inOut",
        },
        "-=1"
      )
      .to(letters, {
        color: "inherit",
        textShadow: "none",
        duration: 0.5,
        stagger: {
          each: 0.03,
          from: "edges",
        },
        ease: "power2.inOut",
      })
      // Final container fade out
      .to(container, {
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.inOut",
      });

    // Cleanup
    return () => {
      tl.kill();
      if (background) {
        // Clean up any remaining particles
        while (background.firstChild) {
          background.removeChild(background.firstChild);
        }
      }
    };
  }, [containerRef, lettersRef, backgroundRef, onComplete]);

  return { animationComplete };
};
