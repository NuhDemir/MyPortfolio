import { useEffect, useRef } from "react";

/**
 * Backend Keep-Alive Hook
 *
 * Render.com ücretsiz planında backend 15 dakika inaktiflikten sonra
 * uyku moduna girer. Bu hook her 10 dakikada bir backend'e ping atarak
 * sunucunun uyanık kalmasını sağlar.
 *
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.apiUrl - Backend API URL'i
 * @param {number} options.intervalMinutes - Ping aralığı (dakika, varsayılan: 10)
 * @param {boolean} options.enabled - Ping sistemi aktif mi (varsayılan: true)
 */
export const useBackendKeepAlive = ({
  apiUrl,
  intervalMinutes = 10,
  enabled = true,
  debug = false,
} = {}) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Eğer disabled ise veya apiUrl yoksa çalışma
    if (!enabled || !apiUrl) {
      return;
    }

    // Health check endpoint'ine ping at
    const pingBackend = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          if (debug) {
            console.debug("Backend ping successful");
          }
        } else {
          if (debug) {
            console.warn("Backend ping failed");
          }
        }
      } catch {
        if (debug) {
          console.error("Backend ping error");
        }
      }
    };

    // İlk ping'i hemen at
    pingBackend();

    // Periyodik ping başlat
    const intervalMs = intervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(pingBackend, intervalMs);

    if (debug) {
      console.debug(
        `Backend keep-alive started: Ping every ${intervalMinutes} minutes`,
      );
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (debug) {
          console.debug("Backend keep-alive stopped");
        }
      }
    };
  }, [apiUrl, intervalMinutes, enabled, debug]);

  return null;
};

export default useBackendKeepAlive;
