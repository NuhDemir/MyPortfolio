import { useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { getCurrentUser } from "../services/authService";
import "../styles/navbar.css";

const AdminNavbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserName(user?.username ?? null);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__left">
        <button
          type="button"
          className="admin-navbar__menu"
          aria-label="Menüyü aç"
          onClick={onToggleSidebar}
        >
          <MenuRoundedIcon fontSize="inherit" />
        </button>
        <div className="admin-navbar__heading">
          <span className="admin-navbar__eyebrow">Kontrol Merkezi</span>
          <span className="admin-page-title">Dashboard</span>
        </div>
      </div>
      <div className="admin-navbar-right">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          type="button"
        >
          {theme === "light" ? (
            <DarkModeRoundedIcon fontSize="inherit" />
          ) : (
            <LightModeRoundedIcon fontSize="inherit" />
          )}
          <span>{theme === "light" ? "Koyu Moda" : "Açık Moda"}</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
