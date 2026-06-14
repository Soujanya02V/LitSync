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
  onClose,
  isGeneratingAI,
  onGenerateAI,
}) {
  if (!showForm) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
          padding: "32px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "relative",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
              {editPaper ? "📝 Edit Paper Metadata" : "🔬 Literature Survey Details"}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {editPaper
                ? "Update extracted survey metadata for comparison"
                : "Optionally add survey details or upload with auto-extracted text"}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: 4,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ height: 1, backgroundColor: "var(--border)" }} />

        {/* Generate using AI button */}
        <button
          type="button"
          disabled={isGeneratingAI || uploading}
          onClick={onGenerateAI}
          className="btn"
          style={{
            padding: "10px 18px",
            background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
            color: "white",
            border: "none",
            cursor: (isGeneratingAI || uploading) ? "not-allowed" : "pointer",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 4px rgba(124, 58, 237, 0.15)",
            opacity: (isGeneratingAI || uploading) ? 0.7 : 1,
            alignSelf: "flex-start",
          }}
        >
          {isGeneratingAI ? "Generating..." : (
            <>
              <span>✨</span> Generate Using AI
            </>
          )}
        </button>

        {/* 2-Column Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Authors</label>
            <input
              type="text"
              placeholder="e.g. John Doe, Jane Smith"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Year</label>
            <input
              type="text"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Keywords</label>
            <input
              type="text"
              placeholder="e.g. LLM, RAG, NLP"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Methodology</label>
            <input
              type="text"
              placeholder="e.g. Qualitative study, Transformer architecture"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Advantages</label>
            <input
              type="text"
              placeholder="e.g. Highly accurate, low latency"
              value={advantages}
              onChange={(e) => setAdvantages(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Disadvantages</label>
            <input
              type="text"
              placeholder="e.g. High computational cost"
              value={disadvantages}
              onChange={(e) => setDisadvantages(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Limitations</label>
            <input
              type="text"
              placeholder="e.g. Limited dataset size"
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Future Scope</label>
            <input
              type="text"
              placeholder="e.g. Multi-modal extension"
              value={futureScope}
              onChange={(e) => setFutureScope(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Summary & Abstract</label>
            <textarea
              placeholder="Enter general overview or summary of the paper..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              style={{ minHeight: 90 }}
            />
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: "var(--border)" }} />

        {/* Modal Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
          {onClose && (
            <button
              disabled={uploading}
              className="btn btn-secondary"
              style={{ padding: "10px 20px" }}
              onClick={onClose}
            >
              Cancel
            </button>
          )}

          {!editPaper && (
            <button
              disabled={uploading}
              className="btn btn-secondary"
              style={{ padding: "10px 20px", color: "var(--primary)", borderColor: "var(--primary)" }}
              onClick={() => onUpload(false)}
            >
              Skip & Upload
            </button>
          )}

          <button
            disabled={uploading}
            className="btn btn-primary"
            style={{ padding: "10px 26px" }}
            onClick={() => onUpload(true)}
          >
            {uploading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }}
                />
                Uploading...
              </span>
            ) : editPaper ? (
              "Update details"
            ) : (
              "Save & Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
