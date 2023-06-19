import Login from "@/components/login";
import Register from "@/components/register";
import { useState } from "react";

type Props = {};

const Auth = (props: Props) => {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  const handleToggle = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      {!isNewUser ? (
        <Login isNewUser={isNewUser} handleToggle={handleToggle} />
      ) : (
        <Register isNewUser={isNewUser} handleToggle={handleToggle} />
      )}
    </div>
  );
};

export default Auth;
