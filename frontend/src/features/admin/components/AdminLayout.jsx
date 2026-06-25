import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar.jsx";
import AdminBottomNav from "./AdminBottomNav.jsx";
import { addAdminToastListener } from "../utils/adminToast.js";
import "../styles/layout.css";

const AdminLayout = () => {
  const [toast, setToast] = useState(null);

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

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setToast(null), nextToast.durationMs);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe?.();
    };
  }, []);

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content-area">
        <Outlet />
      </main>
      <AdminBottomNav />

      {toast && (
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
      )}
    </div>
  );
};

export default AdminLayout;
