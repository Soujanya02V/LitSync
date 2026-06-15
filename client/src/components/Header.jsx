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
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(37, 99, 235, 0.1)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerLogoDocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2563EB" />
                  <stop offset="100%" stop-color="#7C3AED" />
                </linearGradient>
                <linearGradient id="headerLogoAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFFFFF" />
                  <stop offset="100%" stop-color="#E0F2FE" />
                </linearGradient>
              </defs>
              <path d="M 128 80 C 128 57.9 145.9 40 168 40 H 296 L 384 128 V 432 C 384 454.1 366.1 472 344 472 H 168 C 145.9 472 128 454.1 128 432 V 80 Z" fill="url(#headerLogoDocGrad)"/>
              <path d="M 296 40 V 104 C 296 117.3 306.7 128 320 128 H 384 L 296 40 Z" fill="#FFFFFF" fill-opacity="0.2" />
              <path d="M 256 150 C 256 208.5 297.5 250 356 250 C 297.5 250 256 291.5 256 350 C 256 291.5 214.5 250 156 250 C 214.5 250 256 208.5 256 150 Z" fill="url(#headerLogoAiGrad)"/>
            </svg>
          </div>
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
