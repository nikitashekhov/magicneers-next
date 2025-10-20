import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  switch (variant) {
    case 'destructive':
      return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
    case 'outline':
      return `${baseClasses} border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900`;
    case 'secondary':
      return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200`;
    case 'ghost':
      return `${baseClasses} hover:bg-gray-100 hover:text-gray-900`;
    case 'link':
      return `${baseClasses} text-blue-600 underline-offset-4 hover:underline`;
    default:
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
  }
};

const getSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-9 rounded-md px-3';
    case 'lg':
      return 'h-11 rounded-md px-8';
    case 'icon':
      return 'h-10 w-10';
    default:
      return 'h-10 px-4 py-2';
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    
    return (
      <button
        className={cn(variantClasses, sizeClasses, className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
