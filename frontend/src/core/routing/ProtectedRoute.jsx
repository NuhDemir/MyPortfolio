import { Navigate, Outlet } from "react-router-dom";
import { readStoredUser } from "../auth/authStorage.js";

const userHasAccess = (user, allowedRoles) => {
  if (!user?.token) {
    return false;
  }

  if (!allowedRoles?.length) {
    return true;
  }

  return allowedRoles.includes(user.role);
};

const ProtectedRoute = ({ allowedRoles = [], redirectTo = "/admin/login" }) => {
  const user = readStoredUser();

  if (userHasAccess(user, allowedRoles)) {
    return <Outlet />;
  }

  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
