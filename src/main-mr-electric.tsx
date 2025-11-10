import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import MrElectricApp from "./pages/mr-electric-app";
import { asgardeoConfig } from "./config/mrelectric.config";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider config={asgardeoConfig}>
      <MrElectricApp />
    </AuthProvider>
  </StrictMode>
);
