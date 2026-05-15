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
  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={onBack}
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
                      onChange={(e) => onTableFieldChange(paper._id, "methodology", e.target.value)}
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
                      onChange={(e) => onTableFieldChange(paper._id, "advantages", e.target.value)}
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
                      onChange={(e) => onTableFieldChange(paper._id, "disadvantages", e.target.value)}
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
                      onChange={(e) => onTableFieldChange(paper._id, "limitations", e.target.value)}
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
                      onChange={(e) => onTableFieldChange(paper._id, "futureScope", e.target.value)}
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
          onClick={onExportPdf}
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
          onClick={onEditTableClick}
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
  );
}

export default PaperTable;
