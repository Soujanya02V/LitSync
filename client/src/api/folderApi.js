import axios from "axios";

function defaultBaseURL() {
  return import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";
}

export async function createFolder(name, createdBy, baseURL = defaultBaseURL()) {
  const api = axios.create({ baseURL });
  const res = await api.post("/folders", { name, createdBy });
  return res.data;
}

export async function getFolders(createdBy, baseURL = defaultBaseURL()) {
  const api = axios.create({ baseURL });
  const res = await api.get("/folders", { params: { createdBy } });
  return res.data;
}

export async function deleteFolder(folderId, baseURL = "http://localhost:5000") {
  const api = axios.create({ baseURL });
  const res = await api.delete(`/folders/${folderId}`);
  return res.data;
}

