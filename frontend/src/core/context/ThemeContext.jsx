import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(STORAGE_KEY) || "dark";
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  const body = document.body;

  if (theme === "dark") {
    root.classList.add("ds-dark");
  } else {
    root.classList.remove("ds-dark");
  }

  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(`theme-${theme}`);
};

const setTransitionOrigin = (el) => {
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const root = document.documentElement;
  root.style.setProperty("--theme-toggle-x", `${x}px`);
  root.style.setProperty("--theme-toggle-y", `${y}px`);
  root.style.setProperty("--theme-toggle-r", `${r}px`);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback((originElement) => {
    const flip = () =>
      setTheme((current) => (current === "light" ? "dark" : "light"));

    if (originElement && document.startViewTransition) {
      setTransitionOrigin(originElement);
      document.startViewTransition(flip);
    } else {
      flip();
    }
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
