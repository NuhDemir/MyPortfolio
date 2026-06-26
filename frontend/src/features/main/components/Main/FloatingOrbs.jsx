import { useEffect, useState, useCallback, useRef } from "react";
import "./style/FloatingOrbs.css";

const ORB_COUNT = 5;

const generateOrbs = () =>
  Array.from({ length: ORB_COUNT }, (_, i) => ({
    id: i,
    size: 80 + Math.random() * 180,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    duration: 18 + Math.random() * 14,
    delay: -(Math.random() * 10),
    driftX: 30 + Math.random() * 60,
    driftY: 20 + Math.random() * 50,
    opacity: 0.06 + Math.random() * 0.1,
  }));

const FloatingOrbs = ({ color, intensity = 1 }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [orbs] = useState(() => generateOrbs());
  const frameRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
        frameRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [handleMouseMove]);

  const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
  const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 500;

  return (
    <div className="floating-orbs" ref={containerRef} aria-hidden="true">
      {orbs.map((orb) => {
        const offsetX = ((mouse.x - centerX) / centerX) * 12 * intensity;
        const offsetY = ((mouse.y - centerY) / centerY) * 12 * intensity;

        return (
          <div
            key={orb.id}
            className="floating-orb"
            style={{
              "--orb-color": color || "var(--ds-accent)",
              "--orb-size": `${orb.size}px`,
              "--orb-x": `${orb.x}%`,
              "--orb-y": `${orb.y}%`,
              "--orb-drift-x": `${orb.driftX}px`,
              "--orb-drift-y": `${orb.driftY}px`,
              "--orb-duration": `${orb.duration}s`,
              "--orb-delay": `${orb.delay}s`,
              "--orb-opacity": orb.opacity,
              "--orb-offset-x": `${offsetX}px`,
              "--orb-offset-y": `${offsetY}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingOrbs;
