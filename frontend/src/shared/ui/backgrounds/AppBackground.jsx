import { useLocation } from "react-router-dom";
import { PatternBackground } from "@shared";
import "./AppBackground.css";

const AppBackground = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="ds-app-bg" aria-hidden="true">
      <PatternBackground variant="grid" opacity={0.45} />
    </div>
  );
};

export default AppBackground;
