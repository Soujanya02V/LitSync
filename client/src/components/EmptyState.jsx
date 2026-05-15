function EmptyState({ title, subtitle, icon }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        margin: "24px 0",
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px dashed #e2e8f0",
      }}
    >
      {icon ? (
        <div
          style={{
            fontSize: 40,
            lineHeight: 1,
            marginBottom: 16,
          }}
          aria-hidden
        >
          {icon}
        </div>
      ) : null}

      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: "#1e293b",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          style={{
            margin: "8px 0 0",
            maxWidth: 320,
            fontSize: 14,
            lineHeight: 1.5,
            color: "#64748b",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default EmptyState;
