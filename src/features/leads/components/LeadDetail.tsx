import { useEffect, useState } from 'react';

import {
  Button,
  ErrorMessage,
  InfoCard,
  Input,
  Select,
  SlideOver,
  StatusBadge,
} from '@shared/components/ui';
import { ERROR_MESSAGES } from '@shared/constants';
import { convertLeadToOpportunity } from '@shared/data/api';
import type { OpportunityStage } from '@shared/types';
import { validateEmail } from '@shared/utils';

import type { Lead, LeadStatus } from '../types';

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: (
    leadId: string,
    updates: Partial<Lead>
  ) => Promise<Lead | null>;
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
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.UPDATE_LEAD_FAILED
      );
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
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.CONVERT_LEAD_FAILED
      );
    } finally {
      setIsConverting(false);
    }
  };

  if (!lead) return null;

  const currentLead = { ...lead, ...editedLead };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-6">
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}

        <div className="bg-gradient-to-r from-gray-50 to-white p-6 -m-6 mb-6 border-b border-gray-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {currentLead.name}
              </h1>
              <p className="text-lg font-medium text-gray-600">
                {currentLead.company}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getScoreColor(currentLead.score)}`}
                  >
                    {currentLead.score}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Lead Score
                  </p>
                  <p
                    className={`text-xs font-semibold ${getScoreColor(currentLead.score).split(' ')[0]}`}
                  >
                    {getScoreLabel(currentLead.score)} Priority
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                <StatusBadge status={currentLead.status} variant="lead" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {/* Contact Information Card */}
          <InfoCard
            title="Contact Information"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
            actionable={!isEditing}
          >
            {isEditing ? (
              <Input
                label="Email"
                type="email"
                value={editedLead.email ?? currentLead.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={emailError || undefined}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </span>
                </div>
                <div className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer font-medium">
                  {currentLead.email}
                </div>
              </div>
            )}
          </InfoCard>

          {/* Lead Metadata Card */}
          <InfoCard
            title="Lead Information"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          >
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                  Source
                </span>
                <span className="text-gray-900 font-medium capitalize">
                  {currentLead.source.replace('_', ' ')}
                </span>
              </div>

              {isEditing && (
                <div className="pt-2 border-t border-gray-100">
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={editedLead.status ?? currentLead.status}
                    onChange={(e) =>
                      handleFieldChange('status', e.target.value as LeadStatus)
                    }
                  />
                </div>
              )}
            </div>
          </InfoCard>
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
          <div className="pt-6 border-t border-gray-200">
            <InfoCard
              title="Create Opportunity"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
              className="space-y-4"
            >
              <div className="space-y-4">
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

                <div className="flex space-x-3 pt-2">
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
            </InfoCard>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default LeadDetail;
