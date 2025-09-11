import { Button, Input, Select } from '@shared/components/ui';

import type { LeadFilters as LeadFiltersType } from '../types';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (key: keyof LeadFiltersType, value: string) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

const LeadFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: LeadFiltersProps) => {
  const hasActiveFilters = filters.search !== '' || filters.status !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm my-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:flex-1 sm:min-w-0">
            <div className="relative">
              <Input
                label="Search"
                placeholder="Search by name or company..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-9 h-9"
              />
              <div className="absolute left-2.5 top-8 text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={onClearFilters}
              className="h-9 px-3 text-xs whitespace-nowrap"
            >
              Clear All
            </Button>
          )}
        </div>

        {hasActiveFilters && (filters.search || filters.status !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded text-xs">
                "{filters.search}"
                <button
                  onClick={() => onFilterChange('search', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded text-xs">
                {
                  statusOptions.find((opt) => opt.value === filters.status)
                    ?.label
                }
                <button
                  onClick={() => onFilterChange('status', 'all')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
