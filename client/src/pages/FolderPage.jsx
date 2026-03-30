import { useNavigate, useParams } from "react-router-dom";

function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: "8px 12px",
        }}
      >
        Home
      </button>
      <h1>Folder Page</h1>
      <p>Folder ID: {id}</p>

      <p>No papers yet 🚀</p>
    </div>
  );
}

export default FolderPage;