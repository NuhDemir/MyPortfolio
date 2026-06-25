import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Bolt, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@core";
import { getCurrentUser, logout } from "../services/authService";
import { ADMIN_NAV_LINKS } from "../utils/adminNav";
import "../styles/navbar.css";

const HIDDEN_AFTER_SCROLL = 120;

const AdminNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserName(user?.username ?? null);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > HIDDEN_AFTER_SCROLL && current > lastScrollY) {
        setHidden(true);
        setMobileOpen(false);
      } else if (current < lastScrollY - 10) {
        setHidden(false);
      }
      setLastScrollY(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to) => {
    if (to === "/admin/dashboard") return location.pathname === "/admin/dashboard";
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <header className={`anv2 ${hidden ? "anv2--hidden" : ""}`}>
        <div className="anv2__inner">
          <NavLink to="/admin/dashboard" className="anv2__logo" aria-label="Dashboard">
            <Bolt size={16} />
          </NavLink>

          <nav className="anv2__links" role="navigation" aria-label="Admin navigasyon">
            {ADMIN_NAV_LINKS.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`anv2__link ${active ? "anv2__link--active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="admin-active-pill"
                      className="anv2__link-bg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="anv2__link-text">{label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="anv2__actions">
            <button
              type="button"
              className="anv2__theme-btn"
              onClick={(e) => toggleTheme(e.currentTarget)}
              aria-label={`${theme === "light" ? "Koyu" : "Acik"} temaya gec`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {userName && (
              <span className="anv2__user">{userName}</span>
            )}

            <button
              type="button"
              className="anv2__logout"
              onClick={handleLogout}
              aria-label="Cikis yap"
            >
              Cikis
            </button>

            <button
              type="button"
              className={`anv2__hamburger ${mobileOpen ? "anv2__hamburger--open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menuyu ac/kapat"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`anv2__mobile-overlay ${mobileOpen ? "anv2__mobile-overlay--open" : ""}`}>
        <nav role="navigation" aria-label="Mobil admin navigasyon">
          <ul className="anv2__mobile-links">
            {ADMIN_NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={`anv2__mobile-link ${isActive(to) ? "anv2__mobile-link--active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(to) ? "page" : undefined}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="anv2__mobile-divider" />
            <li>
              <button
                type="button"
                className="anv2__mobile-link anv2__mobile-link--logout"
                onClick={handleLogout}
              >
                Cikis Yap
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminNavbar;
