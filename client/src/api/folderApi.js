import axios from "axios";

export async function createFolder(name, baseURL = "http://localhost:5000") {
  const api = axios.create({ baseURL });
  const res = await api.post("/folders", { name });
  return res.data;
}

export async function getFolders(baseURL = "http://localhost:5000") {
  const api = axios.create({ baseURL });
  const res = await api.get("/folders");
  return res.data;
}

