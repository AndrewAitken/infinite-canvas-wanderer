
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
  const isTouchDevice = useRef<boolean>(false);

  // Check if this is a touch device
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    console.log(`📱 Touch device detected: ${isTouchDevice.current}`);
  }, []);

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
    const lookbackTime = isTouchDevice.current ? 100 : 150; // Shorter lookback on mobile
    const recentPoints = velocityHistory.current.filter(
      point => now - point.timestamp < lookbackTime
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
    const minVelocity = isTouchDevice.current ? 0.2 : 0.1; // Higher threshold on mobile
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (velocityMagnitude < minVelocity) {
      options.onDragEnd?.();
      return;
    }
    
    setIsMomentum(true);
    let currentVelocity = { ...velocity };
    let currentDragOffset = { ...dragOffset };
    
    const animate = () => {
      const decay = isTouchDevice.current ? 0.92 : 0.95; // Faster decay on mobile
      const minVelocityThreshold = isTouchDevice.current ? 0.02 : 0.01;
      
      currentVelocity.x *= decay;
      currentVelocity.y *= decay;
      
      currentDragOffset.x += currentVelocity.x * 16;
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
        options.onDragEnd?.();
      }
    };
    
    momentumAnimation.current = requestAnimationFrame(animate);
  }, [dragOffset, options]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    console.log(`🚀 Drag start - Touch device: ${isTouchDevice.current}, Position: ${clientX}, ${clientY}`);
    
    clearMomentum();
    setIsDragging(true);
    
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
    
    // Update velocity history with mobile-optimized settings
    const now = Date.now();
    velocityHistory.current.push({
      x: clientX,
      y: clientY,
      timestamp: now
    });
    
    const historyLimit = isTouchDevice.current ? 150 : 200; // Shorter history on mobile
    velocityHistory.current = velocityHistory.current.filter(
      point => now - point.timestamp < historyLimit
    );
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    console.log(`🏁 Drag end - Touch device: ${isTouchDevice.current}`);
    setIsDragging(false);
    
    const velocity = calculateVelocity();
    startMomentum(velocity);
    
    velocityHistory.current = [];
  }, [isDragging, calculateVelocity, startMomentum]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice.current) return; // Prevent mouse events on touch devices
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isTouchDevice.current) return; // Safety check
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const setExternalOffset = useCallback((offset: { x: number; y: number }) => {
    // This function can be used to reset external offset if needed
  }, []);

  // Mobile-optimized event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice.current) return;
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDevice.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => {
      if (isTouchDevice.current) return;
      handleEnd();
    };

    const handleTouchEnd = () => {
      if (!isTouchDevice.current) return;
      handleEnd();
    };

    if (isDragging) {
      if (isTouchDevice.current) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
      } else {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseup', handleMouseUp, { passive: true });
      }
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
