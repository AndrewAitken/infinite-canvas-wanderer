
import React, { useEffect, useState } from 'react';

interface FlyingImageAnimationProps {
  imageUrl: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isVisible: boolean;
  onComplete: () => void;
  duration?: number;
  isReverse?: boolean;
}

const FlyingImageAnimation: React.FC<FlyingImageAnimationProps> = ({
  imageUrl,
  startPosition,
  endPosition,
  isVisible,
  onComplete,
  duration = 800,
  isReverse = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation start
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // Complete animation after duration
      const completeTimer = setTimeout(() => {
        onComplete();
        setIsAnimating(false);
      }, duration + 100);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  const fromPos = isReverse ? endPosition : startPosition;
  const toPos = isReverse ? startPosition : endPosition;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: fromPos.x - 124, // Center the 248px wide image
        top: fromPos.y - 165.5, // Center the 331px tall image
        transform: isAnimating 
          ? `translate(${toPos.x - fromPos.x}px, ${toPos.y - fromPos.y}px) scale(${isReverse ? 1 : 0.8})`
          : `translate(0px, 0px) scale(1)`,
        transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        width: '248px',
        height: '331px'
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
