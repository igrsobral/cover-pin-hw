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
          label="Email"
          type="email"
          value={editedLead.email ?? lead.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="Enter email address"
          error={emailError || undefined}
        />
        <Select
          label="Status"
          value={editedLead.status ?? lead.status}
          onChange={(e) => onFieldChange('status', e.target.value)}
          options={statusOptions}
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
