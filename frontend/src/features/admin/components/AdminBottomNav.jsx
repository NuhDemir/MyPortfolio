import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../services/authService";
import { ADMIN_NAV_LINKS } from "../utils/adminNav";
import "../styles/bottomnav.css";

const AdminBottomNav = () => {
  const handleLogout = () => logout();

  return (
    <nav className="admin-bottom-nav" aria-label="Mobil navigasyon">
      <div className="admin-bottom-nav__container">
        {ADMIN_NAV_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-bottom-nav__link${isActive ? " is-active" : ""}`
            }
          >
            {Icon && <Icon size={18} />}
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="admin-bottom-nav__link admin-bottom-nav__logout"
          onClick={handleLogout}
          aria-label="Çıkış yap"
        >
          <LogOut size={18} />
          <span>Çıkış</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
