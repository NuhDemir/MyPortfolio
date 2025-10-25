import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import "../styles/layout.css";

const AdminLayout = () => (
  <div className="admin-layout">
    <AdminSidebar />
    <div className="admin-main-content">
      <AdminNavbar />
      <div className="admin-content-area">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
