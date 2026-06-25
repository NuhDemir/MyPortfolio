import { ThemeProvider } from "@core";
import { UserRoleProvider } from "@core";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <UserRoleProvider>{children}</UserRoleProvider>
  </ThemeProvider>
);

export default AppProviders;
