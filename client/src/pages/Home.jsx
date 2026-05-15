import { useEffect, useState } from "react";
import { createFolder, deleteFolder, getFolders } from "../api/folderApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const { currentUser } = useAuth();
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadFolders = async () => {
    try {
      setError("");
      if (!currentUser?.uid) return;
      const data = await getFolders(currentUser.uid);
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load folders");
    }
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    loadFolders();
  }, [currentUser?.uid]);

  const handleCreate = async () => {
    const name = folderName.trim();
    if (!name) return;

    setLoading(true);
    try {
      setError("");
      if (!currentUser?.uid) {
        setError("Not signed in");
        return;
      }
      const newFolder = await createFolder(name, currentUser.uid);
      setFolders([...folders, newFolder]);
      setFolderName("");
    } catch (err) {
      setError(err?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const performDeleteFolder = async (folder) => {
    const loadingId = toast.loading("Deleting folder…");
    try {
      await deleteFolder(folder._id);
      setFolders((prev) => prev.filter((f) => f._id !== folder._id));
      toast.dismiss(loadingId);
      toast.success(`Folder "${folder.name}" was deleted.`);
    } catch (err) {
      toast.dismiss(loadingId);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete folder";
      toast.error(msg);
    }
  };

  const openDeleteConfirmToast = (folder) => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span>
            Delete folder &quot;{folder.name}&quot;? Papers in this folder will be removed.
          </span>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                void performDeleteFolder(folder);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: `confirm-delete-folder-${folder._id}` }
    );
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

      {folders.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "180px",
            color: "#555",
            fontSize: 18,
            marginTop: 40,
            border: "1px solid #eee",
            borderRadius: 8,
            background: "#fafbfc",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <div style={{ fontWeight: 500, fontSize: 22, marginBottom: 8 }}>
            No folders yet <span role="img" aria-label="folder">📁</span>
          </div>
          <div style={{ fontSize: 16, color: "#888" }}>
            Create your first research folder
          </div>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {folders.map((folder) => (
            <li
              key={folder._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "8px 0",
              }}
            >
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/folder/${folder._id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/folder/${folder._id}`);
                  }
                }}
                style={{ cursor: "pointer", flex: 1 }}
              >
                {folder.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmToast(folder);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
