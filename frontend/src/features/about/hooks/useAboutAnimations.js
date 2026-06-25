import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useAboutAnimations = () => {
  const statsRef = useRef(null);
  const bioRef = useRef(null);
  const skillsRef = useRef(null);

  /* ── Stats: scroll-triggered reveal + count-up ────────────────────── */
  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll(".about3__stat");
      const values = container.querySelectorAll(".about3__stat-value");
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: container, start: "top 80%",
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
          values.forEach((el) => {
            const target = parseInt(el.textContent, 10);
            if (!isNaN(target)) gsap.fromTo(el, { textContent: 0 }, { textContent: target, duration: 1.2, ease: "power2.out", snap: { textContent: 1 } });
          });
        },
      });
    }, container);
    return () => ctx.revert();
  }, []);

  /* ── Bio: highlight reveal ────────────────────────────────────────── */
  useEffect(() => {
    const container = bioRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const title = container.querySelector(".about3__section-title");
      const paras = container.querySelectorAll("p");
      gsap.set(title, { opacity: 0, x: -30 });
      gsap.set(paras, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: container, start: "top 75%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(paras, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" });
          paras.forEach((p, i) => {
            gsap.fromTo(p, { backgroundSize: "0% 30%" }, {
              backgroundSize: "100% 30%", duration: 1.2, delay: 0.3 + i * 0.15,
              ease: "power2.inOut",
              backgroundImage: "linear-gradient(transparent 60%, rgba(17,17,17,0.06) 60%)",
              backgroundRepeat: "no-repeat",
            });
          });
        },
      });
    }, container);
    return () => ctx.revert();
  }, []);

  /* ── Skills: random gather ────────────────────────────────────────── */
  useEffect(() => {
    const container = skillsRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const pills = container.querySelectorAll(".about3__skill");
      gsap.set(pills, { opacity: 0, scale: 0, x: () => gsap.utils.random(-200, 200), y: () => gsap.utils.random(-150, 150), rotate: () => gsap.utils.random(-45, 45) });
      ScrollTrigger.create({
        trigger: container, start: "top 80%",
        onEnter: () => {
          gsap.to(pills, { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, duration: 0.7, stagger: { each: 0.03, from: "random" }, ease: "back.out(1.2)" });
        },
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return { statsRef, bioRef, skillsRef };
};
