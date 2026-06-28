import { createContext, useContext, useState, useEffect } from "react";
import { useSoundCloudPlayer, buildSCUrl } from "../hooks/useSoundCloudPlayer.js";

const SoundCloudContext = createContext(null);

/**
 * Provides SoundCloud playback state to the entire app tree.
 * The hidden iframe lives here — only one instance, persists across routes.
 */
export const SoundCloudProvider = ({ children }) => {
  const player = useSoundCloudPlayer();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 3500);
    const handleInteraction = () => setShouldLoad(true);
    
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <SoundCloudContext.Provider value={player}>
      {/* Hidden SC iframe — lives at app level, never unmounts */}
      {shouldLoad && (
        <iframe
        ref={player.iframeRef}
        title="SoundCloud Player"
        src={buildSCUrl()}
        allow="autoplay"
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          border: 0,
        }}
      />
      )}
      {children}
    </SoundCloudContext.Provider>
  );
};

/**
 * Consume the shared SoundCloud player context.
 * Must be used inside <SoundCloudProvider>.
 */
export const useSoundCloud = () => {
  const ctx = useContext(SoundCloudContext);
  if (!ctx) throw new Error("useSoundCloud must be used within SoundCloudProvider");
  return ctx;
};

export default SoundCloudContext;
