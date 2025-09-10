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
          return 'bg-blue-50 text-blue-700 border border-blue-200';
        case 'contacted':
          return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'qualified':
        case 'converted':
          return 'bg-green-50 text-green-700 border border-green-200';
        case 'unqualified':
          return 'bg-red-50 text-red-700 border border-red-200';
        default:
          return 'bg-muted text-muted-foreground border border-border';
      }
    }

    if (variant === 'opportunity') {
      switch (status) {
        case 'prospecting':
          return 'bg-blue-50 text-blue-700 border border-blue-200';
        case 'qualification':
          return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'proposal':
          return 'bg-purple-50 text-purple-700 border border-purple-200';
        case 'negotiation':
          return 'bg-orange-50 text-orange-700 border border-orange-200';
        case 'closed_won':
          return 'bg-green-50 text-green-700 border border-green-200';
        case 'closed_lost':
          return 'bg-red-50 text-red-700 border border-red-200';
        default:
          return 'bg-muted text-muted-foreground border border-border';
      }
    }

    return 'bg-muted text-muted-foreground border border-border';
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md ${getStatusStyles()} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
