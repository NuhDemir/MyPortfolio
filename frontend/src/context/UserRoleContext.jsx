import React, { createContext, useState, useContext, useEffect } from "react";

const UserRoleContext = createContext();

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({ children }) => {
  // Sayfa yüklendiğinde sessionStorage'dan rolü al, yoksa null olsun
  const [role, setRole] = useState(() => sessionStorage.getItem("userRole"));

  // Rol değiştiğinde sessionStorage'ı güncelle
  useEffect(() => {
    if (role) {
      sessionStorage.setItem("userRole", role);
    } else {
      sessionStorage.removeItem("userRole");
    }
  }, [role]);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const resetRole = () => {
    setRole(null);
  };

  // `hasSelectedRole`, bir rol seçilip seçilmediğini kolayca kontrol etmemizi sağlar
  const hasSelectedRole = role !== null;

  const value = {
    role,
    selectRole,
    resetRole,
    hasSelectedRole,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};
