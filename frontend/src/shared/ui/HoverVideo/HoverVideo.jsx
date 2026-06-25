import { useEffect, useRef } from "react";
import "./HoverVideo.css";

const HoverVideo = ({ src, poster }) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const attempt = async () => {
      try { await node.play(); } catch { /* autoplay blocked - ok */ }
    };
    attempt();
  }, []);

  return (
    <video
      ref={ref}
      className="hover-video"
      src={src}
      poster={poster || undefined}
      muted
      playsInline
      autoPlay
      loop
      preload="metadata"
      onMouseEnter={() => ref.current?.play?.()}
      onMouseLeave={() => ref.current?.pause?.()}
    />
  );
};

export default HoverVideo;
