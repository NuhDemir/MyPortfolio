// src/hooks/useScrollAnimation.js
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (iconRef, containerRef = null) => {
  useLayoutEffect(() => {
    const iconElement = iconRef?.current;
    const navbarContainerElement = containerRef?.current;

    if (!iconElement && !navbarContainerElement) {
      return undefined;
    }

    const rafIds = [];
    const queueRefresh = () => {
      const rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      rafIds.push(rafId);
    };

    const refreshNavbarTriggers = () => {
      ScrollTrigger.refresh();
    };

    const parentContainer = iconElement?.parentElement;

    const context = gsap.context(() => {
      if (navbarContainerElement) {
        const navItems = navbarContainerElement.querySelectorAll(".nav-item");

        gsap.set(navbarContainerElement, { autoAlpha: 1, y: 0, filter: "none" });

        gsap.from(navbarContainerElement, {
          y: -18,
          autoAlpha: 0,
          filter: "blur(4px)",
          duration: 0.56,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,visibility,transform,filter",
        });

        if (navItems.length > 0) {
          gsap.from(navItems, {
            y: -10,
            autoAlpha: 0,
            stagger: 0.055,
            duration: 0.34,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "opacity,visibility,transform",
          });
        }
      }

      if (iconElement) {
        gsap.set(iconElement, { scale: 1, autoAlpha: 1, rotation: 0 });

        gsap.from(iconElement, {
          scale: 0.5,
          autoAlpha: 0,
          duration: 0.75,
          ease: "back.out(1.4)",
          delay: 0.08,
          immediateRender: false,
          clearProps: "opacity,visibility,transform",
        });

        gsap.to(iconElement, {
          rotation: "+=1080",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.25,
            invalidateOnRefresh: true,
          },
        });
      }
    }, navbarContainerElement || undefined);

    let hoverTween = null;
    const handleMouseEnter = () => {
      if (!iconElement) return;
      hoverTween?.kill();
      hoverTween = gsap.to(iconElement, {
        scale: 1.22,
        duration: 0.24,
        ease: "power1.out",
      });
    };

    const handleMouseLeave = () => {
      if (!iconElement) return;
      hoverTween?.kill();
      hoverTween = gsap.to(iconElement, {
        scale: 1,
        duration: 0.24,
        ease: "power1.in",
      });
    };

    if (parentContainer) {
      parentContainer.addEventListener("mouseenter", handleMouseEnter);
      parentContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("load", refreshNavbarTriggers);
    window.addEventListener("pageshow", refreshNavbarTriggers);

    queueRefresh();
    queueRefresh();
    const delayedRefreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      if (parentContainer) {
        parentContainer.removeEventListener("mouseenter", handleMouseEnter);
        parentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }

      window.removeEventListener("load", refreshNavbarTriggers);
      window.removeEventListener("pageshow", refreshNavbarTriggers);
      window.clearTimeout(delayedRefreshId);
      rafIds.forEach((id) => window.cancelAnimationFrame(id));

      hoverTween?.kill();
      context.revert();
    };
  }, []);
};
