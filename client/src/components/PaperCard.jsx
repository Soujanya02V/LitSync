function PaperCard({ paper, isExpanded, onToggleExpand, onEdit, onDelete }) {
  return (
    <li
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
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 17 }}>{paper.title}</div>

        {(paper.authors || paper.year) && (
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {paper.authors}
            {paper.authors && paper.year && " · "}
            {paper.year}
          </div>
        )}

        {isExpanded && (
          <div style={{ marginTop: 10 }}>
            {paper.summary && <p>{paper.summary}</p>}
            {paper.keywords && <p>{paper.keywords.join(", ")}</p>}
          </div>
        )}

        {(paper.summary || paper.keywords?.length) && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={onToggleExpand}
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

        <button onClick={() => onEdit(paper)}>Edit</button>

        <button onClick={() => onDelete(paper._id)}>Delete</button>
      </div>
    </li>
  );
}

export default PaperCard;
