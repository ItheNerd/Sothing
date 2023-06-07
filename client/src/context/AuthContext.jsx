import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? localStorage.getItem("authTokens")
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens")).name
      : null
  );
  let [userInfo, setUserInfo] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseURL}/api/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.target.name.value,
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
      setAuthTokens(data.token);
      setUser(jwt_decode(data.token).name);
      setUserInfo(jwt_decode(data.token));
      localStorage.setItem("authTokens", data.token);
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
      setAuthTokens(data.token);
      setUser(jwt_decode(data.token).name);
      setUserInfo(jwt_decode(data.token));
      localStorage.setItem("authTokens", data.token);
      setTimeout(() => navigate("/"), 1000);
    } else {
      console.log("yup, not there!");
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
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  let contextData = {
    user: user,
    userInfo: userInfo,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    setUserInfo: setUserInfo,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens).name);
      setUserInfo(jwt_decode(authTokens));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
