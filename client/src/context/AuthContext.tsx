import { createContext, useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  loginSchema,
  registerSchema,
  userSchema,
} from "@/lib/schemas/authSchemas";
import { authAPI } from "@/lib/api/authAPI";
import { z } from "zod";
import axiosAuthInstance from "@/lib/api/authAPI";

type User = z.infer<typeof userSchema>;

export type RegisterTypes = z.infer<typeof registerSchema>;

export type LoginTypes = z.infer<typeof loginSchema>;

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  registerUser: (req: RegisterTypes) => Promise<void>;
  loginUser: (req: LoginTypes) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState<User | null>(() =>
    accessToken ? jwt_decode<User>(accessToken) : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  const registerUser = async (req: RegisterTypes) => {
    try {
      const response = await authAPI.signup(req);

      let { _id, firstname, lastname, email, accessToken } = userSchema.parse(
        response.data
      );

      const updatedLastname = lastname || "";

      toast({
        variant: "default",
        title: "Registration Successful!",
        description: "Redirecting to the home page...",
      });

      setAccessToken(accessToken);
      setUser({
        _id,
        firstname,
        lastname: updatedLastname,
        email,
        accessToken,
      });
      localStorage.setItem("accessToken", accessToken);

      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${error.response.data.message}`,
        action: (
          <ToastAction altText="Try again" onClick={() => navigate(0)}>
            Try again
          </ToastAction>
        ),
      });
      setTimeout(() => navigate(0), 1000);
      console.log(error);
    }
  };

  const loginUser = async (req: LoginTypes) => {
    try {
      const response = await authAPI.login(req);

      const { _id, firstname, lastname, email, accessToken } = userSchema.parse(
        response.data
      );

      const updatedLastname = lastname || "";

      toast({
        variant: "default",
        title: "Login Successful!",
        description: "Redirecting to the home page...",
      });

      setAccessToken(accessToken);
      setUser({
        _id,
        firstname,
        lastname: updatedLastname,
        email,
        accessToken,
      });
      localStorage.setItem("accessToken", accessToken);

      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${error.response.data.message}`,
        action: (
          <ToastAction altText="Try again" onClick={() => navigate(0)}>
            Try again
          </ToastAction>
        ),
      });
      setTimeout(() => navigate(0), 1000);
      console.log(error);
    }
  };

  const logoutUser = async () => {
    try {
      if (!user) {
        throw new Error("Not logged in");
      }
      await authAPI.logout();
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      axiosAuthInstance.defaults.headers["Authorization"] = "";
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 500 || error.response?.status === 401) {
        try {
          const response = await authAPI.refreshToken();
          const newAccessToken = response.data.newAccessToken;
          setAccessToken(newAccessToken);
          axiosAuthInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          await authAPI.logout();
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem("accessToken");
          navigate("/");
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: `${error.response.data.message}`,
            action: (
              <ToastAction altText="Try again" onClick={() => logoutUser()}>
                Try again
              </ToastAction>
            ),
          });
        }
      } else {
        console.log(error.message);
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const newAccessToken = response.data.newAccessToken;

      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      axiosAuthInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      setUser(jwt_decode<User>(localStorage.getItem("accessToken") || ""));
    }
    setLoading(false);
  }, [accessToken]);

  const contextData: AuthContextType = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return authContext;
};
