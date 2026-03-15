import axios from "axios";

// Normalize the base URL to prevent accidental double "/api" when the env var includes it.
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = rawBaseUrl.replace(/\/api(\/.*)?$/, "");

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;