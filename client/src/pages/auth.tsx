import Login from "@/components/login";
import Register from "@/components/register";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams, _] = useSearchParams();
  const [isNewUser, setIsNewUser] = useState<boolean>(searchParams.get("t") === "signup");

  const handleToggle = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      {isNewUser ? (
        <Register isNewUser={isNewUser} handleToggle={handleToggle} />
      ) : (
        <Login isNewUser={isNewUser} handleToggle={handleToggle} />
      )}
    </div>
  );
};

export default Auth;
