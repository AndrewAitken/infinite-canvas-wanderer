
import { useState, useRef } from 'react';
import { TouchEvent } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | null;
}

export const useSwipe = (handlers: SwipeHandlers, threshold: number = 50) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    swipeDirection: null,
  });
  
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    setSwipeState({ isSwiping: true, swipeDirection: null });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    
    const deltaX = touchStart.current.x - currentTouch.x;
    const deltaY = Math.abs(touchStart.current.y - currentTouch.y);
    
    // Only process horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
      const direction = deltaX > 0 ? 'left' : 'right';
      setSwipeState({ isSwiping: true, swipeDirection: direction });
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    
    touchEnd.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    
    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = Math.abs(touchStart.current.y - touchEnd.current.y);
    
    // Check if it's a valid horizontal swipe
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (deltaX < 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }
    }
    
    setSwipeState({ isSwiping: false, swipeDirection: null });
    touchStart.current = null;
    touchEnd.current = null;
  };

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { swipeState, swipeHandlers };
};
