import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutesWith404 as useRoutes } from "@/lib/hooks/useRoutes";
import routes from "~react-pages";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CartSheetProvider } from "./context/CartContext";
import CartPanel from "./components/products/cartPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const App: React.FC = () => {
  const element = useRoutes(routes);
  return (
    <>
      <section>{element}</section> <Toaster />
      <CartPanel />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartSheetProvider>
            <App />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </CartSheetProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
