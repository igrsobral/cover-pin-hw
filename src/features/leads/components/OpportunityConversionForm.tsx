import { Button, Input, Select } from '@shared/components';
import type { OpportunityStage } from '@shared/types';

interface OpportunityConversionFormProps {
  opportunityData: {
    name: string;
    stage: OpportunityStage;
    amount: string;
    accountName: string;
  };
  onDataChange: (
    data: Partial<OpportunityConversionFormProps['opportunityData']>
  ) => void;
  onConvert: () => void;
  onCancel: () => void;
  isConverting: boolean;
}

const stageOptions = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

export const OpportunityConversionForm = ({
  opportunityData,
  onDataChange,
  onConvert,
  onCancel,
  isConverting,
}: OpportunityConversionFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Convert to Opportunity
      </h3>

      <div className="space-y-4">
        <Input
          label="Opportunity Name"
          value={opportunityData.name}
          onChange={(e) => onDataChange({ name: e.target.value })}
          placeholder="Enter opportunity name"
        />

        <Input
          label="Account Name"
          value={opportunityData.accountName}
          onChange={(e) => onDataChange({ accountName: e.target.value })}
          placeholder="Enter account name"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Stage"
            value={opportunityData.stage}
            onChange={(e) =>
              onDataChange({ stage: e.target.value as OpportunityStage })
            }
            options={stageOptions}
          />

          <Input
            label="Amount"
            type="number"
            value={opportunityData.amount}
            onChange={(e) => onDataChange({ amount: e.target.value })}
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={isConverting}>
          Cancel
        </Button>
        <Button onClick={onConvert} loading={isConverting}>
          Convert to Opportunity
        </Button>
      </div>
    </div>
  );
};
