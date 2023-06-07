import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutesWith404 } from "@/lib/hooks/hooks";
import routes from "~react-pages";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  const element = useRoutesWith404(routes);
  return <div className="bg-base-100">{element}</div>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </>
);
