import { useState, useEffect } from 'react';
import type { Lead, LeadStatus } from '../types';
import type { OpportunityStage } from '../../../shared/types';
import {
  SlideOver,
  Button,
  Input,
  Select,
  ErrorMessage,
} from '../../../shared/components/ui';
import { validateEmail } from '../../../shared/utils';
import { convertLeadToOpportunity } from '../../../shared/data/api';
import { ERROR_MESSAGES, STATUS_COLORS } from '../../../shared/constants';

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: (leadId: string, updates: Partial<Lead>) => Promise<Lead>;
  onOpportunityCreated?: () => void;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

const stageOptions = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
];

const LeadDetail = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdate,
  onOpportunityCreated,
}: LeadDetailProps) => {
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Opportunity conversion form
  const [showConversionForm, setShowConversionForm] = useState(false);
  const [opportunityData, setOpportunityData] = useState({
    name: '',
    stage: 'prospecting' as OpportunityStage,
    amount: '',
    accountName: '',
  });

  useEffect(() => {
    if (lead) {
      setEditedLead({});
      setIsEditing(false);
      setError(null);
      setEmailError(null);
      setShowConversionForm(false);
      setOpportunityData({
        name: `${lead.company} - ${lead.name}`,
        stage: 'prospecting',
        amount: '',
        accountName: lead.company,
      });
    }
  }, [lead]);

  const handleFieldChange = (field: keyof Lead, value: string) => {
    setEditedLead((prev: Partial<Lead>) => ({ ...prev, [field]: value }));

    if (field === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError(ERROR_MESSAGES.INVALID_EMAIL);
      } else {
        setEmailError(null);
      }
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    if (editedLead.email && !validateEmail(editedLead.email)) {
      setEmailError(ERROR_MESSAGES.INVALID_EMAIL);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onLeadUpdate(lead.id, editedLead);
      setIsEditing(false);
      setEditedLead({});
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.UPDATE_LEAD_FAILED);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedLead({});
    setIsEditing(false);
    setEmailError(null);
    setError(null);
  };

  const handleConvertToOpportunity = async () => {
    if (!lead) return;

    setIsConverting(true);
    setError(null);

    try {
      await convertLeadToOpportunity(lead.id, {
        name: opportunityData.name,
        stage: opportunityData.stage,
        amount: opportunityData.amount
          ? parseFloat(opportunityData.amount)
          : undefined,
        accountName: opportunityData.accountName,
      });

      setShowConversionForm(false);
      onOpportunityCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.CONVERT_LEAD_FAILED);
    } finally {
      setIsConverting(false);
    }
  };

  if (!lead) return null;

  const currentLead = { ...lead, ...editedLead };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-6">
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}

        {/* Lead Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="text-sm text-gray-900">{currentLead.name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <div className="text-sm text-gray-900">{currentLead.company}</div>
          </div>

          <div>
            {isEditing ? (
              <Input
                label="Email"
                type="email"
                value={editedLead.email ?? currentLead.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={emailError || undefined}
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-sm text-gray-900">{currentLead.email}</div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <div className="text-sm text-gray-900 capitalize">
              {currentLead.source.replace('_', ' ')}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score
            </label>
            <div className="text-sm text-gray-900">{currentLead.score}</div>
          </div>

          <div>
            {isEditing ? (
              <Select
                label="Status"
                options={statusOptions}
                value={editedLead.status ?? currentLead.status}
                onChange={(e) =>
                  handleFieldChange('status', e.target.value as LeadStatus)
                }
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    currentLead.status === 'new'
                      ? `${STATUS_COLORS.NEW.bg} ${STATUS_COLORS.NEW.text}`
                      : currentLead.status === 'contacted'
                        ? `${STATUS_COLORS.CONTACTED.bg} ${STATUS_COLORS.CONTACTED.text}`
                        : currentLead.status === 'qualified'
                          ? `${STATUS_COLORS.QUALIFIED.bg} ${STATUS_COLORS.QUALIFIED.text}`
                          : `${STATUS_COLORS.UNQUALIFIED.bg} ${STATUS_COLORS.UNQUALIFIED.text}`
                  }`}
                >
                  {currentLead.status.charAt(0).toUpperCase() +
                    currentLead.status.slice(1)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
          {isEditing ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                loading={isSaving}
                disabled={!!emailError}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Edit Lead
            </Button>
          )}

          {!showConversionForm && !isEditing && (
            <Button
              onClick={() => setShowConversionForm(true)}
              className="w-full"
            >
              Convert to Opportunity
            </Button>
          )}
        </div>

        {/* Opportunity Conversion Form */}
        {showConversionForm && (
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Create Opportunity
            </h3>

            <Input
              label="Opportunity Name"
              value={opportunityData.name}
              onChange={(e) =>
                setOpportunityData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter opportunity name"
            />

            <Input
              label="Account Name"
              value={opportunityData.accountName}
              onChange={(e) =>
                setOpportunityData((prev) => ({
                  ...prev,
                  accountName: e.target.value,
                }))
              }
              placeholder="Enter account name"
            />

            <Select
              label="Stage"
              options={stageOptions}
              value={opportunityData.stage}
              onChange={(e) =>
                setOpportunityData((prev) => ({
                  ...prev,
                  stage: e.target.value as OpportunityStage,
                }))
              }
            />

            <Input
              label="Amount (Optional)"
              type="number"
              value={opportunityData.amount}
              onChange={(e) =>
                setOpportunityData((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              placeholder="Enter deal amount"
            />

            <div className="flex space-x-3">
              <Button
                onClick={handleConvertToOpportunity}
                loading={isConverting}
                className="flex-1"
              >
                Create Opportunity
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowConversionForm(false)}
                disabled={isConverting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default LeadDetail;
