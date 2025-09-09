import { useCallback, useMemo } from 'react';
import { SUCCESS_MESSAGES } from '@constants/errors';
import { fetchLeads, updateLead } from '@data/api';

import {
  useAsync,
  useOptimisticUpdate,
  useErrorHandler,
} from '@shared/hooks';

import type { Lead } from '../types';

const useLeads = () => {
  const { handleError } = useErrorHandler();

  const { performOptimisticUpdate, getOptimisticValue, hasOptimisticUpdate } =
    useOptimisticUpdate<Lead, string>({
      onSuccess: () => {
        console.log(SUCCESS_MESSAGES.LEAD_UPDATED);
      },
      onError: handleError,
    });

  const {
    data: fetchedLeads,
    loading,
    error,
    execute: refetch,
  } = useAsync(fetchLeads, [], {
    immediate: true,
  });

  const updateLeadOptimistic = useCallback(
    async (leadId: string, updates: Partial<Lead>) => {
      const currentLeads = fetchedLeads || [];
      const leadToUpdate = currentLeads.find(
        (lead: Lead) => lead.id === leadId
      );

      if (!leadToUpdate) {
        throw new Error('Lead not found');
      }

      const optimisticLead = { ...leadToUpdate, ...updates };

      return performOptimisticUpdate(leadId, optimisticLead, () =>
        updateLead(leadId, updates)
      );
    },
    [fetchedLeads, performOptimisticUpdate]
  );

  const leadsWithOptimisticUpdates = useMemo(() => {
    const baseLeads = fetchedLeads || [];
    return baseLeads.map((lead: Lead) => getOptimisticValue(lead.id, lead));
  }, [fetchedLeads, getOptimisticValue]);

  const getLeadById = useCallback(
    (leadId: string): Lead | undefined => {
      return leadsWithOptimisticUpdates.find(
        (lead: Lead) => lead.id === leadId
      );
    },
    [leadsWithOptimisticUpdates]
  );

  const isLeadUpdating = useCallback(
    (leadId: string): boolean => {
      return hasOptimisticUpdate(leadId);
    },
    [hasOptimisticUpdate]
  );

  return {
    leads: leadsWithOptimisticUpdates,
    loading,
    error,
    refetch,
    updateLead: updateLeadOptimistic,
    getLeadById,
    isLeadUpdating,
  };
};

export default useLeads;
