import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutesWith404 as useRoutes } from "@/lib/hooks/useRoutes";
import routes from "~react-pages";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartSheetProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const App: React.FC = () => {
  const element = useRoutes(routes);
  return <>{element}</>;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartSheetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </CartSheetProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
