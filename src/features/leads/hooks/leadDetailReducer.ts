import type { Lead, OpportunityStage } from '@shared/types';

export interface LeadDetailState {
  editedLead: Partial<Lead>;
  isEditing: boolean;
  isSaving: boolean;
  isConverting: boolean;
  error: string | null;
  emailError: string | null;
  showConversionForm: boolean;
  opportunityData: {
    name: string;
    stage: OpportunityStage;
    amount: string;
    accountName: string;
  };
}

export type LeadDetailAction =
  | { type: 'SET_FIELD'; field: keyof Lead; value: string }
  | { type: 'SET_EDITING'; isEditing: boolean }
  | { type: 'SET_SAVING'; isSaving: boolean }
  | { type: 'SET_CONVERTING'; isConverting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_EMAIL_ERROR'; emailError: string | null }
  | { type: 'SET_SHOW_CONVERSION_FORM'; show: boolean }
  | {
      type: 'SET_OPPORTUNITY_DATA';
      data: Partial<LeadDetailState['opportunityData']>;
    }
  | { type: 'RESET_STATE'; lead: Lead | null }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_SUCCESS' };

export const initialState: LeadDetailState = {
  editedLead: {},
  isEditing: false,
  isSaving: false,
  isConverting: false,
  error: null,
  emailError: null,
  showConversionForm: false,
  opportunityData: {
    name: '',
    stage: 'prospecting',
    amount: '',
    accountName: '',
  },
};

export const leadDetailReducer = (
  state: LeadDetailState,
  action: LeadDetailAction
): LeadDetailState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        editedLead: { ...state.editedLead, [action.field]: action.value },
      };
    case 'SET_EDITING':
      return { ...state, isEditing: action.isEditing };
    case 'SET_SAVING':
      return { ...state, isSaving: action.isSaving };
    case 'SET_CONVERTING':
      return { ...state, isConverting: action.isConverting };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.emailError };
    case 'SET_SHOW_CONVERSION_FORM':
      return { ...state, showConversionForm: action.show };
    case 'SET_OPPORTUNITY_DATA':
      return {
        ...state,
        opportunityData: { ...state.opportunityData, ...action.data },
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        opportunityData: action.lead
          ? {
              name: `${action.lead.company} - ${action.lead.name}`,
              stage: 'prospecting',
              amount: '',
              accountName: action.lead.company,
            }
          : initialState.opportunityData,
      };
    case 'CANCEL_EDITING':
      return {
        ...state,
        editedLead: {},
        isEditing: false,
        emailError: null,
        error: null,
      };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        isEditing: false,
        editedLead: {},
      };
    default:
      return state;
  }
};
