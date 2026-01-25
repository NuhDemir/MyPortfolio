import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { getCurrentUser } from "../services/authService";
import { getAdminPageMeta } from "../utils/adminNav";
import "../styles/navbar.css";

const AdminNavbar = ({ onToggleSidebar, isSidebarOpen, sidebarId }) => {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState(null);
  const location = useLocation();

  const meta = useMemo(
    () => getAdminPageMeta(location?.pathname),
    [location?.pathname],
  );

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
          aria-controls={sidebarId}
          aria-expanded={Boolean(isSidebarOpen)}
          onClick={onToggleSidebar}
        >
          <MenuRoundedIcon fontSize="inherit" />
        </button>
        <div className="admin-navbar__heading">
          <span className="admin-navbar__eyebrow">{meta.eyebrow}</span>
          <span className="admin-page-title">{meta.title}</span>
        </div>
      </div>
      <div className="admin-navbar-right">
        {userName ? (
          <div className="admin-user-info" aria-label="Giriş yapan kullanıcı">
            <span className="admin-navbar__user-icon" aria-hidden="true">
              <PersonRoundedIcon fontSize="inherit" />
            </span>
            <span className="admin-navbar__user-name">{userName}</span>
          </div>
        ) : null}
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
