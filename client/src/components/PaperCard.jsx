import { useState } from "react";

function PaperCard({ paper, isExpanded, onToggleExpand, onEdit, onDelete, onAutofill }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutofillClick = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      await onAutofill(paper._id);
    } finally {
      setIsGenerating(false);
    }
  };
  // Format keywords array to elements
  const renderKeywords = () => {
    if (!paper.keywords || !Array.isArray(paper.keywords) || paper.keywords.length === 0) {
      return null;
    }
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {paper.keywords.map((kw, idx) => (
          <span
            key={idx}
            style={{
              padding: "3px 8px",
              backgroundColor: "var(--accent-light)",
              color: "var(--accent)",
              borderRadius: "var(--radius-sm)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {kw.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <li
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        margin: "20px 0",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--primary)",
        boxShadow: "var(--shadow-card)",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.4,
              marginBottom: 8,
            }}
          >
            {paper.title}
          </h3>

          {(paper.authors || paper.year) && (
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {paper.authors && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>👤</span> {paper.authors}
                </span>
              )}
              {paper.authors && paper.year && (
                <span style={{ color: "var(--border)" }}>•</span>
              )}
              {paper.year && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>📅</span> {paper.year}
                </span>
              )}
            </div>
          )}

          {renderKeywords()}
        </div>

        {/* Top-right Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {paper.fileUrl && (
            <>
              <a
                href={paper.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                <span>📄</span> Open PDF
              </a>

              <button
                onClick={handleAutofillClick}
                disabled={isGenerating}
                className="btn"
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
                  color: "white",
                  border: "none",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  opacity: isGenerating ? 0.7 : 1,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: "0 2px 4px rgba(124, 58, 237, 0.15)",
                }}
              >
                {isGenerating ? "Generating..." : (
                  <>
                    <span>✨</span> AI Autofill
                  </>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => onEdit(paper)}
            className="btn btn-secondary"
            style={{
              padding: "6px 12px",
              fontSize: 13,
            }}
          >
            <span>✏️</span> Edit
          </button>

          <button
            onClick={() => onDelete(paper._id)}
            className="btn btn-danger"
            style={{
              padding: "6px 12px",
              fontSize: 13,
            }}
          >
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>

      {/* Expanded Survey Details */}
      {isExpanded && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {paper.summary && (
            <div style={{ background: "var(--bg)", padding: 14, borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--primary)", marginBottom: 4 }}>
                Abstract & Summary
              </div>
              <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>
                {paper.summary}
              </p>
            </div>
          )}

          {(paper.methodology || paper.advantages || paper.disadvantages || paper.limitations || paper.futureScope) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {paper.methodology && (
                <div style={{ border: "1px solid var(--border)", padding: 12, borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                    🔬 Methodology
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{paper.methodology}</div>
                </div>
              )}

              {(paper.advantages || paper.disadvantages) && (
                <div style={{ border: "1px solid var(--border)", padding: 12, borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>
                    🎯 Key Findings
                  </div>
                  {paper.advantages && (
                    <div style={{ fontSize: 13, color: "#16a34a", marginBottom: 4 }}>
                      <strong>Pros:</strong> {paper.advantages}
                    </div>
                  )}
                  {paper.disadvantages && (
                    <div style={{ fontSize: 13, color: "var(--danger)" }}>
                      <strong>Cons:</strong> {paper.disadvantages}
                    </div>
                  )}
                </div>
              )}

              {(paper.limitations || paper.futureScope) && (
                <div style={{ border: "1px solid var(--border)", padding: 12, borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>
                    💡 Scope & Limitations
                  </div>
                  {paper.limitations && (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                      <strong>Limits:</strong> {paper.limitations}
                    </div>
                  )}
                  {paper.futureScope && (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      <strong>Future:</strong> {paper.futureScope}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      {(paper.summary || paper.keywords?.length || paper.methodology || paper.advantages || paper.disadvantages || paper.limitations || paper.futureScope) && (
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={onToggleExpand}
            style={{
              border: "none",
              background: "none",
              color: "var(--primary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
          >
            {isExpanded ? "See less ▲" : "See survey details ▼"}
          </button>
        </div>
      )}
    </li>
  );
}

export default PaperCard;
