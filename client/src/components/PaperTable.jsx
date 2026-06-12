import { useRef, useState, useEffect } from "react";

function paperRowKey(paper, index) {
  return paper._id != null ? String(paper._id) : `paper-${index}`;
}

function PaperTable({
  papers,
  isEditingTable,
  tableEdits,
  onTableFieldChange,
  onBack,
  onExportPdf,
  onEditTableClick,
}) {
  const tbodyRef = useRef(null);
  const [renderedRowsCount, setRenderedRowsCount] = useState(0);

  useEffect(() => {
    if (tbodyRef.current) {
      setRenderedRowsCount(tbodyRef.current.querySelectorAll("tr").length);
    }
  }, [papers]);

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: "8px 14px", fontSize: 13 }}
        >
          <span>←</span> Back to Papers
        </button>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={onExportPdf}
            className="btn btn-secondary"
            style={{ padding: "10px 16px", fontSize: 14 }}
          >
            <span>📄</span> Export PDF Report
          </button>

          <button
            type="button"
            onClick={onEditTableClick}
            className={isEditingTable ? "btn btn-accent" : "btn btn-primary"}
            style={{ padding: "10px 22px", fontSize: 14 }}
          >
            {isEditingTable ? "💾 Save Changes" : "✏️ Edit Table"}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 20, fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
        <div>Papers in folder: {papers.length}</div>
        <div>Rows rendered: {renderedRowsCount}</div>
      </div>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          background: "var(--surface)",
        }}
      >
        <table className="survey-table">
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>Title</th>
              <th style={{ minWidth: 80 }}>Year</th>
              <th style={{ minWidth: 220 }}>Methodology</th>
              <th style={{ minWidth: 220 }}>Advantages</th>
              <th style={{ minWidth: 220 }}>Disadvantages</th>
              <th style={{ minWidth: 220 }}>Limitations</th>
              <th style={{ minWidth: 220 }}>Future Scope</th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {papers.map((paper, index) => (
              <tr key={paperRowKey(paper, index)}>
                <td style={{ fontWeight: 600 }}>{paper.title || ""}</td>
                <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{paper.year || ""}</td>
                <td>
                  {isEditingTable ? (
                    <textarea
                      rows={3}
                      value={tableEdits[paper._id]?.methodology ?? (paper.methodology || "")}
                      onChange={(e) => onTableFieldChange(paper._id, "methodology", e.target.value)}
                    />
                  ) : (
                    paper.methodology || <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: 13 }}>Not specified</span>
                  )}
                </td>
                <td>
                  {isEditingTable ? (
                    <textarea
                      rows={3}
                      value={tableEdits[paper._id]?.advantages ?? (paper.advantages || "")}
                      onChange={(e) => onTableFieldChange(paper._id, "advantages", e.target.value)}
                    />
                  ) : (
                    paper.advantages || <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: 13 }}>Not specified</span>
                  )}
                </td>
                <td>
                  {isEditingTable ? (
                    <textarea
                      rows={3}
                      value={tableEdits[paper._id]?.disadvantages ?? (paper.disadvantages || "")}
                      onChange={(e) => onTableFieldChange(paper._id, "disadvantages", e.target.value)}
                    />
                  ) : (
                    paper.disadvantages || <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: 13 }}>Not specified</span>
                  )}
                </td>
                <td>
                  {isEditingTable ? (
                    <textarea
                      rows={3}
                      value={tableEdits[paper._id]?.limitations ?? (paper.limitations || "")}
                      onChange={(e) => onTableFieldChange(paper._id, "limitations", e.target.value)}
                    />
                  ) : (
                    paper.limitations || <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: 13 }}>Not specified</span>
                  )}
                </td>
                <td>
                  {isEditingTable ? (
                    <textarea
                      rows={3}
                      value={tableEdits[paper._id]?.futureScope ?? (paper.futureScope || "")}
                      onChange={(e) => onTableFieldChange(paper._id, "futureScope", e.target.value)}
                    />
                  ) : (
                    paper.futureScope || <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: 13 }}>Not specified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaperTable;
