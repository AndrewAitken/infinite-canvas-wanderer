
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
  phase: 'flying-to-panel' | 'showing-in-panel' | 'completed';
}

export const useFlyingAnimation = () => {
  const [animationState, setAnimationState] = useState<FlyingAnimationState>({
    isActive: false,
    imageUrl: '',
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
    phase: 'completed'
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  const startFlyingAnimation = useCallback((
    imageUrl: string,
    startPos: Position,
    endPos: Position
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
      phase: 'flying-to-panel'
    });
  }, []);

  const setAnimationPhase = useCallback((phase: FlyingAnimationState['phase']) => {
    setAnimationState(prev => ({
      ...prev,
      phase
    }));
  }, []);

  const stopFlyingAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      isActive: false,
      phase: 'completed'
    }));
  }, []);

  return {
    animationState,
    startFlyingAnimation,
    setAnimationPhase,
    stopFlyingAnimation
  };
};
