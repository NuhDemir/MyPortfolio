import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const useNavItemGsapAnimation = () => {
  const itemRef = useRef(null);

  // Mount olduğunda animasyonu başlat
  useEffect(() => {
    const el = itemRef.current;

    gsap.fromTo(
      el,
      {
        y: -20, // Başlangıçta yukarıda
        opacity: 0, // Başlangıçta şeffaf
      },
      {
        y: 0, // Sonra orijinal konumuna gelir
        opacity: 1, // Sonunda görünür olur
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  // Hover animasyonu
  const handleMouseEnter = () => {
    gsap.to(itemRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(itemRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.inOut",
    });
  };

  return {
    itemRef,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useNavItemGsapAnimation;
