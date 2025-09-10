import { useCallback, useMemo } from 'react';
import { DEFAULT_FILTERS, DEFAULT_SORT, STORAGE_KEYS } from '@constants/index';

import type { SortConfig } from '@/shared';
import { useCollection, useLocalStorage } from '@shared/hooks';

import type { Lead, LeadFilters } from '../types';

const useLeadFilters = (leads: Lead[]) => {
  const [filters, setFilters] = useLocalStorage<LeadFilters>(
    STORAGE_KEYS.LEAD_FILTERS,
    DEFAULT_FILTERS.LEADS
  );

  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>(
    STORAGE_KEYS.LEAD_SORT,
    DEFAULT_SORT.LEADS as SortConfig
  );

  const statusFilter = useCallback(
    (lead: Lead) => {
      return filters.status === 'all' || lead.status === filters.status;
    },
    [filters.status]
  );

  const {
    items: filteredLeads,
    searchTerm,
    setSearchTerm,
    handleSort: collectionHandleSort,
    clearSearch,
    reset: resetCollection,
    totalCount,
    hasActiveFilters,
    isSearching,
  } = useCollection(leads, {
    searchFields: ['name', 'company', 'email'],
    filterFn: statusFilter,
    debounceDelay: 300,
  });

  const updateFilter = useCallback(
    (key: keyof LeadFilters, value: string) => {
      if (key === 'search') {
        setSearchTerm(value);
      } else {
        setFilters(
          (prev: LeadFilters) => ({ ...prev, [key]: value }) as LeadFilters
        );
      }
    },
    [setFilters, setSearchTerm]
  );

  const updateSort = useCallback(
    (field: keyof Lead) => {
      collectionHandleSort(field);
      setSortConfig({
        field,
        direction:
          sortConfig.field === field && sortConfig.direction === 'desc'
            ? 'asc'
            : 'desc',
      });
    },
    [collectionHandleSort, setSortConfig]
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS.LEADS);
    clearSearch();
  }, [setFilters, clearSearch]);

  const resetAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS.LEADS);
    setSortConfig(DEFAULT_SORT.LEADS);
    resetCollection();
  }, [setFilters, setSortConfig, resetCollection]);

  const syncedFilters = useMemo(
    () => ({
      ...filters,
      search: searchTerm,
    }),
    [filters, searchTerm]
  );

  const filterStats = useMemo(() => {
    const totalLeads = leads.length;
    const filteredCount = filteredLeads.length;
    const statusCounts = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: totalLeads,
      filtered: filteredCount,
      statusCounts,
      isFiltered: hasActiveFilters || filters.status !== 'all',
    };
  }, [leads, filteredLeads.length, hasActiveFilters, filters.status]);

  return {
    // Backward compatibility
    filters: syncedFilters,
    sortConfig,
    filteredLeads,
    updateFilter,
    updateSort,
    clearFilters,

    // Enhanced features
    resetAll,
    filterStats,
    isSearching,
    totalCount,
    hasActiveFilters: hasActiveFilters || filters.status !== 'all',
  };
};

export default useLeadFilters;
