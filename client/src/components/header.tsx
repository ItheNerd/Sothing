import React from "react";
import { Separator } from "./ui/separator";

type HeaderProps = {
  title: string;
  description: string;
};

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <>
      <header>
        <h2 className="text-xl sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-md text-muted-foreground">{description}</p>
      </header>
      <Separator className="my-6" />
    </>
  );
};

export default Header;
