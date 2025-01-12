import axios from "axios";

// Assuming you already have the authToken
const authToken = localStorage.getItem("authToken"); // Get token from localStorage or wherever it's stored

const apiClient = axios.create({
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json", // Add content-type header if necessary
  },
});

// Optionally, you can intercept requests to refresh the token or handle token expiration
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
