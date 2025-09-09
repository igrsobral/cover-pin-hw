interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className="flex justify-center items-center"
      role="status"
      aria-label="Loading"
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
