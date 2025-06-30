
import { useState, useRef } from 'react';

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

  // Check if touch events are supported
  const isTouchSupported = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchSupported()) return;
    
    console.log('🚀 Touch start detected');
    
    // Don't prevent default to allow scrolling when needed
    touchEnd.current = null;
    
    if (e.touches && e.touches.length > 0) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setSwipeState({ isSwiping: true, swipeDirection: null });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchSupported() || !touchStart.current) return;
    
    if (e.touches && e.touches.length > 0) {
      const currentTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      
      const deltaX = touchStart.current.x - currentTouch.x;
      const deltaY = Math.abs(touchStart.current.y - currentTouch.y);
      
      // Only process horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
        const direction = deltaX > 0 ? 'left' : 'right';
        setSwipeState({ isSwiping: true, swipeDirection: direction });
        
        // Prevent default only for horizontal swipes to avoid scroll conflicts
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault();
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchSupported() || !touchStart.current) return;
    
    console.log('🏁 Touch end detected');
    
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEnd.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      
      const deltaX = touchStart.current.x - touchEnd.current.x;
      const deltaY = Math.abs(touchStart.current.y - touchEnd.current.y);
      
      // Check if it's a valid horizontal swipe
      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
        console.log(`👆 Swipe detected: ${deltaX > 0 ? 'left' : 'right'}`);
        
        if (deltaX > 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        } else if (deltaX < 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        }
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
