import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../../core/routing/ProtectedRoute.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

const AdminDashboardPage = lazy(() =>
  import("../pages/AdminDashboardPage.jsx")
);
const AdminProjectManagementPage = lazy(() =>
  import("../pages/AdminProjectManagementPage.jsx")
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
      <Route
        element={
          <Suspense
            fallback={<div className="component-loader">Yükleniyor...</div>}
          >
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <AdminProjectManagementPage />
            </Suspense>
          }
        />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default AdminRoutes;
