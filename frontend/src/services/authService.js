// frontend/src/services/authService.js
import axiosInstance from "../api/axiosInstance"; // Artık akıllı kuryeyi kullanıyoruz!

/**
 * Kullanıcı bilgilerini localStorage'a kaydeder.
 * @param {object} data - Kaydedilecek kullanıcı verisi (token dahil).
 */
const setLocalStorageUserInfo = (data) => {
  if (data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }
};

/**
 * Kullanıcı bilgilerini localStorage'dan siler.
 */
const removeLocalStorageUserInfo = () => {
  localStorage.removeItem("userInfo");
};

/**
 * Kullanıcıyı backend'e giriş yaptırır.
 * @param {string} username - Kullanıcı adı.
 * @param {string} password - Şifre.
 * @returns {Promise<object>} Başarılı giriş sonrası kullanıcı verisi.
 */
const login = async (username, password) => {
  try {
    // İstek artık '/api/auth/login' adresine gidecek.
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });

    // Başarılı olursa, kullanıcı bilgilerini kaydet.
    setLocalStorageUserInfo(response.data);
    return response.data;
  } catch (error) {
    // Hata olursa, okunabilir bir mesaj fırlat.
    const message =
      error.response?.data?.message ||
      "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
    throw new Error(message);
  }
};

/**
 * Kullanıcının çıkış yapmasını sağlar.
 */
const logout = () => {
  removeLocalStorageUserInfo();
  // Sayfanın yenilenerek login'e gitmesi state'leri temizler.
  window.location.href = "/admin/login";
};

/**
 * localStorage'dan mevcut kullanıcıyı alır.
 * @returns {object|null} Kullanıcı nesnesi veya null.
 */
const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    // Eğer localStorage'daki veri bozuksa, temizle ve null dön.

    console.log(error);
    removeLocalStorageUserInfo();
    return null;
  }
};

export { login, logout, getCurrentUser };
