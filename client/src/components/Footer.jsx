import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

// Professional developer connection links placeholder constants
export const DEVELOPER_LINKS = {
  github: "https://github.com/Soujanya02V",
  linkedin: "https://www.linkedin.com/in/soujanya-maharudra-896920291/",
  email: "mailto:soujanyabailawad@gmail.com",
};

function Footer({ style }) {
  return (
    <footer
      style={{
        padding: "24px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        color: "var(--text-secondary)",
        fontSize: 13,
        fontWeight: 500,
        borderTop: "1px solid var(--border)",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "var(--surface)",
        ...style,
      }}
    >
      <div style={{ lineHeight: 1.5 }}>
        © 2026 LitSync • AI-Powered Literature Review Assistant
      </div>
      <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.5 }}>
        Developed by Soujanya Maharudra
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 6,
        }}
      >
        <a
          href={DEVELOPER_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Profile"
          style={{
            color: "var(--text-secondary)",
            transition: "color 0.2s ease, transform 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaGithub size={18} />
        </a>
        <a
          href={DEVELOPER_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn Profile"
          style={{
            color: "var(--text-secondary)",
            transition: "color 0.2s ease, transform 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaLinkedin size={18} />
        </a>
        <a
          href={DEVELOPER_LINKS.email}
          title="Send Email"
          style={{
            color: "var(--text-secondary)",
            transition: "color 0.2s ease, transform 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaEnvelope size={18} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
