import { Suspense, useContext, useEffect } from "react";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "@/pages/404";
import AuthContext from "@/context/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export function useRoutesWith404(routes: any) {
  // Add the routes that are not private
  const excludedPaths = ["/", "/products", "/auth"];
  const routeResult = useRoutes(routes);
  const { reset } = useQueryErrorResetBoundary();
  let { user } = useContext(AuthContext);

  const RouteRender = () => {
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

  function fallbackRender({ error, resetErrorBoundary }: any) {
    useEffect(() => {
      toast({
        title: "Uh oh! Something went wrong.(error boundry)",
        description: `${error.message}`,
        action: (
          <ToastAction altText="Try again" onClick={() => resetErrorBoundary()}>
            Try again
          </ToastAction>
        ),
      });
    }, []);

    return <></>;
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
      <Suspense fallback={<p>Loading...</p>}>{RouteRender()}</Suspense>
    </ErrorBoundary>
  );
}
