import { useEffect, useState } from "react";

function AILoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2200);
    const timer2 = setTimeout(() => setStep(2), 4800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { label: "Analyzing Paper...", id: 0 },
    { label: "Extracting Metadata...", id: 1 },
    { label: "Generating Insights...", id: 2 },
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 8px",
      gap: 24,
      textAlign: "center"
    }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {/* Animated outer ring */}
        <div style={{
          position: "absolute",
          inset: 0,
          border: "3px solid var(--accent-light)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 1.4s linear infinite"
        }} />
        {/* Animated inner ring counter-rotating */}
        <div style={{
          position: "absolute",
          inset: 8,
          border: "3px solid var(--primary-light)",
          borderBottomColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin-reverse 1s linear infinite"
        }} />
        <div style={{
          position: "absolute",
          inset: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22
        }}>
          ✨
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0 }}>LitSync AI Assistant</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
          Gemini is processing your research document...
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        maxWidth: 320,
        background: "var(--bg)",
        padding: 18,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        boxSizing: "border-box"
      }}>
        {steps.map((s) => {
          const isDone = step > s.id;
          const isActive = step === s.id;
          return (
            <div key={s.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left",
              opacity: isDone || isActive ? 1 : 0.45,
              transition: "opacity 0.3s ease"
            }}>
              {isDone ? (
                <span style={{ color: "#10B981", fontSize: 15, fontWeight: "bold", display: "inline-block", width: 14 }}>✓</span>
              ) : isActive ? (
                <div style={{
                  width: 12,
                  height: 12,
                  border: "2px solid var(--accent-light)",
                  borderTopColor: "var(--accent)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
              ) : (
                <div style={{
                  width: 12,
                  height: 12,
                  border: "2px solid var(--border)",
                  borderRadius: "50%"
                }} />
              )}
              <span style={{
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--accent)" : "var(--text)"
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}

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

  if (isGeneratingAI) {
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
            maxWidth: "440px",
            position: "relative",
          }}
        >
          <AILoader />
        </div>
      </div>
    );
  }

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
