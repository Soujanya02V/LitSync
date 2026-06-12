import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/firebase";

function Header() {
  const { currentUser } = useAuth();

  const displayName =
    currentUser?.displayName || currentUser?.email || "User";
  const photoURL = currentUser?.photoURL;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "0 32px",
        height: 64,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          to="/"
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--primary)",
            textDecoration: "none",
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <span style={{ fontSize: 24 }}>🎓</span>
          LitSync
        </Link>
        <span
          style={{
            height: 16,
            width: 1,
            backgroundColor: "var(--border)",
            display: "inline-block"
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
            letterSpacing: "0.02em",
            textTransform: "uppercase"
          }}
        >
          Research Workspace
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {photoURL ? (
            <img
              src={photoURL}
              alt=""
              referrerPolicy="no-referrer"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                objectFit: "cover",
                border: "1.5px solid var(--border)",
              }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                background: "var(--accent-light)",
                border: "1.5px solid rgba(124, 58, 237, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
              }}
              aria-hidden
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => void signOut(auth)}
          className="btn btn-secondary"
          style={{
            padding: "6px 12px",
            fontSize: 13,
            borderRadius: "var(--radius-sm)",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
