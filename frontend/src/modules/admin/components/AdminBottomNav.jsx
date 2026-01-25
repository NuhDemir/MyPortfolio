import { NavLink, useNavigate } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { logout } from "../services/authService";
import { ADMIN_NAV_LINKS } from "../utils/adminNav";
import "../styles/bottomnav.css";

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
        {ADMIN_NAV_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-bottom-nav__link${isActive ? " is-active" : ""}`
            }
          >
            <span className="admin-bottom-nav__icon" aria-hidden="true">
              {Icon ? <Icon fontSize="inherit" /> : null}
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
