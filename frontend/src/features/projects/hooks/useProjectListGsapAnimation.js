import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useProjectListGsapAnimation = ({ activeIndex, isOn }) => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) {
      return undefined;
    }

    const rafIds = [];
    const queueRefresh = () => {
      const rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      rafIds.push(rafId);
    };

    const refreshProjectTriggers = () => {
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      const hero = sectionElement.querySelector(".project-list-hero-wrap");
      const tv = sectionElement.querySelector(".project-tv-wrap");
      const remote = sectionElement.querySelector(".project-remote-wrap");
      const remoteButtons = sectionElement.querySelectorAll(".project-remote__button");

      if (hero) {
        gsap.set(hero, { autoAlpha: 1, y: 0, filter: "none" });

        gsap.from(hero, {
          y: -46,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 0.95,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,visibility,transform,filter",
          scrollTrigger: {
            trigger: sectionElement,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      const viewerPieces = [tv, remote].filter(Boolean);
      if (viewerPieces.length > 0) {
        gsap.set(viewerPieces, { autoAlpha: 1, y: 0, rotate: 0 });

        gsap.from(viewerPieces, {
          y: 44,
          autoAlpha: 0,
          stagger: 0.14,
          duration: 0.8,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: sectionElement.querySelector(".project-viewer-layout") || sectionElement,
            start: "top 86%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      if (remoteButtons.length > 0 && remote) {
        gsap.from(remoteButtons, {
          autoAlpha: 0,
          scale: 0.92,
          stagger: {
            each: 0.02,
            from: "center",
          },
          duration: 0.36,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: remote,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionElement);

    window.addEventListener("load", refreshProjectTriggers);
    window.addEventListener("pageshow", refreshProjectTriggers);

    queueRefresh();
    queueRefresh();

    const delayedRefreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 240);

    return () => {
      window.removeEventListener("load", refreshProjectTriggers);
      window.removeEventListener("pageshow", refreshProjectTriggers);
      window.clearTimeout(delayedRefreshId);
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement || !isOn) {
      return undefined;
    }

    const contentTargets = sectionElement.querySelectorAll(
      ".project-tv-screen__title, .project-tv-screen__description, .project-tv-screen__tech-item, .project-tv-screen__badge",
    );

    if (!contentTargets.length) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        contentTargets,
        {
          y: 14,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.05,
          duration: 0.42,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    }, sectionElement);

    return () => {
      context.revert();
    };
  }, [activeIndex, isOn]);

  return { sectionRef };
};
