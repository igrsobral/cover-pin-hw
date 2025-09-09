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
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
            label="Search"
            placeholder="Search by name or company..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          />
        </div>
      </div>

        {hasActiveFilters && (
          <div className="flex justify-start sm:justify-end">
            <Button
              variant="secondary"
              onClick={onClearFilters}
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
    </div>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
