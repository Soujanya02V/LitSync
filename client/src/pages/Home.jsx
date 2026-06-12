import { useEffect, useState } from "react";
import { createFolder, deleteFolder, getFolders } from "../api/folderApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";

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
      toast.success(`Folder "${name}" created successfully!`);
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
            Delete folder &quot;{folder.name}&quot;? Papers in this folder will be permanently removed.
          </span>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: 13 }}
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{
                padding: "6px 12px",
                fontSize: 13,
                backgroundColor: "var(--danger)",
                color: "#fff",
                border: "none"
              }}
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
    <div
      style={{
        padding: "40px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 32,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
            LitSync Workspace
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Organize research folders, upload publications, and extract structured survey reports.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="New folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={{
              padding: "10px 14px",
              width: 240,
              fontSize: 14,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleCreate();
              }
            }}
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: 14 }}
          >
            {loading ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--danger-light)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "var(--radius-sm)",
            color: "var(--danger)",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
          Your Folders
        </h2>

        {folders.length === 0 ? (
          <EmptyState
            title="No folders yet"
            subtitle="Create your first research folder to begin uploading publications."
            icon="📁"
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {folders.map((folder) => (
              <div
                key={folder._id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/folder/${folder._id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/folder/${folder._id}`);
                  }
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: 20,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-card)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  textAlign: "left",
                  minHeight: 120,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      fontSize: 24,
                      lineHeight: 1,
                      padding: "8px",
                      background: "var(--primary-light)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--primary)",
                    }}
                  >
                    📁
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "var(--text)",
                      }}
                    >
                      {folder.name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      Click to open survey workspace
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 16,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{
                      padding: "4px 10px",
                      fontSize: 12,
                      borderRadius: "var(--radius-sm)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmToast(folder);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
