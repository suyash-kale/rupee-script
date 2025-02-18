import { cn } from '@/lib/utils';

import { FC, ReactNode } from 'react';

interface BusyProps {
  children: ReactNode;
  loading: boolean;
  className?: string;
}

export const Busy: FC<BusyProps> = ({ children, loading, className }) => {
  return (
    <div
      className={cn(
        className,
        loading && 'blur-xs animate-pulse pointer-events-none',
      )}
    >
      {children}
    </div>
  );
};
