import { useState, useEffect } from "react";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const baseURL: string =
  import.meta.env.VITE_API_SERVER_BASE_URL || "http://localhost:5000/api";

type ErrorResponse = {
  message: string;
};

type UseAxiosConfig = {
  subURL: string;
  headers?: Record<string, string>;
};

type UseAxiosResult = {
  api: AxiosInstance;
};

const useAxios = ({ subURL, headers }: UseAxiosConfig): UseAxiosResult => {
  const { accessToken, setAccessToken, setUser, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // appending subURL to baseURL
  const url = `${baseURL}/${subURL}`;

  const api = axios.create({
    baseURL: url,
    headers: {
      ...(headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest: AxiosRequestConfig | undefined = error.config;

      if (!originalRequest) {
        throw error;
      }
      if (
        error.response?.status === 401 ||
        (error.response?.status === 500 &&
          error.response.data.message === "jwt expired")
      ) {
        // Check if token refreshing is already in progress
        if (!isRefreshing) {
          setIsRefreshing(true);
          try {
            // Refresh the token
            const newAccessToken = await refreshToken();
            setIsRefreshing(false);
            // Update the original request's Authorization header with the new token
            api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
            // Retry the original request with the new token
            return api(originalRequest);
          } catch (refreshError) {
            setIsRefreshing(false);
            setAccessToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            api.defaults.headers["Authorization"] = "";
            throw refreshError;
          }
        } else {
          // Wait for token refreshing to complete and then retry the original request
          return new Promise((resolve, _) => {
            const intervalId = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(intervalId);
                resolve(api(originalRequest));
              }
            }, 1000);
          });
        }
      }

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response?.data.message || "Request failed.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    api.defaults.headers.common["Authorization"] = accessToken
      ? `Bearer ${accessToken}`
      : undefined;
  }, [accessToken, api]);

  return { api };
};

export default useAxios;
