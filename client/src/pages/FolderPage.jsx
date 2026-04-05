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
  const [methodology, setMethodology] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [disadvantages, setDisadvantages] = useState("");
  const [limitations, setLimitations] = useState("");
  const [futureScope, setFutureScope] = useState("");
  const [keywords, setKeywords] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editPaper, setEditPaper] = useState(null);
  const [showTable, setShowTable] = useState(false);
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
    setMethodology("");
    setAdvantages("");
    setDisadvantages("");
    setLimitations("");
    setFutureScope("");
    setKeywords("");
    setEditPaper(null);
    setShowForm(false);
  };

  const handleEdit = (paper) => {
    setEditPaper(paper);
    setSelectedFile(null);
    setAuthors(paper?.authors || "");
    setYear(paper?.year || "");
    setSummary(paper?.summary || "");
    setMethodology(paper?.methodology || "");
    setAdvantages(paper?.advantages || "");
    setDisadvantages(paper?.disadvantages || "");
    setLimitations(paper?.limitations || "");
    setFutureScope(paper?.futureScope || "");
    setKeywords(formatKeywordsLine(paper));
    setShowForm(true);
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
    if (!id || (!editPaper?._id && !selectedFile)) return;

    setUploading(true);
    try {
      if (editPaper?._id) {
        const res = await axios.put(`${backendApi}/papers/${editPaper._id}`, {
          authors,
          year,
          summary,
          methodology,
          advantages,
          disadvantages,
          limitations,
          futureScope,
          keywords,
        });

        setPapers((prev) =>
          prev.map((paper) => (paper._id === editPaper._id ? res.data : paper))
        );
        clearUploadForm();
        return;
      }

      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderId", id);

      formData.append("authors", withMetadata ? authors : "");
      formData.append("year", withMetadata ? year : "");
      formData.append("summary", withMetadata ? summary : "");
      formData.append("methodology", withMetadata ? methodology : "");
      formData.append("advantages", withMetadata ? advantages : "");
      formData.append("disadvantages", withMetadata ? disadvantages : "");
      formData.append("limitations", withMetadata ? limitations : "");
      formData.append("futureScope", withMetadata ? futureScope : "");
      appendKeywordsField(formData, withMetadata ? keywords : "");

      const res = await axios.post(`${backendApi}/papers/upload`, formData);

      setPapers((prev) => [res.data, ...prev]);
      clearUploadForm();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed");
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
      <button
        onClick={() => setShowTable((prev) => !prev)}
        style={{ position: "absolute", top: 48, right: 10 }}
      >
        {showTable ? "Show Cards" : "Table View"}
      </button>
  
      <h1>Folder</h1>
      <p>ID: {id}</p>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(40, 40, 50, 0.30)",
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 6px 32px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.08)",
              padding: "36px 32px",
              minWidth: 320,
              maxWidth: 600,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{display: "flex", flexDirection: "column", gap: 14}}>
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  color: "#111",
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                }}
                placeholder="Authors"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <textarea
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  resize: "vertical",
                  minHeight: 60,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Methodology"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Advantages"
                value={advantages}
                onChange={(e) => setAdvantages(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Disadvantages"
                value={disadvantages}
                onChange={(e) => setDisadvantages(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Limitations"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Future Scope"
                value={futureScope}
                onChange={(e) => setFutureScope(e.target.value)}
              />
              <input
                style={{
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  outline: "none",
                  fontSize: 16,
                  marginBottom: 0,
                  background: "#fafbfc",
                  transition: "box-shadow 0.15s",
                  color: "#111",
                }}
                placeholder="Keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14}}>
            <button
  disabled={uploading}
  style={{
    padding: "11px 26px",
    borderRadius: 8,
    border: "none",
    background: uploading ? "#9db8ff" : "#4477ee",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    cursor: uploading ? "not-allowed" : "pointer",
    boxShadow: "0 2px 8px rgba(83,111,255,0.07)",
    transition: "background 0.16s",
  }}
  onClick={() => performUpload(true)}
>
  {uploading ? "Uploading..." : editPaper ? "Update" : "Upload"}
</button>
              <button
  disabled={uploading}
  style={{
    padding: "11px 26px",
    borderRadius: 8,
    border: "1px solid #ccd",
    background: uploading ? "#eee" : "#f7f8fb",
    color: "#556",
    fontWeight: 500,
    fontSize: 16,
    cursor: uploading ? "not-allowed" : "pointer",
  }}
  onClick={() => performUpload(false)}
>
  Skip
</button>
            </div>
          </div>
        </div>
      )}

  
      {!showTable && (
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
    alignItems: "flex-start",
    padding: "18px 20px",
    margin: "16px 0",
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  }}
>
  {/* LEFT SIDE */}
  <div style={{ flex: 1 }}>
  {/* TITLE */}
  <div style={{ fontWeight: 600, fontSize: 17 }}>
    {paper.title}
  </div>

  {/* AUTHORS + YEAR */}
  {(paper.authors || paper.year) && (
    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
      {paper.authors}
      {paper.authors && paper.year && " · "}
      {paper.year}
    </div>
  )}

  {/* EXPANDED CONTENT */}
  {isExpanded && (
    <div style={{ marginTop: 10 }}>
      {paper.summary && <p>{paper.summary}</p>}
      {paper.keywords && (
        <p>{paper.keywords.join(", ")}</p>
      )}
    </div>
  )}

  {/* SEE MORE BUTTON (NOW AT BOTTOM ✅) */}
  {(paper.summary || paper.keywords?.length) && (
    <div style={{ marginTop: 10 }}>
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
          padding: 0,
          textDecoration: "underline",
        }}
      >
        {isExpanded ? "See less" : "See more"}
      </button>
    </div>
  )}
</div>

  {/* RIGHT SIDE */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 10,
      minWidth: 80,
    }}
  >
    {paper.fileUrl && (
      <a href={paper.fileUrl} target="_blank" rel="noreferrer">
        Open
      </a>
    )}

    <button onClick={() => handleEdit(paper)}>Edit</button>

    <button onClick={() => handleDelete(paper._id)}>
      Delete
    </button>
  </div>
</li>
          );
        })}
      </ul>
      )}

      {showTable && (
        <div style={{ marginTop: 16 }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Year</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Methodology</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Advantages</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Disadvantages</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Limitations</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Future Scope</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper, index) => (
                  <tr key={paperRowKey(paper, index)}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.title || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.year || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.methodology || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.advantages || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.disadvantages || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.limitations || ""}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{paper.futureScope || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            style={{
              marginTop: 12,
              padding: "11px 26px",
              borderRadius: 8,
              border: "none",
              background: "#4477ee",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(83,111,255,0.07)",
              transition: "background 0.16s",
            }}
          >
            Edit Table
          </button>
        </div>
      )}
    </div>
  );
};
export default FolderPage;