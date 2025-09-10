export type { Lead, LeadFilters, LeadSource, LeadStatus } from '@shared/types';

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  source: string;
}

export interface LeadUpdateData {
  status?: string;
  email?: string;
}

export interface LeadConversionData {
  opportunityName: string;
  stage: string;
  amount?: number;
}
