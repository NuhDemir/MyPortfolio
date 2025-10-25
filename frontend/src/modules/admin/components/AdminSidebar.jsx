import { NavLink } from "react-router-dom";
import { logout } from "../services/authService";
import "../styles/sidebar.css";

const AdminSidebar = () => {
  const handleLogout = () => {
    logout();
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
        <button
          className="admin-logout-btn"
          type="button"
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
