import React, { useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

interface ImageProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  fallback?: React.ReactNode;
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback,
  className,
  width,
  height,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const entry = useIntersectionObserver(imageRef, {});

  const isVisible = !!entry?.isIntersecting;
  console.log({ isVisible });
  return (
    <>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className={className}
          ref={imageRef}
          width={width}
          height={height}
        />
      ) : (
        fallback || <span className="loading loading-spinner loading-sm"></span>
      )}
    </>
  );
};

export default Image;
