import { useCallback, useMemo, useRef } from 'react';
import { SUCCESS_MESSAGES } from '@constants/errors';
import { fetchLeads, updateLead } from '@data/api';

import { useAsync, useErrorHandler, useOptimisticUpdate } from '@shared/hooks';
import { showToast } from '@shared/utils';

import type { Lead } from '../types';

const useLeads = () => {
  const { handleError } = useErrorHandler();

  const { performOptimisticUpdate, getOptimisticValue, hasOptimisticUpdate } =
    useOptimisticUpdate<Lead, string>({
      onSuccess: () => {
        showToast.success(SUCCESS_MESSAGES.LEAD_UPDATED);
      },
      onError: handleError,
    });

  const fetchLeadsRef = useRef(fetchLeads);
  fetchLeadsRef.current = fetchLeads;

  const stableFetchLeads = useCallback(() => {
    return fetchLeadsRef.current();
  }, []);

  const asyncOptions = useMemo(
    () => ({
      immediate: true,
    }),
    []
  );

  const {
    data: fetchedLeads,
    loading,
    error,
    execute: refetch,
  } = useAsync(stableFetchLeads, asyncOptions);

  const updateLeadOptimistic = useCallback(
    async (leadId: string, updates: Partial<Lead>): Promise<void> => {
      const currentLeads = fetchedLeads || [];
      const leadToUpdate = currentLeads.find(
        (lead: Lead) => lead.id === leadId
      );

      if (!leadToUpdate) {
        throw new Error('Lead not found');
      }

      const optimisticLead = { ...leadToUpdate, ...updates };

      await performOptimisticUpdate(leadId, optimisticLead, async () => {
        const result = await updateLead(leadId, updates);
        refetch();
        return result;
      });
    },
    [fetchedLeads, performOptimisticUpdate, refetch]
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
