// src/services/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api`,
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  let token: string | null = null;

  if (user) {
    token = await user.getIdToken();
  } else {
    token = localStorage.getItem("token");
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
