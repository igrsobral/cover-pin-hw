import { memo, useMemo } from 'react';

import type { SortConfig, TableColumn } from '@shared/components/ui';
import { StatusBadge, Table } from '@shared/components/ui';
import { capitalizeFirst } from '@shared/utils';

import type { Lead } from '../types';

interface LeadsListProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onLeadClick: (lead: Lead) => void;
  onSort: (field: keyof Lead) => void;
  onRetry?: () => void;
}

const LeadsList = memo(
  ({
    leads,
    loading,
    error,
    sortConfig,
    onLeadClick,
    onSort,
    onRetry,
  }: LeadsListProps) => {
    const columns = useMemo<TableColumn<Lead>[]>(
      () => [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          render: (lead) => (
            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
          ),
        },
        {
          key: 'company',
          label: 'Company',
          sortable: true,
          render: (lead) => (
            <div className="text-sm text-gray-900">{lead.company}</div>
          ),
        },
        {
          key: 'email',
          label: 'Email',
          render: (lead) => (
            <div className="text-sm text-gray-700">{lead.email}</div>
          ),
        },
        {
          key: 'source',
          label: 'Source',
          render: (lead) => (
            <div className="text-sm text-gray-700">
              {capitalizeFirst(lead.source.replace('_', ' '))}
            </div>
          ),
        },
        {
          key: 'score',
          label: 'Score',
          sortable: true,
          render: (lead) => {
            const getScoreColor = (score: number) => {
              if (score >= 80) return 'text-green-600 font-semibold';
              if (score >= 60) return 'text-yellow-600 font-medium';
              return 'text-red-600';
            };

            return (
              <div className={`text-sm ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
            );
          },
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          render: (lead) => (
            <StatusBadge
              status={lead.status}
              variant="lead"
              className="text-xs px-2 py-1"
            />
          ),
        },
      ],
      []
    );

    return (
      <Table<Lead>
        data={leads}
        columns={columns}
        loading={loading}
        error={error}
        sortConfig={sortConfig}
        onSort={onSort}
        onRowClick={onLeadClick}
        onRetry={onRetry}
        emptyState={{
          title: 'No leads found',
          description: 'Try adjusting your search or filter criteria.',
        }}
      />
    );
  }
);

LeadsList.displayName = 'LeadsList';

export default LeadsList;
