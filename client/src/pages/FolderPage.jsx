import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

/** Comma-separated input → trimmed non-empty strings */
function keywordsStringToArray(value) {
  if (value == null || typeof value !== "string") return [];
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/**
 * `keywords` is sent as one multipart text field whose value is a JSON array string, e.g. `[]` or `["a","b"]`.
 * The server accepts this, a plain comma-separated string, or (with some parsers) repeated `keywords` fields.
 */
function appendKeywordsField(formData, keywordsFromState) {
  const list = keywordsStringToArray(keywordsFromState);
  formData.append("keywords", JSON.stringify(list));
}

function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const backendApi = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [pendingFile, setPendingFile] = useState(null);
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");

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

  const resetPendingUpload = () => {
    setPendingFile(null);
    setAuthors("");
    setYear("");
    setSummary("");
    setKeywords("");
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || !id) return;

    setError("");
    setPendingFile(file);
    setAuthors("");
    setYear("");
    setSummary("");
    setKeywords("");
  };

  const performUpload = async (includeDetails) => {
    if (!pendingFile || !id) return;

    setUploading(true);
    try {
      setError("");
      const formData = new FormData();
      formData.append("file", pendingFile);
      formData.append("folderId", id);

      const authorsValue = includeDetails ? authors : "";
      const yearValue = includeDetails ? year : "";
      const summaryValue = includeDetails ? summary : "";
      const keywordsValue = includeDetails ? keywords : "";

      formData.append("authors", authorsValue);
      formData.append("year", yearValue);
      formData.append("summary", summaryValue);
      appendKeywordsField(formData, keywordsValue);

      const res = await axios.post(`${backendApi}/papers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPapers((prev) => [res.data, ...prev]);
      resetPendingUpload();
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
    <div style={{ padding: "20px", paddingTop: 56 }}>
      <button
        type="button"
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
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />
      <button
        type="button"
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

      {pendingFile ? (
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            maxWidth: 480,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: 12 }}>
            <strong>Selected file:</strong> {pendingFile.name}
          </p>

          <label style={{ display: "block", marginBottom: 8 }}>
            Authors
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              disabled={uploading}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            Year
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={uploading}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={uploading}
              rows={4}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            Keywords (comma-separated)
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={uploading}
              placeholder="e.g. machine learning, NLP"
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, boxSizing: "border-box" }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" disabled={uploading} onClick={() => void performUpload(true)}>
              Submit
            </button>
            <button type="button" disabled={uploading} onClick={() => void performUpload(false)}>
              Skip
            </button>
          </div>
        </div>
      ) : null}

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
            <button type="button" onClick={() => handleDelete(paper._id)} disabled={!paper._id}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FolderPage;
