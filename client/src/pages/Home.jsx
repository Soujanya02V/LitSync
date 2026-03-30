import { useEffect, useState } from "react";
import { createFolder, getFolders } from "../api/folderApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadFolders = async () => {
    try {
      setError("");
      const data = await getFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load folders");
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleCreate = async () => {
    const name = folderName.trim();
    if (!name) return;

    setLoading(true);
    try {
      setError("");
      const newFolder = await createFolder(name);
      setFolders([...folders, newFolder]);
      setFolderName("");
    } catch (err) {
      setError(err?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>LitSync</h1>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 style={{ marginTop: 20 }}>Folders</h2>

      <ul>
        {folders.map((folder) => (
          <li
            key={folder._id}
            style={{ cursor: "pointer", margin: "8px 0" }}
            onClick={() => navigate(`/folder/${folder._id}`)}
          >
            {folder.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;