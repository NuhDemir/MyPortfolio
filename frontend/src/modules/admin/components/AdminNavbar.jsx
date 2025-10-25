import { useEffect, useState } from "react";
import { useTheme } from "../../../core/context/ThemeContext.jsx";
import { getCurrentUser } from "../services/authService";
import "../styles/navbar.css";

const AdminNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserName(user?.username ?? null);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <span className="admin-page-title">Dashboard</span>
      </div>
      <div className="admin-navbar-right">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          type="button"
        >
          Temayı Değiştir ({theme === "light" ? "Koyu" : "Açık"})
        </button>
        <div className="admin-user-info">
          <span>Merhaba{userName ? `, ${userName}` : ""}!</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
