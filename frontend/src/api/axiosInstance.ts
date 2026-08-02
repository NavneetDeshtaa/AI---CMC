import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { tokenStorage } from "../lib/tokenStorage";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      window.location.href = "/login";
    }
     throw error     // can also use ->return Promise.reject(error);   (same thing)
  }
);

export default axiosInstance;