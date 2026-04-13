import React, { useEffect, useMemo, useRef, useState } from "react";
import cloudinaryAssetMap from "@shared/assets/cloudinaryAssetMap.json";

const resolveSketchUrl = (filename) => {
  const localPath = `/assets/icons/sketch/${filename}`;
  return cloudinaryAssetMap.items[localPath] ?? localPath;
};

// AudioControls estetiğine uygun: spark/wind/wave/ribbon odaklı seçim.
const SKETCH_ICON_POOL = [
  "Abstract-Flash-Sparkle-Line-1--Streamline-Variable-Scribbles.png",
  "Abstract-Highlight-Bling-Line-1--Streamline-Variable-Scribbles.png",
  "Abstract-Highlight-Bling-Line-5--Streamline-Variable-Scribbles.png",
  "Abstract-Highlight-Star-Sparkle-Line--Streamline-Variable-Scribbles.png",
  "Abstract-Pop-Sparkle-Line--Streamline-Variable-Scribbles.png",
  "Abstract-Star-Wink-Sparkle-Line-7--Streamline-Variable-Scribbles.png",
  "Abstract-Winks-Plus-Line--Streamline-Variable-Scribbles.png",
  "Abstract-Wind-Line-1--Streamline-Variable-Scribbles.png",
  "Abstract-Wind-Spiral-Line-2--Streamline-Variable-Scribbles.png",
  "Abstract-Wave-Curly-Line-1--Streamline-Variable-Scribbles.png",
  "Abstract-Wave-Curly-Line-2--Streamline-Variable-Scribbles.png",
  "Abstract-Ribbon-Vine-Line-1--Streamline-Variable-Scribbles.png",
  "Abstract-Ribbon-Vine-Line-3--Streamline-Variable-Scribbles.png",
  "Pop-Explode-Sparkle-Filled--Streamline-Variable-Scribbles.png",
].map(resolveSketchUrl);

const randomBetween = (min, max) => min + Math.random() * (max - min);

const createParticle = (width, height, withStartOffset = false) => {
  const size = randomBetween(18, 54);
  const drift = randomBetween(-18, 18);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    x: randomBetween(0, Math.max(width - size, 1)),
    y: withStartOffset
      ? randomBetween(-height * 0.9, -32)
      : randomBetween(-120, -16),
    baseSpeed: randomBetween(24, 64),
    vy: randomBetween(18, 54),
    vx: drift,
    drift,
    rotation: randomBetween(-24, 24),
    spin: randomBetween(-26, 26),
    swayAmp: randomBetween(3, 16),
    swayFreq: randomBetween(0.55, 1.45),
    phase: randomBetween(0, Math.PI * 2),
    opacity: randomBetween(0.32, 0.8),
    size,
    icon: SKETCH_ICON_POOL[Math.floor(Math.random() * SKETCH_ICON_POOL.length)],
  };
};

const MusicSketchRain = ({ isActive, containerRef }) => {
  const [particles, setParticles] = useState([]);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(0);
  const pointerRef = useRef({ x: null, y: null });
  const boundsRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const lastTimeRef = useRef(0);

  const particleCount = useMemo(() => {
    const width = boundsRef.current.width || 1200;
    const estimated = Math.round(width / 64);
    return Math.min(32, Math.max(14, estimated));
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !containerRef?.current) {
      setParticles([]);
      particlesRef.current = [];
      return;
    }

    const updateBounds = () => {
      const rect = containerRef.current.getBoundingClientRect();
      boundsRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
    };

    updateBounds();
    const initialParticles = Array.from({ length: particleCount }, () =>
      createParticle(boundsRef.current.width, boundsRef.current.height, true),
    );
    particlesRef.current = initialParticles;
    setParticles(initialParticles);

    let frameAccumulator = 0;

    const animate = (now) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }

      const dt = Math.min(0.035, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      frameAccumulator += dt;

      const { width, height } = boundsRef.current;
      const pointer = pointerRef.current;
      const interactionRadius = 128;

      const nextParticles = particlesRef.current.map((particle) => {
        let { x, y, vy, vx, rotation } = particle;

        vy = Math.min(particle.baseSpeed + 54, vy + 11 * dt);
        y += vy * dt;

        const sway =
          Math.sin(now * 0.001 * particle.swayFreq + particle.phase) *
          particle.swayAmp;
        x += (vx + sway * 0.15) * dt;
        rotation += particle.spin * dt;

        if (pointer.x !== null && pointer.y !== null) {
          const centerX = x + particle.size * 0.5;
          const centerY = y + particle.size * 0.5;
          const dx = centerX - pointer.x;
          const dy = centerY - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            const push = force * 220 * dt;
            x += (dx / distance) * push;
            y += (dy / distance) * push * 0.7;
          }
        }

        if (x < -particle.size * 0.6) {
          x = width + particle.size * 0.2;
        } else if (x > width + particle.size * 0.6) {
          x = -particle.size * 0.2;
        }

        if (y > height + particle.size * 1.2) {
          const respawned = createParticle(width, height, false);
          return {
            ...respawned,
            y: randomBetween(-140, -24),
          };
        }

        return {
          ...particle,
          x,
          y,
          vy,
          vx,
          rotation,
        };
      });

      particlesRef.current = nextParticles;
      if (frameAccumulator > 1 / 30) {
        setParticles(nextParticles);
        frameAccumulator = 0;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const { left, top, width, height } = boundsRef.current;
      const localX = event.clientX - left;
      const localY = event.clientY - top;

      if (localX < 0 || localY < 0 || localX > width || localY > height) {
        pointerRef.current = { x: null, y: null };
        return;
      }

      pointerRef.current = { x: localX, y: localY };
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: null, y: null };
    };

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });

    resizeObserver.observe(containerRef.current);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
      lastTimeRef.current = 0;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();
      pointerRef.current = { x: null, y: null };
      particlesRef.current = [];
      setParticles([]);
    };
  }, [containerRef, isActive, particleCount]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <div className="music-sketch-rain" aria-hidden="true">
      {particles.map((particle) => (
        <img
          key={particle.id}
          src={particle.icon}
          alt=""
          className="music-sketch-item"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate3d(${particle.x}px, ${particle.y}px, 0) rotate(${particle.rotation}deg)`,
          }}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
};

export default MusicSketchRain;
