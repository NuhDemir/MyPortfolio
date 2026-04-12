import { useLayoutEffect } from "react";
import gsap from "gsap";

export const useGsapAnimation = (
  mainRef,
  titleRef,
  subtitleRef,
  buttonRef,
  audioControlRef,
  imageRef,
) => {
  useLayoutEffect(() => {
    const refs = [
      mainRef,
      titleRef,
      subtitleRef,
      buttonRef,
      audioControlRef,
      imageRef,
    ];

    if (refs.some((ref) => !ref.current)) {
      return undefined;
    }

    const mainElement = mainRef.current;
    const animatedElements = [
      buttonRef.current,
      imageRef.current,
    ];

    let introTimeline = null;

    const playIntro = () => {
      introTimeline?.kill();

      gsap.set(animatedElements, { autoAlpha: 0, y: 30 });

      introTimeline = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      introTimeline.to(animatedElements, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.2,
        clearProps: "opacity,visibility,transform",
      });
    };

    const context = gsap.context(() => {
      playIntro();
    }, mainElement);

    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let moveX = null;
    let moveY = null;

    if (supportsFinePointer) {
      moveX = gsap.quickTo(mainElement, "--bg-x", {
        duration: 0.8,
        ease: "power2.out",
      });
      moveY = gsap.quickTo(mainElement, "--bg-y", {
        duration: 0.8,
        ease: "power2.out",
      });
    }

    const handlePointerMove = (event) => {
      if (!moveX || !moveY) {
        return;
      }

      const parallaxAmount = 20;
      const offsetX = (event.clientX / window.innerWidth - 0.5) * -parallaxAmount;
      const offsetY = (event.clientY / window.innerHeight - 0.5) * -parallaxAmount;

      moveX(`${offsetX}px`);
      moveY(`${offsetY}px`);
    };

    const handlePointerLeave = () => {
      if (!moveX || !moveY) {
        return;
      }

      moveX("0px");
      moveY("0px");
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        playIntro();
      }
    };

    if (supportsFinePointer) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
      });
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      if (supportsFinePointer) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
      }

      window.removeEventListener("pageshow", handlePageShow);
      introTimeline?.kill();
      context.revert();
    };
  }, [mainRef, titleRef, subtitleRef, buttonRef, audioControlRef, imageRef]);
};
