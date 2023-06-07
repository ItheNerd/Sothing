import { useState, useEffect } from 'react';

function Image({ src, alt, fallbackSrc, width, height }) {
  const [imageSrc, setImageSrc] = useState(fallbackSrc || '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;

    const handleImageLoad = () => {
      setIsVisible(true);
      setImageSrc(src);
    };

    image.addEventListener('load', handleImageLoad);

    return () => {
      image.removeEventListener('load', handleImageLoad);
    };
  }, [src]);

  return (
    <div style={{ width, height }}>
      {isVisible ? (
        <img src={imageSrc} alt={alt} width={width} height={height} />
      ) : (
        <img src={fallbackSrc} alt={alt} width={width} height={height} />
      )}
    </div>
  );
}

export default Image