import { useState, useCallback } from 'react';
import type { Lead } from '../types';
import { useAsync } from '../../../shared/hooks';
import { fetchLeads, updateLead } from '../../../shared/data/api';

const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, Lead>>(
    new Map()
  );

  const {
    data: fetchedLeads,
    loading,
    error,
    execute: refetch,
  } = useAsync(fetchLeads, [], { immediate: true });

  const updateLeadOptimistic = useCallback(
    async (leadId: string, updates: Partial<Lead>) => {
      const currentLeads = fetchedLeads || leads;
      const leadToUpdate = currentLeads.find((lead) => lead.id === leadId);

      if (!leadToUpdate) {
        throw new Error('Lead not found');
      }

      const optimisticLead = { ...leadToUpdate, ...updates };

      setOptimisticUpdates((prev) => new Map(prev).set(leadId, optimisticLead));

      try {
        const updatedLead = await updateLead(leadId, updates);
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(leadId);
          return newMap;
        });

        setLeads((prevLeads) =>
          prevLeads.map((lead) => (lead.id === leadId ? updatedLead : lead))
        );

        return updatedLead;
      } catch (error) {
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(leadId);
          return newMap;
        });
        throw error;
      }
    },
    [fetchedLeads, leads]
  );

  const getLeadsWithOptimisticUpdates = useCallback(() => {
    const baseLeads = fetchedLeads || leads;
    return baseLeads.map((lead) => optimisticUpdates.get(lead.id) || lead);
  }, [fetchedLeads, leads, optimisticUpdates]);

  return {
    leads: getLeadsWithOptimisticUpdates(),
    loading,
    error,
    refetch,
    updateLead: updateLeadOptimistic,
  };
};

export default useLeads;
