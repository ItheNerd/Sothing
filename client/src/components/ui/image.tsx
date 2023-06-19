import React from "react";

interface Props {
  src: string;
  width: number;
  height: number;
  alt: string;
  className: string;
}

const Image: React.FC<Props> = ({ src, width, height, alt, className }) => {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
