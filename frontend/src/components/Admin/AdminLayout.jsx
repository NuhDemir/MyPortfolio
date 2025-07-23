// frontend/src/components/Admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar/AdminSidebar";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import "./AdminLayout.css"; // Yeni CSS dosyası oluşturacağız

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <AdminNavbar />
        <div className="admin-content-area">
          <Outlet /> {/* Child rotaların içeriği buraya render edilecek */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
