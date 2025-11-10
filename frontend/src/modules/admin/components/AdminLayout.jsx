import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import "../styles/layout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

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
      <AdminSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="admin-main-content">
        <AdminNavbar onToggleSidebar={handleToggleSidebar} />
        <div className="admin-content-area">
          <Outlet />
        </div>
      </div>
      {isSidebarOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Menüyü kapat"
          onClick={handleCloseSidebar}
        />
      ) : null}
    </div>
  );
};

export default AdminLayout;
