import { Button, Input, Select } from '@shared/components';
import type { Lead } from '@shared/types';

interface LeadEditFormProps {
  lead: Lead;
  editedLead: Partial<Lead>;
  onFieldChange: (field: keyof Lead, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  emailError: string | null;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'conference', label: 'Conference' },
  { value: 'cold_call', label: 'Cold Call' },
];

export const LeadEditForm = ({
  lead,
  editedLead,
  onFieldChange,
  onSave,
  onCancel,
  isSaving,
  emailError,
}: LeadEditFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          value={editedLead.name ?? lead.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="Enter lead name"
        />
        <Input
          label="Company"
          value={editedLead.company ?? lead.company}
          onChange={(e) => onFieldChange('company', e.target.value)}
          placeholder="Enter company name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={editedLead.email ?? lead.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="Enter email address"
          error={emailError || undefined}
        />
        <Input
          label="Score"
          type="number"
          value={editedLead.score?.toString() ?? lead.score.toString()}
          onChange={(e) => onFieldChange('score', e.target.value)}
          placeholder="Enter lead score"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={editedLead.status ?? lead.status}
          onChange={(e) => onFieldChange('status', e.target.value)}
          options={statusOptions}
        />
        <Select
          label="Source"
          value={editedLead.source ?? lead.source}
          onChange={(e) => onFieldChange('source', e.target.value)}
          options={sourceOptions}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={onSave} loading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
