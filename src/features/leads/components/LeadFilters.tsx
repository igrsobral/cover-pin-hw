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
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
        
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              Active filters
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Input
                label="Search"
                placeholder="Search by name or company..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-9 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md mr-2">
                  Search: "{filters.search}"
                  <button
                    onClick={() => onFilterChange('search', '')}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                  Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => onFilterChange('status', 'all')}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
