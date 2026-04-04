import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function keywordsStringToArray(value) {
  if (value == null || typeof value !== "string") return [];
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function appendKeywordsField(formData, keywordsFromState) {
  const list = keywordsStringToArray(keywordsFromState);
  formData.append("keywords", JSON.stringify(list));
}

function paperRowKey(paper, index) {
  return paper._id != null ? String(paper._id) : `paper-${index}`;
}

function formatKeywordsLine(paper) {
  const kw = paper.keywords;
  if (!Array.isArray(kw) || kw.length === 0) return "";
  return kw.map(String).map((s) => s.trim()).filter(Boolean).join(", ");
}

function hasExpandablePaperDetails(paper) {
  const summary = paper.summary != null ? String(paper.summary).trim() : "";
  const kwLine = formatKeywordsLine(paper);
  return Boolean(summary || kwLine);
}

function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const backendApi = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedPaper, setExpandedPaper] = useState({});

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

  const clearUploadForm = () => {
    setSelectedFile(null);
    setAuthors("");
    setYear("");
    setSummary("");
    setKeywords("");
    setShowForm(false);
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || !id) return;

    setError("");
    setSelectedFile(file);
    setAuthors("");
    setYear("");
    setSummary("");
    setKeywords("");
    setShowForm(true);
  };

  const performUpload = async (withMetadata) => {
    if (!selectedFile || !id) return;

    setUploading(true);
    try {
      setError("");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderId", id);

      const authorsValue = withMetadata ? authors : "";
      const yearValue = withMetadata ? year : "";
      const summaryValue = withMetadata ? summary : "";
      const keywordsValue = withMetadata ? keywords : "";

      formData.append("authors", authorsValue);
      formData.append("year", yearValue);
      formData.append("summary", summaryValue);
      appendKeywordsField(formData, keywordsValue);

      const res = await axios.post(`${backendApi}/papers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPapers((prev) => [res.data, ...prev]);
      clearUploadForm();
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

  const fieldStyle = {
    display: "block",
    width: "100%",
    marginTop: 4,
    padding: "8px 10px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 14,
  };

  const labelStyle = { display: "block", marginBottom: 12, fontSize: 14, color: "#333" };

  return (
    <div style={{ padding: "20px", paddingTop: 56, maxWidth: 640 }}>
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
        Choose file
      </button>

      <h1 style={{ marginTop: 0 }}>Folder</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>ID: {id}</p>

      {showForm && selectedFile ? (
        <section
          style={{
            marginBottom: 28,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            <strong>File:</strong> {selectedFile.name}
          </p>

          <label style={labelStyle}>
            Authors
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              disabled={uploading}
              style={fieldStyle}
            />
          </label>

          <label style={labelStyle}>
            Year
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={uploading}
              style={fieldStyle}
            />
          </label>

          <label style={labelStyle}>
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={uploading}
              rows={4}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </label>

          <label style={labelStyle}>
            Keywords <span style={{ color: "#888", fontWeight: "normal" }}>(comma-separated)</span>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={uploading}
              placeholder="e.g. machine learning, NLP"
              style={fieldStyle}
            />
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="button" disabled={uploading} onClick={() => void performUpload(true)}>
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button type="button" disabled={uploading} onClick={() => void performUpload(false)}>
              Skip
            </button>
          </div>
        </section>
      ) : null}

      {loading ? <p>Loading papers…</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {!loading && !error && papers.length === 0 ? <p style={{ color: "#666" }}>No papers yet.</p> : null}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {papers.map((paper, index) => {
          const rowKey = paperRowKey(paper, index);
          const isExpanded = Boolean(expandedPaper[rowKey]);
          const authorsLine =
            paper.authors != null && String(paper.authors).trim() !== ""
              ? String(paper.authors).trim()
              : "";
          const yearLine =
            paper.year != null && String(paper.year).trim() !== "" ? String(paper.year).trim() : "";
          const showMeta = Boolean(authorsLine || yearLine);
          const expandable = hasExpandablePaperDetails(paper);
          const kwLine = formatKeywordsLine(paper);
          const summaryText = paper.summary != null ? String(paper.summary).trim() : "";

          return (
            <li
              key={rowKey}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                margin: "10px 0",
                padding: "12px 14px",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35 }}>{paper.title}</div>
                {showMeta ? (
                  <div style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.4 }}>
                    {authorsLine ? <span>{authorsLine}</span> : null}
                    {authorsLine && yearLine ? (
                      <span style={{ color: "#aaa", margin: "0 6px" }}>·</span>
                    ) : null}
                    {yearLine ? <span>{yearLine}</span> : null}
                  </div>
                ) : null}
                {expandable ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPaper((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }))
                    }
                    style={{
                      marginTop: 8,
                      padding: 0,
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontSize: 13,
                      textDecoration: "underline",
                    }}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                ) : null}
                {isExpanded && expandable ? (
                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: "1px solid #eee",
                      fontSize: 14,
                      color: "#444",
                      lineHeight: 1.5,
                    }}
                  >
                    {summaryText ? (
                      <p style={{ margin: "0 0 10px" }}>{summaryText}</p>
                    ) : null}
                    {kwLine ? (
                      <p style={{ margin: 0 }}>
                        <span style={{ color: "#666", fontSize: 12 }}>Keywords: </span>
                        {kwLine}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                {paper.fileUrl ? (
                  <a href={paper.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14 }}>
                    Open
                  </a>
                ) : null}
                <button type="button" onClick={() => handleDelete(paper._id)} disabled={!paper._id}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FolderPage;
