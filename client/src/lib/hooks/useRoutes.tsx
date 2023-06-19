import { Suspense, useContext } from "react";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "@/pages/404";
import AuthContext from "@/context/AuthContext";

export function useRoutesWith404(routes) {
  // Add the routes that are not private
  const excludedPaths = ["/", "/auth", "/sample", "/search"];
  const routeResult = useRoutes(routes);
  let { user } = useContext(AuthContext);

  const RouteRender = (user) => {
    if (routeResult) {
      if (!user && !excludedPaths.includes(routeResult.props.match.pathname)) {
        return <Navigate to="/auth" replace={true} />;
      } else {
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
