import { BrowserRouter, Routes, Route } from "react-router-dom";
import MollyMaidApp from "./pages/molly-maid-app";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MollyMaidApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
