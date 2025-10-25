import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export const useAdminGuard = ({
  ensureAdmin = false,
  redirectTo = "/admin/login",
} = {}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (!ensureAdmin) {
      return;
    }

    if (!user || user.role !== "admin") {
      navigate(redirectTo, { replace: true });
    }
  }, [ensureAdmin, navigate, redirectTo, user]);

  return { user, refreshUser };
};
