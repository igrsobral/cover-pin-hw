import {
  Button,
  ErrorMessage,
  SlideOver,
  StatusBadge,
} from '@shared/components/ui';

import { useLeadDetailState } from '../hooks/useLeadDetailState';

import { ContactInfoCard } from './ContactInfoCard';
import { LeadEditForm } from './LeadEditForm';
import { OpportunityConversionForm } from './OpportunityConversionForm';

import type { Lead } from '../types';

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  onOpportunityCreated?: () => void;
}

const LeadDetail = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdate,
  onOpportunityCreated,
}: LeadDetailProps) => {
  const { state, handlers } = useLeadDetailState(
    lead,
    onLeadUpdate,
    onOpportunityCreated,
    onClose
  );

  if (!lead) return null;

  const currentLead = { ...lead, ...state.editedLead };
  const {
    handleFieldChange,
    handleSave,
    handleCancel,
    handleConvertToOpportunity,
    setEditing,
    setShowConversionForm,
    setOpportunityData,
  } = handlers;

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
    <SlideOver isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {state.error && <ErrorMessage message={state.error} />}

        <div className="p-6 -mx-4 sm:-mx-6 mb-6 border-b border-gray-200">
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
          <ContactInfoCard lead={currentLead} />
        </div>

        {state.isEditing ? (
          <LeadEditForm
            lead={currentLead}
            editedLead={state.editedLead}
            emailError={state.emailError}
            isSaving={state.isSaving}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              className="w-full"
            >
              Edit Lead
            </Button>
            {!state.showConversionForm && (
              <Button
                onClick={() => setShowConversionForm(true)}
                className="w-full"
              >
                Convert Lead
              </Button>
            )}
          </div>
        )}

        {state.showConversionForm && (
          <div className="pt-6 border-t border-gray-200">
            <OpportunityConversionForm
              opportunityData={state.opportunityData}
              isConverting={state.isConverting}
              onDataChange={setOpportunityData}
              onConvert={handleConvertToOpportunity}
              onCancel={() => setShowConversionForm(false)}
            />
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default LeadDetail;
