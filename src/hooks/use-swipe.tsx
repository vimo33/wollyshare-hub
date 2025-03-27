
import { useState, useRef, TouchEvent } from 'react';

interface SwipeReturn {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
  swiping: boolean;
  swipeDistance: { x: number; y: number };
}

interface UseSwipeProps {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipe({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: UseSwipeProps = {}): SwipeReturn {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState({ x: 0, y: 0 });
  
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    touchEnd.current = { x: 0, y: 0 };
    setSwipeDirection(null);
    setSwiping(false);
    setSwipeDistance({ x: 0, y: 0 });
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    
    setSwipeDistance({ x: deltaX, y: deltaY });
    setSwiping(true);
  };

  const onTouchEnd = () => {
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    
    setSwiping(false);
    setSwipeDistance({ x: 0, y: 0 });
    
    // Detect horizontal swipe
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        setSwipeDirection('right');
        onSwipeRight?.();
      } else {
        setSwipeDirection('left');
        onSwipeLeft?.();
      }
    } 
    // Detect vertical swipe
    else if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        setSwipeDirection('down');
        onSwipeDown?.();
      } else {
        setSwipeDirection('up');
        onSwipeUp?.();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    swipeDirection,
    swiping,
    swipeDistance,
  };
}
