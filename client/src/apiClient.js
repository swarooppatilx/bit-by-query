import axios from "axios";

const apiClient = axios.create({
  baseURL: "/",            // Adjust if your API base path differs
  withCredentials: true,      // IMPORTANT: sends cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
