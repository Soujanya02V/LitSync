import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FolderPage from "./pages/FolderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/folder/:id" element={<FolderPage />} />
      </Routes>
    </Router>
  );
}

export default App;