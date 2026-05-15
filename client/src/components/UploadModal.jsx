function UploadModal({
  showForm,
  authors,
  setAuthors,
  year,
  setYear,
  summary,
  setSummary,
  methodology,
  setMethodology,
  advantages,
  setAdvantages,
  disadvantages,
  setDisadvantages,
  limitations,
  setLimitations,
  futureScope,
  setFutureScope,
  keywords,
  setKeywords,
  uploading,
  editPaper,
  onUpload,
}) {
  if (!showForm) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(40, 40, 50, 0.30)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14 }}>
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
            onClick={() => onUpload(true)}
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
            onClick={() => onUpload(false)}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
