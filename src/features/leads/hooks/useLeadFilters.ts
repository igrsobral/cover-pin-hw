import { useMemo, useCallback } from 'react';
import type { Lead, LeadFilters, SortConfig } from '../types';
import { useLocalStorage } from '../../../shared/hooks';
import { STORAGE_KEYS, DEFAULT_FILTERS, DEFAULT_SORT } from '../../../shared/constants';

const useLeadFilters = (leads: Lead[]) => {
  const [filters, setFilters] = useLocalStorage<LeadFilters>(
    STORAGE_KEYS.LEAD_FILTERS,
    DEFAULT_FILTERS.LEADS
  );

  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>(
    STORAGE_KEYS.LEAD_SORT,
    DEFAULT_SORT.LEADS
  );

  const updateFilter = useCallback(
    (key: keyof LeadFilters, value: string) => {
      setFilters((prev: LeadFilters) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const updateSort = useCallback(
    (field: keyof Lead) => {
      setSortConfig((prev: SortConfig) => ({
        field,
        direction:
          prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
      }));
    },
    [setSortConfig]
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS.LEADS);
  }, [setFilters]);

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((lead) => lead.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    return result;
  }, [leads, filters, sortConfig]);

  return {
    filters,
    sortConfig,
    filteredLeads: filteredAndSortedLeads,
    updateFilter,
    updateSort,
    clearFilters,
  };
};

export default useLeadFilters;
