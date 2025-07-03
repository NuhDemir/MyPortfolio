const API_BASE_URL =import.meta.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * API'den gelen hataları daha iyi yönetmek için bir yardımcı fonksiyon.
 * @param {Response} response - Fetch API'sinden dönen response nesnesi.
 */

const handleResponse = async (response) => {
  if (!response.ok) {
    // Backend'den gelen JSON formatındaki hatayı yakalamaya çalış
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Bilinmeyen bir sunucu hatası oluştu.');
  }
  return response.json();
};