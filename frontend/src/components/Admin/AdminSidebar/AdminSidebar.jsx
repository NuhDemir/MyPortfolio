import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../services/authService"; // logout fonksiyonunu import et
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate(); // Yönlendirme için hook

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    logout(); // localStorage'daki kullanıcı bilgilerini temizle
    navigate("/admin/login"); // Kullanıcıyı giriş sayfasına yönlendir
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/projects"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Projeler
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/blog"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Blog Yazıları
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
