import React from "react";

type HeaderProps = {
  title: string;
  description: string;
};

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <header>
      <h2 className="text-xl text-gray-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-gray-500">{description}</p>
    </header>
  );
};

export default Header;
