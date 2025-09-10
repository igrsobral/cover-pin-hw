export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'linkedin'
  | 'conference'
  | 'cold_call';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: LeadSource;
  score: number;
  status: LeadStatus;
}

export type OpportunityStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId?: string;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
}
