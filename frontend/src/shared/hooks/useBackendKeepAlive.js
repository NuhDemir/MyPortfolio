import { useEffect, useRef } from 'react';

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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend ping successful:', {
            status: data.status,
            timestamp: data.timestamp,
            uptime: `${Math.floor(data.uptime / 60)} minutes`,
          });
        } else {
          console.warn('⚠️ Backend ping failed:', response.status);
        }
      } catch (error) {
        console.error('❌ Backend ping error:', error.message);
      }
    };

    // İlk ping'i hemen at
    pingBackend();

    // Periyodik ping başlat
    const intervalMs = intervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(pingBackend, intervalMs);

    console.log(`🔄 Backend keep-alive started: Ping every ${intervalMinutes} minutes`);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🛑 Backend keep-alive stopped');
      }
    };
  }, [apiUrl, intervalMinutes, enabled]);

  return null;
};

export default useBackendKeepAlive;
