import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { NavbarV2 } from "@features/navbar/v2/NavbarV2.jsx";
import { FooterV2 } from "@features/footer/v2/FooterV2.jsx";
import { ScrollToTop, AppBackground } from "@shared";
import { DeveloperExperience } from "@features/developer";
import { RecruiterExperience } from "@features/recruiter";
import { useTheme } from "@core";
import { useUserRole } from "@core";
import { useBackendKeepAlive } from "@shared";
import { PageTransitionWrapper } from "@core";
import HomePage from "../pages/HomePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import "../shared/design-system/tokens.css";
import "../shared/design-system/reset.css";
import "../shared/design-system/typography.css";
import "../shared/design-system/components/Button.css";

const AdminRoutes = lazy(() => import("@features/admin").then((m) => ({ default: m.AdminRoutes })));
const BlogListPage = lazy(() => import("@features/blog").then((m) => ({ default: m.BlogListPage })));
const BlogDetailPage = lazy(() => import("@features/blog").then((m) => ({ default: m.BlogDetailPage })));
const ProjectsPage = lazy(() => import("@features/projects").then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailsPage = lazy(() => import("@features/projects").then((m) => ({ default: m.ProjectDetailsPage })));
const ResourcesPage = lazy(() => import("@features/resources").then((m) => ({ default: m.ResourcesPage })));
const ResourceDetailPage = lazy(() => import("@features/resources").then((m) => ({ default: m.ResourceDetailPage })));

const AppContent = () => {
  const { role } = useUserRole();

  if (role === "developer") return <DeveloperExperience />;
  if (role === "recruiter") return <RecruiterExperience />;
  return <HomePage />;
};

const AppLayout = () => {
  const { role } = useUserRole();
  const { theme } = useTheme();
  const location = useLocation();

  const isRoleHome =
    location.pathname === "/" &&
    (role === "developer" || role === "recruiter");

  const isHome = location.pathname === "/";

  return (
    <div className={`app-container show theme-${theme}`}>
      {!isRoleHome && <NavbarV2 />}
      <PageTransitionWrapper>
        {isRoleHome ? <AppContent /> : <Outlet />}
      </PageTransitionWrapper>
      {!isRoleHome && !isHome && <FooterV2 />}
      {!isRoleHome && <ScrollToTop />}
    </div>
  );
};

const App = () => {
  const isDev = import.meta.env.DEV;
  const isDebugLogsEnabled =
    import.meta.env.VITE_DEBUG_LOGS === "true" && isDev;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!supportsFinePointer) return undefined;

    const rootStyle = document.documentElement.style;
    let rafId = 0;

    const setMouseVars = (x, y) => {
      rootStyle.setProperty("--mouse-x", `${x}px`);
      rootStyle.setProperty("--mouse-y", `${y}px`);
    };

    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setMouseVars(clientX, clientY));
    };

    const handlePointerLeave = () => {
      setMouseVars(window.innerWidth * 0.5, window.innerHeight * 0.5);
    };

    handlePointerLeave();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

  const isBackendKeepAliveEnabled =
    import.meta.env.PROD ||
    import.meta.env.VITE_API_BASE_URL?.includes("onrender.com");

  useBackendKeepAlive({
    apiUrl: API_BASE_URL,
    intervalMinutes: 10,
    enabled: isBackendKeepAliveEnabled,
    debug: isDebugLogsEnabled,
  });

  if (isDebugLogsEnabled) {
    console.debug("App config initialized", {
      keepAliveEnabled: isBackendKeepAliveEnabled,
      environment: import.meta.env.MODE,
      isProduction: import.meta.env.PROD,
    });
  }

  return (
    <Router>
      <AppBackground />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <AdminRoutes />
            </Suspense>
          }
        />
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hakkimda" element={<AboutPage />} />
          <Route
            path="projects"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="projects/:slugOrId"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <ProjectDetailsPage />
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <BlogListPage />
              </Suspense>
            }
          />
          <Route
            path="blog/:slug"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <BlogDetailPage />
              </Suspense>
            }
          />
          <Route
            path="kaynaklar"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <ResourcesPage />
              </Suspense>
            }
          />
          <Route
            path="kaynaklar/:slug"
            element={
              <Suspense
                fallback={
                  <div className="component-loader">Yükleniyor...</div>
                }
              >
                <ResourceDetailPage />
              </Suspense>
            }
          />
          <Route path="iletisim" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
