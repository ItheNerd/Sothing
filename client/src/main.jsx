import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutesWith404 } from "@/lib/hooks/hooks";
import routes from "~react-pages";
import { AuthProvider } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";

const App = () => {
  const [first, setfirst] = useState("");
  useEffect(() => {
    setfirst("Hi there welcome!");
  }, [first]);

  console.log(first); // This will log the updated value of `first`.

  const element = useRoutesWith404(routes);
  return <div className="bg-base-100">{element}</div>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
