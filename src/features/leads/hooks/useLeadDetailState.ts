import { useEffect, useReducer } from 'react';

import { ERROR_MESSAGES } from '@shared/constants';
import { convertLeadToOpportunity } from '@shared/data';
import type { Lead } from '@shared/types';
import { showToast, validateEmail } from '@shared/utils';

import {
  initialState,
  leadDetailReducer,
  type LeadDetailState,
} from './leadDetailReducer';

export const useLeadDetailState = (
  lead: Lead | null,
  onLeadUpdate: (id: string, updates: Partial<Lead>) => Promise<void>,
  onOpportunityCreated?: () => void,
  onClose?: () => void
) => {
  const [state, dispatch] = useReducer(leadDetailReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'RESET_STATE', lead });
  }, [lead]);

  const handleFieldChange = (field: keyof Lead, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });

    if (field === 'email') {
      if (value && !validateEmail(value)) {
        dispatch({
          type: 'SET_EMAIL_ERROR',
          emailError: ERROR_MESSAGES.INVALID_EMAIL,
        });
      } else {
        dispatch({ type: 'SET_EMAIL_ERROR', emailError: null });
      }
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    if (state.editedLead.email && !validateEmail(state.editedLead.email)) {
      dispatch({
        type: 'SET_EMAIL_ERROR',
        emailError: ERROR_MESSAGES.INVALID_EMAIL,
      });
      return;
    }

    dispatch({ type: 'SET_SAVING', isSaving: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      await onLeadUpdate(lead.id, state.editedLead);
      dispatch({ type: 'SAVE_SUCCESS' });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.UPDATE_LEAD_FAILED;
      dispatch({ type: 'SET_ERROR', error: errorMessage });
      showToast.error(`Failed to update lead: ${errorMessage}`);
    } finally {
      dispatch({ type: 'SET_SAVING', isSaving: false });
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'CANCEL_EDITING' });
  };

  const handleConvertToOpportunity = async () => {
    if (!lead) return;

    dispatch({ type: 'SET_CONVERTING', isConverting: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      await convertLeadToOpportunity(lead.id, {
        name: state.opportunityData.name,
        stage: state.opportunityData.stage,
        amount: state.opportunityData.amount
          ? parseFloat(state.opportunityData.amount)
          : undefined,
        accountName: state.opportunityData.accountName,
      });

      showToast.success(`Successfully converted ${lead.name} to opportunity`);
      dispatch({ type: 'SET_SHOW_CONVERSION_FORM', show: false });
      onOpportunityCreated?.();
      onClose?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.CONVERT_LEAD_FAILED;
      dispatch({ type: 'SET_ERROR', error: errorMessage });
      showToast.error(`Failed to convert lead: ${errorMessage}`);
    } finally {
      dispatch({ type: 'SET_CONVERTING', isConverting: false });
    }
  };

  const setEditing = (isEditing: boolean) => {
    dispatch({ type: 'SET_EDITING', isEditing });
  };

  const setShowConversionForm = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_CONVERSION_FORM', show });
  };

  const setOpportunityData = (
    data: Partial<LeadDetailState['opportunityData']>
  ) => {
    dispatch({ type: 'SET_OPPORTUNITY_DATA', data });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', error: null });
  };

  return {
    state,
    handlers: {
      handleFieldChange,
      handleSave,
      handleCancel,
      handleConvertToOpportunity,
      setEditing,
      setShowConversionForm,
      setOpportunityData,
      clearError,
    },
  };
};
