import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { getCurrentUser, login } from "../services/authService";
import { useAdminGuard } from "../hooks/useAdminGuard";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAdminGuard();
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
      setError("Kimlik (kullanıcı adı veya email) ve şifre gereklidir.");
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
    <div className="admin-login-page">
      <div className="login-container">
        <h2>Admin Girişi</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identity">Kullanıcı Adı veya Email:</label>
            <input
              type="text"
              id="identity"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              required
              aria-label="Kullanıcı Adı veya Email"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-label="Şifre"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="small" message="" /> : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
