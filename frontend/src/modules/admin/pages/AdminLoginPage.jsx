import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "../../../shared/ui/LoadingSpinner.jsx";
import { getCurrentUser, login } from "../services/authService";
import { useAdminGuard } from "../hooks/useAdminGuard";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAdminGuard();
  const [username, setUsername] = useState("");
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

    if (!username || !password) {
      setError("Kullanıcı adı ve şifre alanları boş bırakılamaz.");
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
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
            <label htmlFor="username">Kullanıcı Adı:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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
