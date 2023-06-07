import { useEffect, useState } from "react";

function Index() {
  const [message, setMessage] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    fetch(`${baseURL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default Index;
