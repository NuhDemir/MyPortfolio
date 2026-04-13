import React, { useMemo, useEffect, useRef, useState } from "react";
import "./ProjectTVScreen.css";

const STATIC_DURATION = 480;
const CANVAS_W = 128;
const CANVAS_H = 96;

const getBackgroundImage = (project) =>
  project?.visuals?.thumbnailUrl || project?.imageUrl || "";

/* ── CRT static / karıncalanma canvas ───────────────────────────── */
const StaticCanvas = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const imageData = ctx.createImageData(CANVAS_W, CANVAS_H);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="project-tv-screen__static"
      width={CANVAS_W}
      height={CANVAS_H}
      aria-hidden="true"
    />
  );
};

/* ── Screen content — fills .project-tv__screen-shell ───────────── */
const ProjectTVScreen = ({ project, isOn }) => {
  const backgroundImage = useMemo(() => getBackgroundImage(project), [project]);
  const [isStatic, setIsStatic] = useState(false);
  const isFirstRender = useRef(true);
  const projectKey = project?._id ?? project?.title ?? null;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsStatic(true);
    const timer = setTimeout(() => setIsStatic(false), STATIC_DURATION);
    return () => clearTimeout(timer);
  }, [projectKey]);

  if (!isOn) {
    return (
      <div className="project-tv-screen project-tv-screen--dark" role="status">
        <p className="project-tv-screen__status-text">TV OFF</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-tv-screen project-tv-screen--dark" role="status">
        <p className="project-tv-screen__status-text">Sinyal yok</p>
      </div>
    );
  }

  return (
    <div className="project-tv-screen" aria-live="polite">
      {backgroundImage && (
        <div
          className="project-tv-screen__image-layer"
          style={{ "--project-bg-image": `url("${backgroundImage}")` }}
          aria-hidden="true"
        />
      )}
      <div className="project-tv-screen__vignette"  aria-hidden="true" />
      <div className="project-tv-screen__scanlines" aria-hidden="true" />
      {isStatic && <StaticCanvas />}
    </div>
  );
};

export default ProjectTVScreen;
