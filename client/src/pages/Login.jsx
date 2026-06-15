import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "radial-gradient(circle at 50% 50%, var(--accent-light) 0%, var(--bg) 100%)",
        padding: "40px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Top spacer to center card vertically relative to the footer */}
      <div style={{ flex: 1 }} />

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          margin: "24px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-md)",
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(37, 99, 235, 0.15)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="loginLogoDocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2563EB" />
                  <stop offset="100%" stop-color="#7C3AED" />
                </linearGradient>
                <linearGradient id="loginLogoAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFFFFF" />
                  <stop offset="100%" stop-color="#E0F2FE" />
                </linearGradient>
              </defs>
              <path d="M 128 80 C 128 57.9 145.9 40 168 40 H 296 L 384 128 V 432 C 384 454.1 366.1 472 344 472 H 168 C 145.9 472 128 454.1 128 432 V 80 Z" fill="url(#loginLogoDocGrad)"/>
              <path d="M 296 40 V 104 C 296 117.3 306.7 128 320 128 H 384 L 296 40 Z" fill="#FFFFFF" fill-opacity="0.2" />
              <path d="M 256 150 C 256 208.5 297.5 250 356 250 C 297.5 250 256 291.5 256 350 C 256 291.5 214.5 250 156 250 C 214.5 250 256 208.5 256 150 Z" fill="url(#loginLogoAiGrad)"/>
            </svg>
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            LitSync
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            AI-Powered Research Workspace
          </p>
        </div>

        <div style={{ height: 1, width: "100%", backgroundColor: "var(--border)" }} />

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Sign in to organize your research literature, auto-extract paper survey metadata, and export structured summaries.
        </p>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, alignItems: "center" }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--primary)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginTop: 8
          }}>
            Organize. Analyze. Compare.
          </div>

          <button
            type="button"
            onClick={() => void handleGoogleLogin()}
            style={{
              width: "100%",
              padding: "12px 18px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.backgroundColor = "var(--bg)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "var(--surface)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.71C3.78409 10.17 3.68182 9.59727 3.68182 9C3.68182 8.40273 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--text-secondary)",
              margin: "8px 0 0 0",
              fontWeight: 400,
            }}
          >
            Transform research papers into structured insights with AI-powered literature review assistance.
          </p>
        </div>
      </div>

      {/* Bottom spacer to align card */}
      <div style={{ flex: 1 }} />

      {/* Login Footer */}
      <footer
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 500,
          borderTop: "1px solid var(--border)",
          width: "100%",
          maxWidth: 420,
          paddingTop: 16,
          boxSizing: "border-box",
        }}
      >
        <div>LitSync • AI-Powered Literature Review Assistant</div>
        <div style={{ fontSize: 11, opacity: 0.75 }}>
          Built for Researchers, Students, and Innovators
        </div>
      </footer>
    </div>
  );
}

export default Login;
