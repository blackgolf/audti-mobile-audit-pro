
import React from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const CTAButton = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CTAButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-all duration-200 flex items-center justify-center',
        {
          // Variants
          'bg-audti-primary text-white hover:bg-audti-accent': variant === 'primary',
          'bg-audti-secondary text-white hover:bg-audti-accent': variant === 'secondary',
          'bg-transparent border-2 border-audti-primary text-audti-primary hover:bg-audti-primary/10': variant === 'outline',
          
          // Sizes
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-2.5 text-base': size === 'md',
          'px-8 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CTAButton;
