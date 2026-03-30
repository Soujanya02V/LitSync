import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const backendApi = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const fetchPapers = async () => {
    if (!id) return;

    setLoading(true);
    try {
      setError("");
      const res = await axios.get(`${backendApi}/papers/${id}`);
      setPapers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load papers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchPapers();
  }, [backendApi, id]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;
    if (!id) return;

    setUploading(true);
    try {
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", id);

      const res = await axios.post(`${backendApi}/papers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPapers((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (paperId) => {
    if (!paperId) return;

    try {
      setError("");
      await axios.delete(`${backendApi}/papers/${paperId}`);
      setPapers((prev) => prev.filter((p) => p._id !== paperId));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete paper");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: "8px 12px",
        }}
      >
        Home
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      <button
        onClick={handlePickFile}
        disabled={uploading}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "8px 12px",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <h1>Folder Page</h1>
      <p>Folder ID: {id}</p>

      {loading ? <p>Loading papers...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {!loading && !error && papers.length === 0 ? <p>No papers yet 🚀</p> : null}

      <ul>
        {papers.map((paper) => (
          <li
            key={paper._id || paper.fileUrl || paper.title}
            style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0" }}
          >
            <span style={{ flex: 1 }}>{paper.title}</span>
            {paper.fileUrl ? (
              <a href={paper.fileUrl} target="_blank" rel="noreferrer">
                Open
              </a>
            ) : null}
            <button onClick={() => handleDelete(paper._id)} disabled={!paper._id}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FolderPage;