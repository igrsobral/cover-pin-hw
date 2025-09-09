import { fetchOpportunities } from '@shared/data/api';
import { useAsync } from '@shared/hooks';
import { useCallback } from 'react';

const useOpportunities = () => {
  const {
    data: fetchedOpportunities,
    loading,
    error,
    execute: refetch,
  } = useAsync(fetchOpportunities, [], { immediate: true });

  const refreshOpportunities = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    opportunities: fetchedOpportunities || [],
    loading,
    error,
    refetch: refreshOpportunities,
  };
};

export default useOpportunities;
