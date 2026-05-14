import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase/firebase";
import Home from "./pages/Home";
import FolderPage from "./pages/FolderPage";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (user === undefined) {
    return null;
  }

  if (!user) {
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