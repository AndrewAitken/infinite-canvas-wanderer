import { useEffect, useRef } from 'react';

interface UseImagePreloaderParams {
  src: string;
  priority?: boolean;
}

export const useImagePreloader = ({ src, priority = false }: UseImagePreloaderParams) => {
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!src) return;

    // Create new image element for preloading
    const img = new Image();
    imageRef.current = img;

    // Set loading priority
    if (priority) {
      img.loading = 'eager';
    } else {
      img.loading = 'lazy';
    }

    // Preload the image
    img.src = src;

    return () => {
      if (imageRef.current) {
        imageRef.current.src = '';
      }
    };
  }, [src, priority]);

  return imageRef.current;
};