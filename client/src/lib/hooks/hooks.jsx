import { Suspense, useContext } from "react";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "@/pages/404";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export function useRoutesWith404(routes) {
  // Add the routes that are not private
  const excludedPaths = ["/login", "/", "/register","/sample"];
  const routeResult = useRoutes(routes);
  let { user } = useContext(AuthContext);

  const RouteRender = (user) => {
    if (routeResult) {
      if (!user && !excludedPaths.includes(routeResult.props.match.pathname)) {
        console.log(routeResult.props.match.pathname, "here");
        return <Navigate to="/login" replace={true} />;
      } else {
        console.log(routeResult.props.match.pathname, "there");
        return routeResult;
      }
    } else {
      return (
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  };

  return <Suspense fallback={<p>Loading...</p>}>{RouteRender(user)}</Suspense>;
}

export function useAxios() {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    
    if (!isExpired) {
      console.log("token was not expired!");
      return req;
    }
    console.log("token was expired!");

    const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("authTokens", JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
}
