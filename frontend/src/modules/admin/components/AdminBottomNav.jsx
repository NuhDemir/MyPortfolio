import { NavLink, useNavigate } from "react-router-dom";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { logout } from "../services/authService";
import "../styles/bottomnav.css";

const BOTTOM_NAV_LINKS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <SpaceDashboardRoundedIcon fontSize="inherit" />,
  },
  {
    to: "/admin/projects",
    label: "Projeler",
    icon: <WorkspacesRoundedIcon fontSize="inherit" />,
  },
  {
    to: "/admin/blog",
    label: "Blog",
    icon: <ArticleRoundedIcon fontSize="inherit" />,
  },
  {
    to: "/admin/comments",
    label: "Yorumlar",
    icon: <CommentRoundedIcon fontSize="inherit" />,
  },
];

const AdminBottomNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="admin-bottom-nav" aria-label="Mobil navigasyon">
      <div className="admin-bottom-nav__container">
        {/* Navigation Links */}
        {BOTTOM_NAV_LINKS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-bottom-nav__link${isActive ? " is-active" : ""}`
            }
          >
            <span className="admin-bottom-nav__icon" aria-hidden="true">
              {icon}
            </span>
            <span className="admin-bottom-nav__label">{label}</span>
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          type="button"
          className="admin-bottom-nav__link admin-bottom-nav__logout"
          onClick={handleLogout}
          aria-label="Çıkış yap"
        >
          <span className="admin-bottom-nav__icon" aria-hidden="true">
            <LogoutRoundedIcon fontSize="inherit" />
          </span>
          <span className="admin-bottom-nav__label">Çıkış</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
