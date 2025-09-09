import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  actionable?: boolean;
  className?: string;
}

const InfoCard = ({
  title,
  children,
  icon,
  actionable = false,
  className = '',
}: InfoCardProps) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 shadow-sm
        ${actionable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="flex items-center space-x-2 mb-3">
        {icon && <div className="text-gray-500">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
};

export default InfoCard;
