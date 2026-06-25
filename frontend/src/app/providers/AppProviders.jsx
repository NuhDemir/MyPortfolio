import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@core";
import { UserRoleProvider } from "@core";

export const AppProviders = ({ children }) => (
  <HelmetProvider>
    <ThemeProvider>
      <UserRoleProvider>{children}</UserRoleProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default AppProviders;
