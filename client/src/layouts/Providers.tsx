import React from "react";

type Props = {
    children:React.ReactNode
};

const Providers = (props: Props) => {
  return <div>{children}</div>;
};

export default Providers;
