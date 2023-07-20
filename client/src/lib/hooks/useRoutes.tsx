import { Suspense, useContext } from "react";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "@/pages/404";
import AuthContext from "@/context/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function useRoutesWith404(routes: any) {
  // Add the routes that are not private
  const excludedPaths = ["/", "/products", "/auth"];
  const routeResult = useRoutes(routes);
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

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="flex h-screen items-center justify-center">
              <Alert
                variant="destructive"
                className="flex max-w-lg items-center justify-between align-middle">
                <Terminal className="h-4 w-4" />
                <div>
                  <AlertTitle>There was an error!</AlertTitle>
                  <AlertDescription className="font-mono">
                    {error.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => resetErrorBoundary()}>
                  Try again
                </Button>
              </Alert>
            </div>
          )}>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <span className="loading loading-dots loading-lg" />
              </div>
            }>
            {RouteRender()}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
