import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const useAboutGsapAnimations = () => {
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const servicesContainerRef = useRef(null);

  // Initialize all animations
  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
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
          x: -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate the stat values with a counting effect
      statsSections.forEach((section) => {
        const statValue = section.querySelector(".stat-value");
        const value = statValue.textContent;

        // Only animate if it's a number
        if (!isNaN(parseInt(value))) {
          gsap.from(statValue, {
            textContent: 0,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
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
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: servicesContainerRef.current,
            start: "top 80%",
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
            start: "top 85%",
          },
        });

        tl.fromTo(
          iconWrapper,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
          0.2
        )
          .fromTo(
            title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.4
          )
          .fromTo(
            description,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.6
          )
          .fromTo(
            learnMore,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 },
            0.8
          );
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Function to animate hover effect on learn more links
  const animateLearnMoreHover = (element, isEntering) => {
    gsap.to(element, {
      x: isEntering ? 5 : 0,
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
