import { useMemo } from 'react';

import type { TableColumn } from '@shared/components/ui';
import { StatusBadge, Table } from '@shared/components/ui';
import { formatCurrency } from '@shared/utils';

import type { Opportunity } from '../types';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const OpportunityTable = ({
  opportunities,
  loading,
  error,
}: OpportunityTableProps) => {
  const columns = useMemo<TableColumn<Opportunity>[]>(
    () => [
      {
        key: 'name',
        label: 'Name',
        render: (opportunity) => (
          <div className="text-sm font-medium text-foreground">
            {opportunity.name}
          </div>
        ),
      },
      {
        key: 'accountName',
        label: 'Account',
        render: (opportunity) => (
          <div className="text-sm text-foreground">
            {opportunity.accountName}
          </div>
        ),
      },
      {
        key: 'stage',
        label: 'Stage',
        render: (opportunity) => (
          <StatusBadge
            status={opportunity.stage}
            variant="opportunity"
            className="text-xs px-2 py-1"
          />
        ),
      },
      {
        key: 'amount',
        label: 'Amount',
        render: (opportunity) => (
          <div className="text-sm text-foreground">
            {opportunity.amount ? formatCurrency(opportunity.amount) : '—'}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Table<Opportunity>
      columns={columns}
      data={opportunities}
      loading={loading}
      error={error}
      emptyState={{
        title: 'No opportunities found',
        description: 'Convert qualified leads to create opportunities.',
      }}
    />
  );
};

export default OpportunityTable;
