import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
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
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/folder/:id" element={<FolderPage />} />
          </Routes>
        </main>
        <footer
          style={{
            padding: "16px 24px",
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-secondary)",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            marginTop: "auto",
            fontWeight: 500,
          }}
        >
          © 2026 LitSync • AI-Powered Literature Review Assistant
        </footer>
      </div>
    </Router>
  );
}

export default App;