import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("accessToken")
      ? jwt_decode(localStorage.getItem("accessToken")).firstname
      : null
  );
  const [userInfo, setUserInfo] = useState(() =>
    localStorage.getItem("accessToken")
      ? jwt_decode(localStorage.getItem("accessToken"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseURL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: e.target.name.value,
        password: e.target.password.value,
        email: e.target.email.value,
      }),
    });

    let data = await response.json();
    if (response.status === 201) {
      toast.success("Registration Succesful", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAccessToken(data.accessToken);
      setUser(jwt_decode(data.accessToken).firstname);
      setUserInfo(jwt_decode(data.accessToken));
      localStorage.setItem("accessToken", data.accessToken);
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error(data.msg, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseURL}/api/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      toast.success("Login Succesful", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAccessToken(data.accessToken);
      setUser(jwt_decode(data.accessToken).firstname);
      setUserInfo(jwt_decode(data.accessToken));
      localStorage.setItem("accessToken", data.accessToken);
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error("Incorrect Credentials", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let logoutUser = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  let contextData = {
    user: user,
    userInfo: userInfo,
    accessToken: accessToken,
    setAccessToken: setAccessToken,
    setUser: setUser,
    setUserInfo: setUserInfo,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      setUser(jwt_decode(localStorage.getItem("accessToken")).firstname);
      setUserInfo(jwt_decode(localStorage.getItem("accessToken")));
      console.log("this", accessToken);
    }
    setLoading(false);
  }, [accessToken, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
