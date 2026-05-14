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
        justifyContent: "center",
        gap: 16,
      }}
    >
      <h1 style={{ margin: 0 }}>Login</h1>
      <button type="button" onClick={() => void handleGoogleLogin()}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
