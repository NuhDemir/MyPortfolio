import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readStoredUser } from "./authStorage.js";

export const useAuthGuard = ({
  ensureAdmin = false,
  redirectTo = "/admin/login",
} = {}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => readStoredUser());

  const refreshUser = useCallback(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    if (!ensureAdmin) {
      return;
    }

    const currentUser = readStoredUser();
    if (!currentUser || currentUser.role !== "admin") {
      navigate(redirectTo, { replace: true });
    }
  }, [ensureAdmin, navigate, redirectTo, user]);

  return { user, refreshUser };
};
