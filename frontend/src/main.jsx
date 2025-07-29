// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx"; // Import ThemeProvider
import { UserRoleProvider } from "./context/UserRoleContext.jsx";

// Global stilleri ve tema değişkenlerini yükle
import "./style/global.css"; // Bu, index.css yerine doğrudan global.css'i import edebilir.
// Eğer index.css kullanıyorsanız: import './index.css'; (ve index.css, global.css'i import etmeli)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserRoleProvider>
        <App />
      </UserRoleProvider>
    </ThemeProvider>
  </StrictMode>
);
