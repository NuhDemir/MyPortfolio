// src/hooks/useGsapAnimation.js
import { useEffect } from "react";
import gsap from "gsap";

export const useGsapAnimation = (
  mainRef,
  titleRef,
  subtitleRef,
  buttonRef,
  audioControlRef
) => {
  useEffect(() => {
    // Make sure all refs are valid
    if (
      !mainRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !buttonRef.current ||
      !audioControlRef.current
    )
      return;

    // Create a timeline for the animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial setup - ensure elements are hidden
    gsap.set(
      [
        titleRef.current,
        subtitleRef.current,
        buttonRef.current,
        audioControlRef.current,
      ],
      {
        opacity: 0,
        y: 20,
      }
    );

    // Create the animation sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
    })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.6"
      )
      .to(
        audioControlRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      );

    // Add a subtle animation to the grid background
    gsap.to(mainRef.current, {
      backgroundPosition: "40px 40px",
      duration: 20,
      repeat: -1,
      ease: "linear",
    });

    // Clean up the animations when component unmounts
    return () => {
      tl.kill();
    };
  }, [mainRef, titleRef, subtitleRef, buttonRef, audioControlRef]);
};
