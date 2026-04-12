import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useAboutGsapAnimations = () => {
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const servicesContainerRef = useRef(null);

  useLayoutEffect(() => {
    const headerElement = headerRef.current;
    const statsContainerElement = statsContainerRef.current;
    const servicesContainerElement = servicesContainerRef.current;

    if (!headerElement && !statsContainerElement && !servicesContainerElement) {
      return undefined;
    }

    const rafIds = [];
    const queueRefresh = () => {
      const rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      rafIds.push(rafId);
    };

    const refreshOnPageShow = () => {
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      if (headerElement) {
        gsap.set(headerElement, { autoAlpha: 1, y: 0, filter: "none" });

        gsap.from(headerElement, {
          y: -60,
          autoAlpha: 0,
          scale: 0.95,
          filter: "blur(10px)",
          duration: 1.2,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform,filter",
        });
      }

      if (statsContainerElement) {
        const statsSections = statsContainerElement.querySelectorAll(".stat-section");

        if (statsSections.length > 0) {
          gsap.set(statsSections, {
            autoAlpha: 1,
            x: 0,
            filter: "none",
          });

          gsap.from(statsSections, {
            x: -80,
            autoAlpha: 0,
            filter: "blur(5px)",
            stagger: 0.25,
            duration: 1,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "opacity,visibility,transform,filter",
            scrollTrigger: {
              trigger: statsContainerElement,
              start: "top 80%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }

        statsSections.forEach((section) => {
          const statValue = section.querySelector(".stat-value");
          if (!statValue) {
            return;
          }

          const value = statValue.textContent;
          if (!Number.isNaN(parseInt(value, 10))) {
            gsap.from(statValue, {
              textContent: 0,
              duration: 2.2,
              ease: "power2.out",
              snap: { textContent: 1 },
              stagger: 1,
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                invalidateOnRefresh: true,
              },
            });
          }
        });
      }

      if (servicesContainerElement) {
        const serviceCards = servicesContainerElement.querySelectorAll(".service-card");

        gsap.fromTo(
          serviceCards,
          {
            y: 60,
            autoAlpha: 0,
            rotateX: -10,
          },
          {
            y: 0,
            autoAlpha: 1,
            rotateX: 0,
            stagger: 0.18,
            duration: 0.9,
            ease: "back.out(1.3)",
            immediateRender: false,
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: servicesContainerElement,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
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
              invalidateOnRefresh: true,
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
            0.2,
          )
            .fromTo(
              title,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6 },
              0.4,
            )
            .fromTo(
              description,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6 },
              0.6,
            )
            .fromTo(
              learnMore,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 },
              0.8,
            );
        });
      }
    });

    window.addEventListener("load", refreshOnPageShow);
    window.addEventListener("pageshow", refreshOnPageShow);

    queueRefresh();
    queueRefresh();

    const delayedRefreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 220);

    return () => {
      window.removeEventListener("load", refreshOnPageShow);
      window.removeEventListener("pageshow", refreshOnPageShow);
      window.clearTimeout(delayedRefreshId);
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
      context.revert();
    };
  }, []);

  const animateLearnMoreHover = useCallback((element, isEntering) => {
    if (!element) {
      return;
    }

    gsap.to(element, {
      x: isEntering ? 6 : 0,
      scale: isEntering ? 1.05 : 1,
      color: isEntering
        ? "var(--color-text-on-primary)"
        : "var(--color-text-primary)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const animateModalContentLoad = useCallback((rootNode = document) => {
    if (!rootNode) {
      return;
    }

    const targets = rootNode.querySelectorAll(
      ".about-modal-content__lead, .about-modal-content__section-body, .about-modal-content__item-body, .about-modal-content__footnote",
    );

    if (!targets.length) {
      return;
    }

    gsap.fromTo(
      targets,
      {
        y: 18,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.06,
        duration: 0.45,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform",
      },
    );
  }, []);

  return {
    headerRef,
    statsContainerRef,
    servicesContainerRef,
    animateLearnMoreHover,
    animateModalContentLoad,
  };
};

export default useAboutGsapAnimations;
