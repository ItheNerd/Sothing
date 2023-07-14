import axios from "axios";
import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/authSchemas";

export type RegisterTypes = z.infer<typeof registerSchema>;
export type LoginTypes = z.infer<typeof loginSchema>;

const baseURL = import.meta.env.VITE_API_BASE_URL;

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

const login = (data: LoginTypes) => {
  return axiosAuthInstance.post("/user/login", data);
};

const signup = (data: RegisterTypes) => {
  return axiosAuthInstance.post("/user/register", data);
};

const logout = () => {
  return axiosAuthInstance.get("/user/logout");
};

export const refreshToken = () => {
  return axiosAuthInstance.put("/user/refresh");
};

export default axiosAuthInstance;

export const authAPI = {
  login,
  signup,
  logout,
  refreshToken,
};
