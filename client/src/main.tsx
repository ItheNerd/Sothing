import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutesWith404 as useRoutes } from "@/lib/hooks/useRoutes";
import routes from "~react-pages";
import { AuthProvider } from "@/context/AuthContext";

const App: React.FC = () => {
  const element = useRoutes(routes);
  return <section>{element}</section>;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
