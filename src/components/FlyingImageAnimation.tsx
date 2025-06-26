
import React, { useEffect, useState } from 'react';

interface FlyingImageAnimationProps {
  imageUrl: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isVisible: boolean;
  onComplete: () => void;
  onReachTarget?: () => void;
  duration?: number;
  targetImageSize?: { width: number; height: number };
}

const FlyingImageAnimation: React.FC<FlyingImageAnimationProps> = ({
  imageUrl,
  startPosition,
  endPosition,
  isVisible,
  onComplete,
  onReachTarget,
  duration = 600,
  targetImageSize = { width: 300, height: 400 }
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation start
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // Notify when target is reached
      const reachTargetTimer = onReachTarget ? setTimeout(() => {
        onReachTarget();
      }, duration - 50) : null;

      // Complete animation after duration
      const completeTimer = setTimeout(() => {
        onComplete();
        setIsAnimating(false);
      }, duration + 100);

      return () => {
        clearTimeout(startTimer);
        if (reachTargetTimer) clearTimeout(reachTargetTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, duration, onComplete, onReachTarget]);

  if (!isVisible) return null;

  // Original image size on canvas
  const originalSize = { width: 248, height: 331 };
  
  // Calculate scale factor to match target size with higher precision
  const scaleX = targetImageSize.width / originalSize.width;
  const scaleY = targetImageSize.height / originalSize.height;
  const scale = Math.min(scaleX, scaleY);
  
  // Calculate final scaled dimensions
  const finalWidth = originalSize.width * scale;
  const finalHeight = originalSize.height * scale;
  
  // More precise positioning calculations
  const startX = Math.round(startPosition.x - originalSize.width / 2);
  const startY = Math.round(startPosition.y - originalSize.height / 2);
  
  const endX = Math.round(endPosition.x - finalWidth / 2);
  const endY = Math.round(endPosition.y - finalHeight / 2);

  console.log('Flying animation precise calculations:', {
    originalSize,
    targetImageSize,
    scale,
    finalSize: { width: finalWidth, height: finalHeight },
    positions: {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      translation: { x: endX - startX, y: endY - startY }
    }
  });

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: startX,
        top: startY,
        width: `${originalSize.width}px`,
        height: `${originalSize.height}px`,
        transform: isAnimating 
          ? `translate(${endX - startX}px, ${endY - startY}px) scale(${scale})`
          : `translate(0px, 0px) scale(1)`,
        transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transformOrigin: 'center center'
      }}
    >
      <img 
        src={imageUrl} 
        alt="Flying animation" 
        className="w-full h-full object-cover rounded-xl shadow-lg"
        draggable={false}
      />
    </div>
  );
};

export default FlyingImageAnimation;
