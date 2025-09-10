import { useCallback, useEffect, useMemo } from 'react';
import { fetchOpportunities } from '@data/api';

import { useAsync, useErrorHandler } from '@shared/hooks';

import type { Opportunity } from '../types';

const useOpportunities = () => {
  const errorHandlerOptions = useMemo(() => ({}), []);
  const { handleError } = useErrorHandler(errorHandlerOptions);

  const asyncOptions = useMemo(
    () => ({
      immediate: true,
    }),
    []
  );

  const {
    data: fetchedOpportunities,
    loading,
    error,
    execute: refetch,
  } = useAsync(fetchOpportunities, asyncOptions);

  useEffect(() => {
    if (error) {
      handleError(new Error(error));
    }
  }, [error, handleError]);

  const opportunities = useMemo(
    () => fetchedOpportunities || [],
    [fetchedOpportunities]
  );

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
    opportunities,
    loading,
    error,
    refetch,
    getOpportunityById,
    opportunityStats,
  };
};

export default useOpportunities;
