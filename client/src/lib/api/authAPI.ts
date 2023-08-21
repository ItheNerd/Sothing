import axios from "axios";
import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/authSchemas";
import { clearCookies } from "../utils";

export type RegisterTypes = z.infer<typeof registerSchema>;
export type LoginTypes = z.infer<typeof loginSchema>;

const baseURL = import.meta.env.VITE_API_SERVER_BASE_URL;

const axiosAuthInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosAuthInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken") || null;
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

const login = async (data: LoginTypes) => {
  return await axiosAuthInstance.post("/user/login", data);
};

const signup = async (data: RegisterTypes) => {
  return await axiosAuthInstance.post("/user/register", data);
};

const logout = async () => {
  try {
    // Make the API call to log out
    return await axiosAuthInstance.get("/user/logout");
  } catch (error) {
    // If the request returns an error, clear cookies and localStorage
    clearCookies();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("Error during logout:", error);
    throw error; // Re-throw the error so it can be handled by the calling code
  }
};

const refreshToken = async () => {
  try {
    return await axiosAuthInstance.put("/user/refresh");
  } catch (error) {
    // If the request returns an error, clear cookies and localStorage
    clearCookies();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("Error during logout:", error);
    throw error; // Re-throw the error so it can be handled by the calling code
  }
};

export default axiosAuthInstance;

export const authAPI = {
  login,
  signup,
  logout,
  refreshToken,
};
