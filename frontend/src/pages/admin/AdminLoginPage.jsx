import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getCurrentUser } from "../../services/authService";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Bu bileşen yüklendiğinde, kullanıcının zaten giriş yapıp yapmadığını kontrol et.
  useEffect(() => {
    const user = getCurrentUser();
    // Eğer geçerli bir kullanıcı ve token varsa, onu doğrudan dashboard'a yönlendir.
    if (user && user.token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  // Form gönderildiğinde bu fonksiyon çalışır.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle.
    setLoading(true); // Yükleme animasyonunu başlat.
    setError(""); // Önceki hata mesajlarını temizle.

    // Girdi alanlarının boş olup olmadığını kontrol et.
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre alanları boş bırakılamaz.");
      setLoading(false);
      return;
    }

    try {
      // authService'deki login fonksiyonunu çağır.
      await login(username, password);

      // Başarılı girişten sonra, dashboard'a yönlendir.
      // Sayfanın tamamen yenilenmesi (window.location.href),
      // tüm state'lerin ve context'lerin temizlenmesini garanti eder. Bu en temiz yöntemdir.
      window.location.href = "/admin/dashboard";
    } catch (err) {
      // authService'den fırlatılan hatayı yakala ve state'e ata.
      setError(err.message);
      console.error("Giriş hatası:", err);
    } finally {
      // İşlem başarılı da olsa, başarısız da olsa yükleme durumunu bitir.
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <h2>Admin Girişi</h2>

        {/* Hata varsa, ErrorMessage bileşenini göster */}
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Kullanıcı Adı"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Şifre"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {/* Yükleme durumuna göre ya spinner ya da metin göster */}
            {loading ? <LoadingSpinner size="small" message="" /> : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
