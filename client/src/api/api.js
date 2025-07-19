import axios from "axios";

// FIX: Use a relative URL for deployment readiness.
// For local development, add this to your frontend's package.json:
// "proxy": "http://localhost:5001"
const API = axios.create({
  baseURL: "/api",
});

// This interceptor correctly adds the token to every request. No changes needed here.
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;