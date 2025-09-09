import { useState } from 'react';
import type { Lead } from '../types';
import { useLeads, useLeadFilters } from '../hooks';
import LeadFilters from './LeadFilters';
import LeadsList from './LeadsList';
import LeadDetail from './LeadDetail';

const LeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { leads, loading, error, refetch, updateLead } = useLeads();
  const {
    filters,
    sortConfig,
    filteredLeads,
    updateFilter,
    updateSort,
    clearFilters,
  } = useLeadFilters(leads);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedLead(null);
  };

  const handleOpportunityCreated = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="text-sm text-gray-500">
          {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      <LeadFilters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />

      <LeadsList
        leads={filteredLeads}
        loading={loading}
        error={error}
        sortConfig={sortConfig}
        onLeadClick={handleLeadClick}
        onSort={updateSort}
        onRetry={refetch}
      />

      <LeadDetail
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        onLeadUpdate={updateLead}
        onOpportunityCreated={handleOpportunityCreated}
      />
    </div>
  );
};

export default LeadsPage;
