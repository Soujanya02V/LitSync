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
    fetchPapers();
  }, [id]);

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

    setSelectedFile(file);
    setShowForm(true);
  };

  const performUpload = async (withMetadata) => {
    if (!selectedFile || !id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderId", id);

      formData.append("authors", withMetadata ? authors : "");
      formData.append("year", withMetadata ? year : "");
      formData.append("summary", withMetadata ? summary : "");
      appendKeywordsField(formData, withMetadata ? keywords : "");

      const res = await axios.post(`${backendApi}/papers/upload`, formData);

      setPapers((prev) => [res.data, ...prev]);
      clearUploadForm();
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (paperId) => {
    await axios.delete(`${backendApi}/papers/${paperId}`);
    setPapers((prev) => prev.filter((p) => p._id !== paperId));
  };

  return (
    <div style={{ padding: "20px", paddingTop: 56, maxWidth: 640 }}>
      <button
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: 10, left: 10 }}
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
        onClick={handlePickFile}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Choose file
      </button>
  
      <h1>Folder</h1>
      <p>ID: {id}</p>
  
      {showForm && (
        <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
          <input
            placeholder="Authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
          />
          <input
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <textarea
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <input
            placeholder="Keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
  
          <button onClick={() => performUpload(true)}>Upload</button>
          <button onClick={() => performUpload(false)}>Skip</button>
        </div>
      )}
  
      <ul style={{ listStyle: "none", padding: 0 }}>
        {papers.map((paper, index) => {
          const key = paper._id || index;
          const isExpanded = expandedPaper[key];
  
          return (
            <li
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                padding: 16,
                margin: "12px 0",
                borderRadius: 12,
                background: "#fff",
              }}
            >
              {/* LEFT SIDE */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", fontSize: 16 }}>
                  {paper.title}
                </div>
  
                {(paper.authors || paper.year) && (
                  <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                    {paper.authors}
                    {paper.authors && paper.year && " · "}
                    {paper.year}
                  </div>
                )}
  
                {isExpanded && (
                  <div style={{ marginTop: 10 }}>
                    {paper.summary && <p>{paper.summary}</p>}
                    {paper.keywords && (
                      <p>{paper.keywords.join(", ")}</p>
                    )}
                  </div>
                )}
              </div>
  
              {/* RIGHT SIDE (ALL ACTIONS HERE) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 10,
                }}
              >
                {(paper.summary || paper.keywords?.length) && (
                  <button
                    onClick={() =>
                      setExpandedPaper((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
  
                {paper.fileUrl && (
                  <a href={paper.fileUrl} target="_blank">
                    Open
                  </a>
                )}
  
                <button onClick={() => handleDelete(paper._id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default FolderPage;