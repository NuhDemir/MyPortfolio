import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@core/routing/ProtectedRoute.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

const AdminDashboardPage = lazy(() =>
  import("../pages/AdminDashboardPage.jsx")
);
const AdminProjectManagementPage = lazy(() =>
  import("../pages/AdminProjectManagementPage.jsx")
);
const AdminBlogManagementPage = lazy(() =>
  import("../pages/AdminBlogManagementPage.jsx")
);

const AdminRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="login" replace />} />
    <Route path="login" element={<AdminLoginPage />} />
    <Route
      element={
        <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login" />
      }
    >
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectManagementPage />} />
        <Route path="blog" element={<AdminBlogManagementPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>
  </Routes>
);

export default AdminRoutes;
