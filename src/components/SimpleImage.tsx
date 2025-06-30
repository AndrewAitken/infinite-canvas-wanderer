
import React, { useState, useRef, useEffect } from 'react';

interface SimpleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  draggable?: boolean;
}

const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  onLoad,
  onError,
  draggable = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setHasError(true);
    onError?.();
  };

  // Если есть ошибка загрузки, просто не показываем ничего
  if (hasError) {
    return null;
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`${className} object-cover transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ width, height }}
      draggable={draggable}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default SimpleImage;
