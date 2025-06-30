
import React, { useState, useEffect, useRef } from 'react';
import { imagePreloader } from '../utils/imagePreloader';
import SkeletonLoader from './SkeletonLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  draggable?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  onLoad,
  onError,
  priority = false,
  draggable = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Check if image is already cached
        const cachedImg = imagePreloader.getCachedImage(src);
        if (cachedImg) {
          setImageSrc(src);
          setIsLoading(false);
          onLoad?.();
          return;
        }

        // Preload the image
        await imagePreloader.preloadImage(src);
        setImageSrc(src);
        setIsLoading(false);
        onLoad?.();
      } catch (error) {
        console.warn(`Failed to load image: ${src}`, error);
        
        // Retry logic with exponential backoff
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
        } else {
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    };

    loadImage();
  }, [src, retryCount, onLoad, onError]);

  if (isLoading) {
    return <SkeletonLoader width={width} height={height} className={className} />;
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-600">
          <div className="text-2xl mb-2">🎵</div>
          <div className="text-sm">RFD</div>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} object-cover`}
      style={{ width, height }}
      draggable={draggable}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default OptimizedImage;
