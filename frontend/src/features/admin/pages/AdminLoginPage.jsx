import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoadingSpinner } from "@shared";
import { getCurrentUser, login } from "../services/authService";
import { useAuthGuard } from "@core/auth/useAuthGuard.js";
import "../styles/login.css";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuthGuard();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!identity || !password) {
      setError("Kullanici adi veya email ve sifre gereklidir.");
      setLoading(false);
      return;
    }

    try {
      await login(identity, password);
      refreshUser();
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <img
          src="/logo/logo-portfolio-dark.png"
          alt="MyPortfolio"
          className="login-visual__logo"
        />
        <p className="login-visual__tagline">
          Portfoyunu besleyen icerik, proje ve yorumlarin tek noktadan yonetimi.
        </p>
      </div>

      <div className="login-form">
        <div className="login-form__inner">
          <div className="login-form__header">
            <h1 className="login-form__title">Hos geldin</h1>
            <p className="login-form__subtitle">Admin paneline erisim icin giris yap.</p>
          </div>

          {error && (
            <div className="login-form__error" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form__fields">
            <div className="login-form__group">
              <label htmlFor="identity">Kullanici Adi veya Email</label>
              <input
                type="text"
                id="identity"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="kullanici@email.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="password">Sifre</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-form__submit" disabled={loading}>
              {loading ? "Giris yapiliyor..." : "Giris Yap"}
            </button>
          </form>

          <Link to="/" className="login-form__back">← Siteye don</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
