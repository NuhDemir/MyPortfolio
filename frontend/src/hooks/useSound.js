import { useCallback } from "react";

// Sesleri bir kere yükleyip tekrar tekrar kullanmak için cache objesi
const audioCache = {};

export const useSound = (soundUrl, volume = 0.5) => {
  const play = useCallback(() => {
    try {
      if (!audioCache[soundUrl]) {
        audioCache[soundUrl] = new Audio(soundUrl);
        audioCache[soundUrl].volume = volume;
      }
      // Sesi başa sarıp tekrar çal
      audioCache[soundUrl].currentTime = 0;
      audioCache[soundUrl].play().catch((error) => {
        // Kullanıcı etkileşimi olmadan ses çalınmaya çalışılırsa hatayı yakala
        console.error(`Sound playback error for ${soundUrl}:`, error);
      });
    } catch (error) {
      console.error(`Failed to load sound ${soundUrl}:`, error);
    }
  }, [soundUrl, volume]);

  return play;
};
