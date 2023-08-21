import { useContext } from "react";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "@/pages/404";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import CartPanel from "@/components/products/cartPanel";
import { QueryAsyncBoundary } from "@suspensive/react-query";

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
    <QueryAsyncBoundary
      pendingFallback={
        <div className="flex h-screen items-center justify-center">
          <span className="loading loading-spinner loading-md" />
        </div>
      }
      rejectedFallback={(boundary) => (
        <div className="flex h-screen items-center justify-center">
          <Alert
            variant="destructive"
            className="flex max-w-lg items-center justify-between align-middle">
            <Terminal className="h-4 w-4" />
            <div>
              <AlertTitle>There was an error!</AlertTitle>
              <AlertDescription className="font-mono">
                {boundary.error.message}
              </AlertDescription>
            </div>
            <Button variant="destructive" onClick={boundary.reset}>
              Try again
            </Button>
          </Alert>
        </div>
      )}>
      {RouteRender()} <CartPanel />
      <Toaster />
    </QueryAsyncBoundary>
  );
}
