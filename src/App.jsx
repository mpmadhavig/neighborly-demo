import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@asgardeo/auth-react";
import MollyMaidApp from "./pages/molly-maid-app";
import { asgardeoConfig } from "./config/asgardeo.config";
import "./index.css";

function App() {
  return (
    <AuthProvider config={asgardeoConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MollyMaidApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
