// hooks/useMainImageAnimation.js
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useMainImageAnimation = (imageRef) => {
  useEffect(() => {
    const el = imageRef.current;

    if (!el) return;

    // Scroll animation
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Hover animation
    const img = el.querySelector("img");

    const onEnter = () => {
      gsap.to(img, {
        scale: 1.05,
        filter: "brightness(1.1) contrast(1.2)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(img, {
        scale: 1,
        filter: "brightness(1) contrast(1)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    img.addEventListener("mouseenter", onEnter);
    img.addEventListener("mouseleave", onLeave);

    return () => {
      img.removeEventListener("mouseenter", onEnter);
      img.removeEventListener("mouseleave", onLeave);
    };
  }, [imageRef]);
};

export default useMainImageAnimation;
