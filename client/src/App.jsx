import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import FolderPage from "./pages/FolderPage";
import Login from "./pages/Login";

function App() {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    return null;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/folder/:id" element={<FolderPage />} />
      </Routes>
    </Router>
  );
}

export default App;