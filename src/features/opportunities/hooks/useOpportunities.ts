import { useCallback, useMemo } from 'react';
import { fetchOpportunities } from '@data/api';

import { useAsync, useCollection, useErrorHandler } from '@shared/hooks';

import type { Opportunity } from '../types';

const useOpportunities = () => {
  const { handleError } = useErrorHandler();

  const asyncOptions = useMemo(
    () => ({
      immediate: true,
      onError: handleError,
    }),
    [handleError]
  );

  const {
    data: fetchedOpportunities,
    loading,
    error,
    execute: refetch,
  } = useAsync(fetchOpportunities, asyncOptions);

  const opportunities = useMemo(
    () => fetchedOpportunities || [],
    [fetchedOpportunities]
  );

  const {
    items: filteredOpportunities,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortConfig,
    clearSearch,
    totalCount,
    hasActiveFilters,
    isSearching,
    paginate,
    getTotalPages,
  } = useCollection(opportunities, {
    searchFields: ['name', 'accountName'],
    sortField: 'name',
    sortDirection: 'asc',
    debounceDelay: 300,
  });

  const refreshOpportunities = useCallback(() => {
    refetch();
  }, [refetch]);

  const getOpportunityById = useCallback(
    (opportunityId: string): Opportunity | undefined => {
      return opportunities.find((opp: Opportunity) => opp.id === opportunityId);
    },
    [opportunities]
  );

  // Calculate opportunity statistics
  const opportunityStats = useMemo(() => {
    const stats = opportunities.reduce(
      (
        acc: { totalAmount: number; stageCount: Record<string, number> },
        opp: Opportunity
      ) => {
        acc.totalAmount += opp.amount || 0;
        acc.stageCount[opp.stage] = (acc.stageCount[opp.stage] || 0) + 1;
        return acc;
      },
      {
        totalAmount: 0,
        stageCount: {} as Record<string, number>,
      }
    );

    return {
      ...stats,
      averageAmount:
        opportunities.length > 0 ? stats.totalAmount / opportunities.length : 0,
      totalCount: opportunities.length,
    };
  }, [opportunities]);

  return {
    // Core data
    opportunities: filteredOpportunities,
    allOpportunities: opportunities,
    loading,
    error,

    // Operations
    refetch: refreshOpportunities,
    getOpportunityById,

    // Search and filtering
    searchTerm,
    setSearchTerm,
    handleSort,
    sortConfig,
    clearSearch,

    // Stats and metadata
    totalCount,
    hasActiveFilters,
    isSearching,
    opportunityStats,

    // Pagination
    paginate,
    getTotalPages,
  };
};

export default useOpportunities;
