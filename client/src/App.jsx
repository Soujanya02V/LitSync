import { useEffect, useState } from "react";
import { createFolder, getFolders } from "./api/folderApi";

function App() {
  const backendApi = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFolders = async () => {
    try {
      setError("");
      const data = await getFolders(backendApi);
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load folders");
    }
  };

  useEffect(() => {
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    const name = folderName.trim();
    if (!name) return;

    setLoading(true);
    try {
      setError("");
      await createFolder(name, backendApi);
      setFolderName("");
      await loadFolders();
    } catch (err) {
      setError(err?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>LitSync</h1>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ marginBottom: 10 }}>Folders</h2>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            value={folderName}
            placeholder="Folder name"
            onChange={(e) => setFolderName(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Folder"}
          </button>
        </div>

        {error ? (
          <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>
        ) : null}

        <ul style={{ marginTop: 16 }}>
          {folders.map((folder) => (
            <li key={folder._id || folder.name}>{folder.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;