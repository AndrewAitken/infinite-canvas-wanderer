import { useState, useCallback, useRef, useEffect } from 'react';

interface DragState {
  offset: { x: number; y: number };
  isDragging: boolean;
  isMomentum: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  setExternalOffset: (offset: { x: number; y: number }) => void;
}

interface VelocityPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface DragOptions {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  externalOffset?: { x: number; y: number };
}

export const useDrag = (options: DragOptions = {}): DragState => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMomentum, setIsMomentum] = useState(false);
  
  const dragState = useRef({
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const velocityHistory = useRef<VelocityPoint[]>([]);
  const momentumAnimation = useRef<number | null>(null);

  // Комбинируем внешний offset (автоскролл) с offset от перетаскивания
  const combinedOffset = {
    x: dragOffset.x + (options.externalOffset?.x || 0),
    y: dragOffset.y + (options.externalOffset?.y || 0)
  };

  const clearMomentum = useCallback(() => {
    if (momentumAnimation.current) {
      cancelAnimationFrame(momentumAnimation.current);
      momentumAnimation.current = null;
    }
    setIsMomentum(false);
  }, []);

  const calculateVelocity = useCallback(() => {
    const now = Date.now();
    const recentPoints = velocityHistory.current.filter(
      point => now - point.timestamp < 150
    );
    
    if (recentPoints.length < 2) return { x: 0, y: 0 };
    
    const first = recentPoints[0];
    const last = recentPoints[recentPoints.length - 1];
    const timeDiff = last.timestamp - first.timestamp;
    
    if (timeDiff === 0) return { x: 0, y: 0 };
    
    return {
      x: (last.x - first.x) / timeDiff,
      y: (last.y - first.y) / timeDiff
    };
  }, []);

  const startMomentum = useCallback((velocity: { x: number; y: number }) => {
    const minVelocity = 0.1;
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (velocityMagnitude < minVelocity) {
      // Возобновляем автоскролл после окончания momentum
      options.onDragEnd?.();
      return;
    }
    
    setIsMomentum(true);
    let currentVelocity = { ...velocity };
    let currentDragOffset = { ...dragOffset };
    
    const animate = () => {
      const decay = 0.95;
      const minVelocityThreshold = 0.01;
      
      currentVelocity.x *= decay;
      currentVelocity.y *= decay;
      
      currentDragOffset.x += currentVelocity.x * 16; // ~60fps
      currentDragOffset.y += currentVelocity.y * 16;
      
      setDragOffset({ ...currentDragOffset });
      
      const velocityMagnitude = Math.sqrt(
        currentVelocity.x * currentVelocity.x + currentVelocity.y * currentVelocity.y
      );
      
      if (velocityMagnitude > minVelocityThreshold) {
        momentumAnimation.current = requestAnimationFrame(animate);
      } else {
        setIsMomentum(false);
        momentumAnimation.current = null;
        // Возобновляем автоскролл после окончания momentum
        options.onDragEnd?.();
      }
    };
    
    momentumAnimation.current = requestAnimationFrame(animate);
  }, [dragOffset, options]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    clearMomentum();
    setIsDragging(true);
    
    // Приостанавливаем автоскролл
    options.onDragStart?.();
    
    dragState.current.startX = clientX;
    dragState.current.startY = clientY;
    dragState.current.startOffsetX = dragOffset.x;
    dragState.current.startOffsetY = dragOffset.y;
    
    velocityHistory.current = [{
      x: clientX,
      y: clientY,
      timestamp: Date.now()
    }];
  }, [dragOffset, clearMomentum, options]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    
    const newX = dragState.current.startOffsetX + deltaX;
    const newY = dragState.current.startOffsetY + deltaY;

    setDragOffset({ x: newX, y: newY });
    
    // Update velocity history
    const now = Date.now();
    velocityHistory.current.push({
      x: clientX,
      y: clientY,
      timestamp: now
    });
    
    // Keep only recent points
    velocityHistory.current = velocityHistory.current.filter(
      point => now - point.timestamp < 200
    );
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const velocity = calculateVelocity();
    startMomentum(velocity);
    
    velocityHistory.current = [];
  }, [isDragging, calculateVelocity, startMomentum]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const setExternalOffset = useCallback((offset: { x: number; y: number }) => {
    // Эта функция может использоваться для сброса внешнего offset'а если нужно
  }, []);

  // ... keep existing code (useEffect для обработчиков событий мыши и touch)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMomentum();
    };
  }, [clearMomentum]);

  return {
    offset: combinedOffset,
    isDragging,
    isMomentum,
    handleMouseDown,
    handleTouchStart,
    setExternalOffset,
  };
};
