
import { useState, useCallback, useRef, useEffect } from 'react';

interface DragState {
  offset: { x: number; y: number };
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export const useDrag = (): DragState => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    momentum: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    lastTime: 0,
  });

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragState.current.startX = clientX;
    dragState.current.startY = clientY;
    dragState.current.startOffsetX = offset.x;
    dragState.current.startOffsetY = offset.y;
    dragState.current.lastPosition = { x: clientX, y: clientY };
    dragState.current.lastTime = Date.now();
  }, [offset]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    
    const newX = dragState.current.startOffsetX + deltaX;
    const newY = dragState.current.startOffsetY + deltaY;

    setOffset({ x: newX, y: newY });

    // Calculate momentum
    const now = Date.now();
    const timeDelta = now - dragState.current.lastTime;
    if (timeDelta > 0) {
      const velocityX = (clientX - dragState.current.lastPosition.x) / timeDelta;
      const velocityY = (clientY - dragState.current.lastPosition.y) / timeDelta;
      dragState.current.momentum = { x: velocityX * 100, y: velocityY * 100 };
    }

    dragState.current.lastPosition = { x: clientX, y: clientY };
    dragState.current.lastTime = now;
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    
    // Apply momentum
    const momentum = dragState.current.momentum;
    if (Math.abs(momentum.x) > 1 || Math.abs(momentum.y) > 1) {
      const animate = () => {
        setOffset(current => ({
          x: current.x + momentum.x,
          y: current.y + momentum.y,
        }));
        
        momentum.x *= 0.95;
        momentum.y *= 0.95;
        
        if (Math.abs(momentum.x) > 0.1 || Math.abs(momentum.y) > 0.1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

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

  return {
    offset,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  };
};
