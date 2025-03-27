
import React, { TouchEvent, ReactNode } from 'react';
import { useSwipe } from '@/hooks/use-swipe';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
}) => {
  const { 
    onTouchStart, 
    onTouchMove, 
    onTouchEnd, 
    swiping,
    swipeDistance 
  } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
  });

  // Calculate the transform style based on swipe distance
  const getStyle = () => {
    if (swiping) {
      return {
        transform: `translateX(${swipeDistance.x}px)`,
        transition: 'none',
      };
    }
    return {
      transform: 'translateX(0)',
      transition: 'transform 0.3s ease',
    };
  };

  return (
    <div
      className={cn(
        'swipeable-item touch-feedback',
        className
      )}
      onTouchStart={onTouchStart as (e: TouchEvent<HTMLDivElement>) => void}
      onTouchMove={onTouchMove as (e: TouchEvent<HTMLDivElement>) => void}
      onTouchEnd={onTouchEnd}
      style={getStyle()}
    >
      {children}
    </div>
  );
};

export default SwipeableCard;
