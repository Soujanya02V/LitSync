import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import UploadModal from "../components/UploadModal";
import PaperCard from "../components/PaperCard";
import { useAuth } from "../contexts/AuthContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

function FolderPage() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const backendApi = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [folder, setFolder] = useState(null);

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
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tableEdits, setTableEdits] = useState({});
  const [expandedPaper, setExpandedPaper] = useState({});

  const fileInputRef = useRef(null);

  const fetchPapers = async () => {
    if (!id || !currentUser?.uid) return;

    setLoading(true);
    try {
      setError("");
      const res = await axios.get(`${backendApi}/papers/${id}`, {
        params: { createdBy: currentUser.uid },
      });
      setPapers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load papers");
    } finally {
      setLoading(false);
    }
  };

  const fetchFolder = async () => {
    if (!id || !currentUser?.uid) return;
    try {
      const res = await axios.get(`${backendApi}/folders/${id}`, {
        params: { createdBy: currentUser.uid },
      });
      setFolder(res?.data || null);
    } catch {
      setFolder(null);
    }
  };

  useEffect(() => {
    if (!id || !currentUser?.uid) return;
    fetchPapers();
    fetchFolder();
  }, [id, currentUser?.uid]);

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

      if (!currentUser?.uid) {
        setError("Not signed in");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderId", id);
      formData.append("createdBy", currentUser.uid);

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

  const handleExportPdf = async () => {
    let folderName =
      folder?.name != null && String(folder.name).trim() !== "" ? String(folder.name).trim() : "";

    // If user clicks export before folder loads, fetch it once.
    if (!folderName && id && currentUser?.uid) {
      try {
        const res = await axios.get(`${backendApi}/folders/${id}`, {
          params: { createdBy: currentUser.uid },
        });
        setFolder(res?.data || null);
        folderName =
          res?.data?.name != null && String(res.data.name).trim() !== ""
            ? String(res.data.name).trim()
            : "";
      } catch {
        // fall back below
      }
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    const safeFolderName = (folderName || "Folder").trim() || "Folder";
    const pdfTitle = `${safeFolderName} - Literature Survey`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(pdfTitle, 24, 28);

    autoTable(doc, {
      head: [
        [
          "Title",
          "Year",
          "Methodology",
          "Advantages",
          "Disadvantages",
          "Limitations",
          "Future Scope",
        ],
      ],
      body: papers.map((p) => [
        p?.title ? String(p.title) : "",
        p?.year ? String(p.year) : "",
        p?.methodology ? String(p.methodology) : "",
        p?.advantages ? String(p.advantages) : "",
        p?.disadvantages ? String(p.disadvantages) : "",
        p?.limitations ? String(p.limitations) : "",
        p?.futureScope ? String(p.futureScope) : "",
      ]),
      styles: { fontSize: 9, cellPadding: 6, valign: "top" },
      headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42] },
      theme: "grid",
      margin: { top: 44, left: 24, right: 24, bottom: 24 },
    });

    const fileSafe = safeFolderName.replace(/[\\\\/:*?"<>|]/g, "_").replace(/\\s+/g, "_");
    doc.save(`${fileSafe}_Literature_Survey.pdf`);
  };

  const handleTableFieldChange = (paperId, field, value) => {
    if (!paperId) return;

    setTableEdits((prev) => ({
      ...prev,
      [paperId]: {
        ...(prev[paperId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveTableChanges = async () => {
    const updates = Object.entries(tableEdits).filter(([paperId, fields]) => {
      if (!paperId) return false;
      if (!fields || typeof fields !== "object") return false;
      return Object.keys(fields).length > 0;
    });

    if (updates.length === 0) {
      setIsEditingTable(false);
      setTableEdits({});
      return;
    }

    try {
      const responses = await Promise.all(
        updates.map(([paperId, fields]) =>
          axios.put(`${backendApi}/papers/${paperId}`, {
            methodology: fields.methodology,
            advantages: fields.advantages,
            disadvantages: fields.disadvantages,
            limitations: fields.limitations,
            futureScope: fields.futureScope,
          })
        )
      );

      const updatedById = responses.reduce((acc, res) => {
        const updatedPaper = res?.data;
        if (updatedPaper?._id) {
          acc[updatedPaper._id] = updatedPaper;
        }
        return acc;
      }, {});

      setPapers((prev) => prev.map((paper) => updatedById[paper._id] || paper));
      setIsEditingTable(false);
      setTableEdits({});
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save table changes");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        paddingTop: 56,
        maxWidth: showTable ? "100%" : 640,
        position: "relative",
      }}
    >
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
      {loading ? <p style={{ color: "#475569" }}>Loading papers…</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <UploadModal
        showForm={showForm}
        authors={authors}
        setAuthors={setAuthors}
        year={year}
        setYear={setYear}
        summary={summary}
        setSummary={setSummary}
        methodology={methodology}
        setMethodology={setMethodology}
        advantages={advantages}
        setAdvantages={setAdvantages}
        disadvantages={disadvantages}
        setDisadvantages={setDisadvantages}
        limitations={limitations}
        setLimitations={setLimitations}
        futureScope={futureScope}
        setFutureScope={setFutureScope}
        keywords={keywords}
        setKeywords={setKeywords}
        uploading={uploading}
        editPaper={editPaper}
        onUpload={performUpload}
      />

      {!showTable && (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {papers.map((paper, index) => {
          const key = paper._id || index;
          const isExpanded = expandedPaper[key];
  
          return (
            <PaperCard
              key={key}
              paper={paper}
              isExpanded={isExpanded}
              onToggleExpand={() =>
                setExpandedPaper((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }))
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </ul>
      )}

      {showTable && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setShowTable(false)}
            style={{
              marginBottom: 12,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #ccd",
              background: "#f7f8fb",
              color: "#334155",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Back to Papers
          </button>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 980,
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
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      {isEditingTable ? (
                        <textarea
                          rows={2}
                          value={tableEdits[paper._id]?.methodology ?? (paper.methodology || "")}
                          onChange={(e) => handleTableFieldChange(paper._id, "methodology", e.target.value)}
                          style={{ width: "100%", minWidth: 140, padding: "6px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, resize: "vertical" }}
                        />
                      ) : (
                        paper.methodology || ""
                      )}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      {isEditingTable ? (
                        <textarea
                          rows={2}
                          value={tableEdits[paper._id]?.advantages ?? (paper.advantages || "")}
                          onChange={(e) => handleTableFieldChange(paper._id, "advantages", e.target.value)}
                          style={{ width: "100%", minWidth: 140, padding: "6px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, resize: "vertical" }}
                        />
                      ) : (
                        paper.advantages || ""
                      )}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      {isEditingTable ? (
                        <textarea
                          rows={2}
                          value={tableEdits[paper._id]?.disadvantages ?? (paper.disadvantages || "")}
                          onChange={(e) => handleTableFieldChange(paper._id, "disadvantages", e.target.value)}
                          style={{ width: "100%", minWidth: 140, padding: "6px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, resize: "vertical" }}
                        />
                      ) : (
                        paper.disadvantages || ""
                      )}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      {isEditingTable ? (
                        <textarea
                          rows={2}
                          value={tableEdits[paper._id]?.limitations ?? (paper.limitations || "")}
                          onChange={(e) => handleTableFieldChange(paper._id, "limitations", e.target.value)}
                          style={{ width: "100%", minWidth: 140, padding: "6px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, resize: "vertical" }}
                        />
                      ) : (
                        paper.limitations || ""
                      )}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      {isEditingTable ? (
                        <textarea
                          rows={2}
                          value={tableEdits[paper._id]?.futureScope ?? (paper.futureScope || "")}
                          onChange={(e) => handleTableFieldChange(paper._id, "futureScope", e.target.value)}
                          style={{ width: "100%", minWidth: 140, padding: "6px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, resize: "vertical" }}
                        />
                      ) : (
                        paper.futureScope || ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button
              type="button"
              onClick={handleExportPdf}
              style={{
                padding: "11px 18px",
                borderRadius: 8,
                border: "1px solid #ccd",
                background: "#f7f8fb",
                color: "#334155",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Export PDF
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isEditingTable) {
                  setIsEditingTable(true);
                  return;
                }
                handleSaveTableChanges();
              }}
              style={{
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
              {isEditingTable ? "Save Changes" : "Edit Table"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default FolderPage;