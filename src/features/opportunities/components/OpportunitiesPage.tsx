import { useOpportunities } from '../hooks';
import OpportunityTable from './OpportunityTable';

const OpportunitiesPage = () => {
    const { opportunities, loading, error, refetch } = useOpportunities();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
                <div className="text-sm text-gray-500">
                    {opportunities.length} opportunities
                </div>
            </div>

            <OpportunityTable
                opportunities={opportunities}
                loading={loading}
                error={error}
                onRetry={refetch}
            />
        </div>
    );
};

export default OpportunitiesPage;
