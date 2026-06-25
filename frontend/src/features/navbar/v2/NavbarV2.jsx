import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAVBAR_ITEMS } from "../navItems.js";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const playClickSound = useSound("/audio/action-click.mp3", 0.3);

  const isPathActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const current = window.scrollY;
        setScrolled(current > 20);
        if (current > 80 && current > lastScrollY.current + 8) {
          setHidden(true);
          setMobileOpen(false);
        } else if (current < lastScrollY.current - 8) {
          setHidden(false);
        }
        lastScrollY.current = current;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  const navClasses = [
    "nv2",
    hidden ? "nv2--hidden" : "",
    scrolled ? "nv2--scrolled" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={navClasses} role="banner">
        <div className="nv2__inner">
          {/* Logo */}
          <div
            className="nv2__logo"
            onClick={handleHome}
            role="button"
            tabIndex={0}
            aria-label="Ana Sayfa"
            onKeyDown={(e) => e.key === "Enter" && handleHome()}
          >
            <img
              src={
                theme === "light"
                  ? "/logo/logo-portfolio.png"
                  : "/logo/logo-portfolio-dark.png"
              }
              alt="Nuh Demir"
              className="nv2__logo-img"
              key={theme}
              draggable={false}
            />
          </div>

          {/* Divider */}
          <div className="nv2__divider" aria-hidden="true" />

          {/* Desktop nav */}
          <nav
            className="nv2__links"
            role="navigation"
            aria-label="Ana navigasyon"
          >
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
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="nv2__link-bg"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                          mass: 0.8,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="nv2__link-text">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="nv2__actions">
            {/* Theme toggle */}
            <button
              type="button"
              className="nv2__icon-btn"
              onClick={(e) => toggleTheme(e.currentTarget)}
              aria-label={`${theme === "light" ? "Koyu" : "Açık"} temaya geç`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ display: "flex" }}
                >
                  {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className={`nv2__hamburger ${mobileOpen ? "nv2__hamburger--open" : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
              aria-controls="nv2-mobile-menu"
            >
              <div className="nv2__burger-box" aria-hidden="true">
                <span className="nv2__burger-line" />
                <span className="nv2__burger-line" />
                <span className="nv2__burger-line" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        id="nv2-mobile-menu"
        className={`nv2__mobile-overlay ${mobileOpen ? "nv2__mobile-overlay--open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <nav role="navigation" aria-label="Mobil navigasyon">
          <ul className="nv2__mobile-links">
            {NAVBAR_ITEMS.map((item) => {
              const active = isPathActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    className={`nv2__mobile-link ${active ? "nv2__mobile-link--active" : ""}`}
                    onClick={() => handleNav(item.path)}
                    aria-current={active ? "page" : undefined}
                    tabIndex={mobileOpen ? 0 : -1}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};