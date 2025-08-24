import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useAboutGsapAnimations = () => {
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const servicesContainerRef = useRef(null);

  useEffect(() => {
    // Header animation (geliştirilmiş)
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power3.out",
      });
    }

    // Stats animation
    if (statsContainerRef.current) {
      const statsSections =
        statsContainerRef.current.querySelectorAll(".stat-section");

      gsap.fromTo(
        statsSections,
        {
          x: -80,
          opacity: 0,
          filter: "blur(5px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.25,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 80%",
          },
        }
      );

      // Stat sayılar için counting effect
      statsSections.forEach((section) => {
        const statValue = section.querySelector(".stat-value");
        const value = statValue.textContent;

        if (!isNaN(parseInt(value))) {
          gsap.from(statValue, {
            textContent: 0,
            duration: 2.2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          });
        }
      });
    }

    // Service cards animation
    if (servicesContainerRef.current) {
      const serviceCards =
        servicesContainerRef.current.querySelectorAll(".service-card");

      gsap.fromTo(
        serviceCards,
        {
          y: 60,
          opacity: 0,
          rotateX: -10,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.18,
          duration: 0.9,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: servicesContainerRef.current,
            start: "top 85%",
          },
        }
      );

      serviceCards.forEach((card) => {
        const iconWrapper = card.querySelector(".icon-wrapper");
        const title = card.querySelector(".service-title");
        const description = card.querySelector(".service-desc");
        const learnMore = card.querySelector(".learn-more");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
        });

        tl.fromTo(
          iconWrapper,
          { scale: 0, opacity: 0, rotate: -30 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          0.2
        )
          .fromTo(
            title,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            0.4
          )
          .fromTo(
            description,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            0.6
          )
          .fromTo(
            learnMore,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.8
          );
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Hover effect (geliştirilmiş)
  const animateLearnMoreHover = (element, isEntering) => {
    gsap.to(element, {
      x: isEntering ? 6 : 0,
      scale: isEntering ? 1.05 : 1,
      color: isEntering ? "#4ade80" : "#fff",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return {
    headerRef,
    statsContainerRef,
    servicesContainerRef,
    animateLearnMoreHover,
  };
};

export default useAboutGsapAnimations;
