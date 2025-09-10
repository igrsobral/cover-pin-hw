import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  sortConfig?: SortConfig;
  onSort?: (field: keyof T) => void;
  onRowClick?: (item: T) => void;
  onRetry?: () => void;
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description: string;
  };
  className?: string;
}

const Table = <T extends object>({
  data,
  columns,
  loading = false,
  error = null,
  sortConfig,
  onSort,
  onRowClick,
  onRetry,
  emptyState,
  className = '',
}: TableProps<T>) => {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.field !== columnKey) {
      return (
        <svg
          className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-blue-600"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-12 h-12 text-red-500 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading data
        </h3>
        <p className="text-gray-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="text-center py-16">
        {emptyState.icon ? (
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {emptyState.icon}
          </div>
        ) : (
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyState.title}
        </h3>
        <p className="text-gray-600">{emptyState.description}</p>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`group px-6 py-3 text-left text-sm font-medium text-muted-foreground ${
                    column.sortable && onSort
                      ? 'cursor-pointer hover:text-foreground transition-colors duration-150'
                      : ''
                  } ${column.className || ''}`}
                  onClick={() => {
                    if (column.sortable && onSort) {
                      onSort(String(column.key) as keyof T);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.sortable && onSort && (
                      <div className="ml-2 flex-shrink-0">
                        {getSortIcon(String(column.key))}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`bg-white border-b border-border last:border-b-0 transition-colors duration-150 hover:bg-muted/50 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-foreground"
                  >
                    {column.render
                      ? column.render(item)
                      : String(
                          (item as Record<string, unknown>)[
                            column.key as string
                          ] || '—'
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`bg-background border border-border rounded-lg p-4 space-y-3 transition-colors duration-150 hover:bg-muted/50 ${
              onRowClick ? 'cursor-pointer' : ''
            }`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => {
              const value = column.render
                ? column.render(item)
                : String(
                    (item as Record<string, unknown>)[column.key as string] ||
                      '—'
                  );

              return (
                <div
                  key={String(column.key)}
                  className="flex justify-between items-start"
                >
                  <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0 mr-3">
                    {column.label}:
                  </span>
                  <div className="text-sm text-foreground text-right flex-1 min-w-0">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
