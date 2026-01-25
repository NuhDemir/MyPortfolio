import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminBottomNav from "./AdminBottomNav";
import { addAdminToastListener } from "../utils/adminToast";
import "../styles/layout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const sidebarId = "admin-sidebar";

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (!isSidebarOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    let timeoutId;

    const unsubscribe = addAdminToastListener((detail) => {
      const nextToast = {
        id: Date.now(),
        message: detail?.message || "",
        type: detail?.type || "info",
        durationMs: detail?.durationMs ?? 2600,
      };

      setToast(nextToast);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setToast(null);
      }, nextToast.durationMs);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const { body } = document;
    body.classList.add("admin-theme");

    return () => {
      body.classList.remove("admin-theme");
      body.classList.remove("admin-sidebar-open");
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const { body } = document;
    body.classList.toggle("admin-sidebar-open", isSidebarOpen);

    return () => {
      body.classList.remove("admin-sidebar-open");
    };
  }, [isSidebarOpen]);

  return (
    <div className={`admin-layout${isSidebarOpen ? " sidebar-open" : ""}`}>
      <AdminSidebar
        id={sidebarId}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
      <div className="admin-main-content">
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          sidebarId={sidebarId}
        />
        <div className="admin-content-area">
          <Outlet />
        </div>
      </div>
      <AdminBottomNav />
      {isSidebarOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Menüyü kapat"
          onClick={handleCloseSidebar}
        />
      ) : null}

      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="admin-toast__message">{toast.message}</span>
          <button
            type="button"
            className="admin-toast__close"
            aria-label="Bildirimi kapat"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AdminLayout;
