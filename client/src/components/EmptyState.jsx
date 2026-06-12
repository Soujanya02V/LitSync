function EmptyState({ title, subtitle, icon }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "56px 32px",
        margin: "24px 0",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        border: "2px dashed var(--border)",
        boxShadow: "var(--shadow-sm)",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        boxSizing: "border-box",
      }}
    >
      {icon ? (
        <div
          style={{
            fontSize: 36,
            lineHeight: 1,
            marginBottom: 20,
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
          }}
          aria-hidden
        >
          {icon}
        </div>
      ) : null}

      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      {subtitle ? (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default EmptyState;
