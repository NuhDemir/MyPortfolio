/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readStoredUser } from "../auth/authStorage.js";

const UserRoleContext = createContext({
  role: null,
  selectRole: () => {},
  resetRole: () => {},
  hasSelectedRole: false,
});

export const useUserRole = () => useContext(UserRoleContext);

const getInitialRole = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const storedUser = readStoredUser();
  if (storedUser?.role) {
    return storedUser.role;
  }

  return window.sessionStorage.getItem("userRole");
};

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(getInitialRole);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (role) {
      window.sessionStorage.setItem("userRole", role);
    } else {
      window.sessionStorage.removeItem("userRole");
    }
  }, [role]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event) => {
      if (event.key === "userInfo") {
        const storedUser = readStoredUser();
        setRole(storedUser?.role ?? null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      role,
      selectRole: setRole,
      resetRole: () => setRole(null),
      hasSelectedRole: role != null,
    }),
    [role]
  );

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};
