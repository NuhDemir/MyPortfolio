import { Outlet } from "react-router-dom";
import { useState } from "react";
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
