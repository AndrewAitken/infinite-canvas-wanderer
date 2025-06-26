
import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const updateMousePosition = (e: MouseEvent) => {
      // Cancel previous frame if it exists
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    // Add event listener
    window.addEventListener('mousemove', updateMousePosition);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return mousePosition;
};
