interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars';
  color?: 'blue' | 'gray' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  color = 'blue',
  className = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
  };

  const dotSizes = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const barSizes = {
    xs: 'h-3 w-0.5',
    sm: 'h-4 w-0.5',
    md: 'h-6 w-1',
    lg: 'h-8 w-1',
    xl: 'h-10 w-1.5',
  };

  if (variant === 'dots') {
    return (
      <div
        className={`flex justify-center items-center space-x-1 ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div className={`${dotSizes[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSizes[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${dotSizes[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div className={`${sizeClasses[size]} bg-${color}-600 rounded-full animate-pulse opacity-75`}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div
        className={`flex justify-center items-end space-x-1 ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div className={`${barSizes[size]} bg-${color}-600 animate-pulse`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${barSizes[size]} bg-${color}-600 animate-pulse`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${barSizes[size]} bg-${color}-600 animate-pulse`} style={{ animationDelay: '300ms' }}></div>
        <div className={`${barSizes[size]} bg-${color}-600 animate-pulse`} style={{ animationDelay: '450ms' }}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`animate-spin rounded-full border-2 border-gray-200 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
