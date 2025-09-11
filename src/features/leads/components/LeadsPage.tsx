import { useState } from 'react';

import { useLeadFilters, useLeads } from '../hooks';

import LeadDetail from './LeadDetail';
import LeadFilters from './LeadFilters';
import LeadsList from './LeadsList';

import type { Lead } from '../types';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl ">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage leads and track opportunities in your sales pipeline
            </p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md self-start sm:self-auto">
            {filteredLeads.length} of {leads.length} leads
          </div>
        </div>

        <LeadFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />

        <div className="bg-card rounded-lg border border-border shadow-sm">
          <LeadsList
            leads={filteredLeads}
            loading={loading}
            error={error}
            sortConfig={sortConfig}
            onLeadClick={handleLeadClick}
            onSort={updateSort}
            onRetry={refetch}
          />
        </div>

        <LeadDetail
          lead={selectedLead}
          isOpen={isDetailOpen}
          onClose={handleDetailClose}
          onLeadUpdate={updateLead}
          onOpportunityCreated={handleOpportunityCreated}
        />
      </div>
    </div>
  );
};

export default LeadsPage;
