interface StatusBadgeProps {
  status: string;
  variant?: 'lead' | 'opportunity';
  className?: string;
}

const StatusBadge = ({
  status,
  variant = 'lead',
  className = '',
}: StatusBadgeProps) => {
  const getStatusStyles = () => {
    if (variant === 'lead') {
      switch (status) {
        case 'new':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'contacted':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'qualified':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'unqualified':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    if (variant === 'opportunity') {
      switch (status) {
        case 'prospecting':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'qualification':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'proposal':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'negotiation':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'closed_won':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'closed_lost':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusStyles()} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
