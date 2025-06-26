
import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface FlyingAnimationState {
  isActive: boolean;
  imageUrl: string;
  startPosition: Position;
  endPosition: Position;
  isReverse: boolean;
}

export const useFlyingAnimation = () => {
  const [animationState, setAnimationState] = useState<FlyingAnimationState>({
    isActive: false,
    imageUrl: '',
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
    isReverse: false
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  const startFlyingAnimation = useCallback((
    imageUrl: string,
    startPos: Position,
    endPos: Position,
    isReverse: boolean = false
  ) => {
    // Clear any existing animation
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setAnimationState({
      isActive: true,
      imageUrl,
      startPosition: startPos,
      endPosition: endPos,
      isReverse
    });
  }, []);

  const stopFlyingAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  return {
    animationState,
    startFlyingAnimation,
    stopFlyingAnimation
  };
};
