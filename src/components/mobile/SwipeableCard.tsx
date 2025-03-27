
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

// This component now just passes through the children without adding swipe functionality
const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('touch-feedback', className)}>
      {children}
    </div>
  );
};

export default SwipeableCard;
