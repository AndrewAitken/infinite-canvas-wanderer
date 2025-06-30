
import { useState, useRef, useCallback, useEffect } from 'react';

interface AutoScrollConfig {
  speedX: number; // пикселей в секунду
  speedY: number; // пикселей в секунду
  enabled: boolean;
}

interface AutoScrollState {
  offset: { x: number; y: number };
  isAutoScrolling: boolean;
  pauseAutoScroll: () => void;
  resumeAutoScroll: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useAutoScroll = (config: AutoScrollConfig): AutoScrollState => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isAutoScrolling, setIsAutoScrolling] = useState(config.enabled);
  const [isPaused, setIsPaused] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback((currentTime: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
      startTimeRef.current = currentTime;
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000; // в секундах
    lastTimeRef.current = currentTime;

    if (isAutoScrolling && !isPaused && config.enabled) {
      setOffset(prev => ({
        x: prev.x + config.speedX * deltaTime,
        y: prev.y + config.speedY * deltaTime
      }));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isAutoScrolling, isPaused, config.enabled, config.speedX, config.speedY]);

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAutoScroll = useCallback(() => {
    setIsPaused(false);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    setIsAutoScrolling(enabled);
    if (!enabled) {
      setIsPaused(false);
    }
  }, []);

  useEffect(() => {
    if (config.enabled) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, config.enabled]);

  // Сброс времени при изменении состояния
  useEffect(() => {
    lastTimeRef.current = 0;
  }, [isAutoScrolling, isPaused]);

  return {
    offset,
    isAutoScrolling: isAutoScrolling && !isPaused,
    pauseAutoScroll,
    resumeAutoScroll,
    setEnabled,
  };
};
