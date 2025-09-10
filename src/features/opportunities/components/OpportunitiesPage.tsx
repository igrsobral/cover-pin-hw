import { useOpportunities } from '../hooks';

import OpportunityTable from './OpportunityTable';

const OpportunitiesPage = () => {
  const { opportunities, loading, error, refetch } = useOpportunities();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage your sales opportunities
              </p>
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
              {opportunities.length} opportunities
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm">
            <OpportunityTable
              opportunities={opportunities}
              loading={loading}
              error={error}
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
