import { ThemeProvider } from "../../core/context/ThemeContext.jsx";
import { UserRoleProvider } from "../../core/context/UserRoleContext.jsx";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <UserRoleProvider>{children}</UserRoleProvider>
  </ThemeProvider>
);

export default AppProviders;
