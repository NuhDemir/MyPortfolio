import { NavLink } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { logout } from "../services/authService";
import { ADMIN_NAV_LINKS } from "../utils/adminNav";
import "../styles/sidebar.css";

const AdminSidebar = ({ id, isOpen, onClose }) => {
  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <aside
      id={id}
      className={`admin-sidebar${isOpen ? " is-open" : ""}`}
      aria-label="Admin menü"
    >
      <div className="admin-sidebar__inner">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-icon" aria-hidden="true">
            <BoltRoundedIcon fontSize="inherit" />
          </span>
          <div className="admin-sidebar__brand-text">
            <span>Control Room</span>
            <small>MyPortfolio Admin</small>
          </div>
        </div>
        <nav className="admin-sidebar__nav" aria-label="Admin sayfaları">
          {ADMIN_NAV_LINKS.map(({ to, label, description, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? " is-active" : ""}`
              }
              onClick={onClose}
            >
              <span className="admin-sidebar__icon" aria-hidden="true">
                {Icon ? <Icon fontSize="inherit" /> : null}
              </span>
              <span className="admin-sidebar__label">
                <span className="admin-sidebar__label-primary">{label}</span>
                <span className="admin-sidebar__label-secondary">
                  {description}
                </span>
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__logout"
            type="button"
            onClick={handleLogout}
          >
            <LogoutRoundedIcon fontSize="inherit" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
      <button
        type="button"
        className="admin-sidebar__close"
        aria-label="Menüyü kapat"
        onClick={onClose}
      >
        <CloseRoundedIcon fontSize="inherit" />
      </button>
    </aside>
  );
};

export default AdminSidebar;
