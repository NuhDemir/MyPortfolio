import { useCallback, useEffect } from "react";

// --- Global Değişkenler ve Fonksiyonlar ---

// Ses dosyalarını bir kere yükleyip tekrar kullanmak için cache objesi
const audioCache = {};

// Ses sisteminin "kilidinin" açık olup olmadığını takip eden global state
let isAudioContextUnlocked = false;
const isDev = import.meta.env.DEV;

/**
 * Tarayıcının otomatik oynatma kısıtlamalarını aşmak için "sessizliği bozan" fonksiyon.
 * Kullanıcının ilk tıklamasıyla bir kez çalışır ve ses çalma iznini alır.
 */
const unlockAudioContext = () => {
  if (isAudioContextUnlocked) return;

  // Boş bir ses context'i oluşturup başlatarak tarayıcının güvenini kazanırız.
  const context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === "suspended") {
    context.resume();
  }

  isAudioContextUnlocked = true;
  if (isDev) {
    console.debug("Audio context unlocked");
  }

  // Bu dinleyiciye artık gerek kalmadığı için kaldırılır.
  window.removeEventListener("click", unlockAudioContext);
  window.removeEventListener("keydown", unlockAudioContext);
};

// Sayfa ilk yüklendiğinde, kullanıcının ilk tıklamasını veya tuşa basmasını dinlemeye başla.
// { once: true } sayesinde dinleyici ilk etkileşimden sonra otomatik olarak kaldırılır.
if (typeof window !== "undefined" && !isAudioContextUnlocked) {
  window.addEventListener("click", unlockAudioContext, { once: true });
  window.addEventListener("keydown", unlockAudioContext, { once: true });
}

/**
 * Belirtilen ses dosyasını çalmak için bir fonksiyon döndüren React hook'u.
 * Sesleri önbelleğe alır ve tarayıcının otomatik oynatma politikalarıyla uyumlu çalışır.
 * @param {string} soundUrl - Çalınacak ses dosyasının yolu (örn: '/audio/click.mp3').
 * @param {number} [volume=0.5] - Sesin çalınacağı seviye (0.0 ile 1.0 arası).
 * @returns {() => void} Sesi çalan bir fonksiyon.
 */
export const useSound = (soundUrl, volume = 0.5) => {
  // Hook ilk kez kullanıldığında ses dosyasını yükle ve cache'e ekle.
  // Bu useEffect, bileşen her render olduğunda değil, sadece soundUrl veya volume değiştiğinde çalışır.
  useEffect(() => {
    if (!audioCache[soundUrl]) {
      try {
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audioCache[soundUrl] = audio;
      } catch (error) {
        console.error(`Failed to load sound ${soundUrl}:`, error);
      }
    } else {
      // Eğer ses zaten cache'de varsa ama volume prop'u değiştiyse, volume'ü güncelle.
      audioCache[soundUrl].volume = volume;
    }
  }, [soundUrl, volume]);

  const play = useCallback(() => {
    // 1. Ses çalma izni var mı diye kontrol et.
    if (!isAudioContextUnlocked) {
      // console.warn(`Sound skipped (${soundUrl}): Audio context is still locked.`);
      return; // Henüz izin yoksa, sesi çalma.
    }

    // 2. Ses cache'de mevcut mu diye kontrol et.
    const audio = audioCache[soundUrl];
    if (audio) {
      // 3. Sesi başa sar ve çal. Olası hataları yakala.
      audio.currentTime = 0;
      audio.play().catch((error) => {
        // Bu hata artık çok nadir görülmeli, ama yine de yakalamak iyi bir pratiktir.
        console.error(`Sound playback error for ${soundUrl}:`, error);
      });
    } else {
      console.warn(
        `Sound (${soundUrl}) not found in cache. It might be loading.`,
      );
    }
  }, [soundUrl]);

  return play;
};
