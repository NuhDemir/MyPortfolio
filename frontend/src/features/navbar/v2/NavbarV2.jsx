import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { NAVBAR_ITEMS } from "../components/Navbar/config/navItems.js";
import { useSound } from "@shared";
import { useTheme } from "@core";
import "./NavbarV2.css";

export const NavbarV2 = ({
  onScrollToAbout,
  onScrollToProjects,
  onScrollToContact,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const playClickSound = useSound("/audio/action-click.mp3", 0.3);

  const isPathActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > 120 && current > lastScrollY) {
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

  const handleNav = (path) => {
    playClickSound();
    setMobileOpen(false);

    if (path === "/hakkimda" && onScrollToAbout) return onScrollToAbout();
    if (path === "/projects" && onScrollToProjects) return onScrollToProjects();
    if (path === "/iletisim" && onScrollToContact) return onScrollToContact();

    if (path !== location.pathname) navigate(path);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHome = () => {
    playClickSound();
    if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
  };

  return (
    <>
      <header className={`nv2 ${hidden ? "nv2--hidden" : ""}`}>
        <div className="nv2__inner">
          <div className="nv2__logo" onClick={handleHome} role="button" tabIndex={0} aria-label="Ana Sayfa">
            <img
              src="/logo/logo-portfolio.png"
              alt="Nuh Demir"
              className="nv2__logo-img"
            />
          </div>

          <nav className="nv2__links" role="navigation" aria-label="Ana navigasyon">
            {NAVBAR_ITEMS.map((item) => {
              const active = isPathActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`nv2__link ${active ? "nv2__link--active" : ""}`}
                  onClick={() => handleNav(item.path)}
                  aria-current={active ? "page" : undefined}
                >
                  {/* Framer Motion Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      className="nv2__link-bg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="nv2__link-text">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="nv2__actions">
            <button
              type="button"
              className="nv2__theme-btn"
              onClick={toggleTheme}
              aria-label={`${theme === "light" ? "Koyu" : "Açık"} temaya geç`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              type="button"
              className={`nv2__hamburger ${mobileOpen ? "nv2__hamburger--open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menüyü aç/kapat"
              aria-expanded={mobileOpen}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`nv2__mobile-overlay ${mobileOpen ? "nv2__mobile-overlay--open" : ""}`}>
        <nav role="navigation" aria-label="Mobil navigasyon">
          <ul className="nv2__mobile-links">
            {NAVBAR_ITEMS.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  className={`nv2__mobile-link ${isPathActive(item.path) ? "nv2__mobile-link--active" : ""}`}
                  onClick={() => handleNav(item.path)}
                  aria-current={isPathActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};