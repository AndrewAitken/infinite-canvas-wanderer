
import React, { useEffect, useState } from 'react';

interface FlyingImageAnimationProps {
  imageUrl: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isVisible: boolean;
  onComplete: () => void;
  onReachTarget?: () => void;
  duration?: number;
  isReverse?: boolean;
  targetImageSize?: { width: number; height: number };
}

const FlyingImageAnimation: React.FC<FlyingImageAnimationProps> = ({
  imageUrl,
  startPosition,
  endPosition,
  isVisible,
  onComplete,
  onReachTarget,
  duration = 800,
  isReverse = false,
  targetImageSize = { width: 300, height: 400 }
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation start
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // Notify when target is reached (for forward animation)
      const reachTargetTimer = !isReverse && onReachTarget ? setTimeout(() => {
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
  }, [isVisible, duration, onComplete, onReachTarget, isReverse]);

  if (!isVisible) return null;

  const fromPos = isReverse ? endPosition : startPosition;
  const toPos = isReverse ? startPosition : endPosition;

  // Calculate scale based on direction
  const startScale = isReverse ? 
    (targetImageSize.width / 248) : 1; // Start from target size when reverse
  const endScale = isReverse ? 
    1 : (targetImageSize.width / 248); // End at target size when forward

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: fromPos.x - 124, // Center the 248px wide image
        top: fromPos.y - 165.5, // Center the 331px tall image
        transform: isAnimating 
          ? `translate(${toPos.x - fromPos.x}px, ${toPos.y - fromPos.y}px) scale(${endScale})`
          : `translate(0px, 0px) scale(${startScale})`,
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
