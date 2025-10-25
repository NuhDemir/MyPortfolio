import { NavLink } from "react-router-dom";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { logout } from "../services/authService";
import "../styles/sidebar.css";

const NAV_LINKS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    description: "Anlık görünüm",
    icon: <SpaceDashboardRoundedIcon fontSize="inherit" />,
  },
  {
    to: "/admin/projects",
    label: "Projeler",
    description: "Portföy içerikleri",
    icon: <WorkspacesRoundedIcon fontSize="inherit" />,
  },
  {
    to: "/admin/blog",
    label: "Blog",
    description: "Yayın akışı",
    icon: <ArticleRoundedIcon fontSize="inherit" />,
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <aside className={`admin-sidebar${isOpen ? " is-open" : ""}`}>
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
        <nav className="admin-sidebar__nav" aria-label="Admin menü">
          {NAV_LINKS.map(({ to, label, description, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? " is-active" : ""}`
              }
              onClick={onClose}
            >
              <span className="admin-sidebar__icon" aria-hidden="true">
                {icon}
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
