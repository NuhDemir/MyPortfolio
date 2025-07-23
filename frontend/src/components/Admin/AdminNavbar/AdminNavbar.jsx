import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { getCurrentUser } from "../../../services/authService"; // Kullanıcı bilgisini almak için import
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null); // Kullanıcı state'i

  // Component yüklendiğinde kullanıcı bilgisini al
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <span className="admin-page-title">Dashboard</span>
      </div>
      <div className="admin-navbar-right">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          Temayı Değiştir ({theme === "light" ? "Koyu" : "Açık"})
        </button>
        <div className="admin-user-info">
          {/* Kullanıcı adı dinamik olarak gösteriliyor */}
          {user ? (
            <span>Merhaba, {user.username}!</span>
          ) : (
            <span>Merhaba!</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
