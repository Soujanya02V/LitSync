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
        padding: "0 24px",
        height: 56,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#0f172a",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        LitSync
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt=""
            referrerPolicy="no-referrer"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e5e7eb",
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f1f5f9",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
            }}
            aria-hidden
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#334155",
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </span>

        <button
          type="button"
          onClick={() => void signOut(auth)}
          style={{
            marginLeft: 4,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: "#334155",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
