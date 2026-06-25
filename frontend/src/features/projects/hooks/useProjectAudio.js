import { useRef, useEffect, useCallback } from "react";

/**
 * Proje listesinde kullanılan sesleri yönetir.
 * Bileşen ilk mount edildiğinde dosyaları preload eder.
 */
export const useProjectAudio = () => {
  const popRef = useRef(null);
  const arcadeRef = useRef(null);

  useEffect(() => {
    popRef.current = new Audio("/audio/hover-click.mp3");
    arcadeRef.current = new Audio("/audio/arcade.mp3");
    popRef.current.preload = "auto";
    arcadeRef.current.preload = "auto";
  }, []);

  const play = useCallback((ref) => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current
      .play()
      .catch((err) => console.error("Audio playback failed:", err));
  }, []);

  return {
    playPop: useCallback(() => play(popRef), [play]),
    playArcade: useCallback(() => play(arcadeRef), [play]),
  };
};
