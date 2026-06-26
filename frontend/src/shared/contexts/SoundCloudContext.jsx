import { createContext, useContext, useRef } from "react";
import { useSoundCloudPlayer, buildSCUrl } from "../hooks/useSoundCloudPlayer.js";

const SoundCloudContext = createContext(null);

/**
 * Provides SoundCloud playback state to the entire app tree.
 * The hidden iframe lives here — only one instance, persists across routes.
 */
export const SoundCloudProvider = ({ children }) => {
  const player = useSoundCloudPlayer();

  return (
    <SoundCloudContext.Provider value={player}>
      {/* Hidden SC iframe — lives at app level, never unmounts */}
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
