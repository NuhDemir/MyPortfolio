import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Değeri: '/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Her istekten ÖNCE bu fonksiyon çalışır
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Her yanıttan SONRA bu fonksiyon çalışır
axiosInstance.interceptors.response.use(
  (response) => response, // Başarılı yanıtları doğrudan geri döndür
  (error) => {
    // 401 Unauthorized hatası gelirse (örn. token süresi dolmuşsa)
    // kullanıcıyı otomatik olarak çıkışa zorla.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      // Kullanıcıyı login sayfasına yönlendir.
      window.location.href = "/admin/login";
    }
    // Diğer tüm hataları olduğu gibi geri döndür.
    return Promise.reject(error);
  }
);

export default axiosInstance;
