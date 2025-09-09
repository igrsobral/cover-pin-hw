// Re-export shared types that are commonly used in opportunities feature
export type { Opportunity, OpportunityStage } from '../../shared/types';

// Opportunity-specific types (if any additional ones are needed)
export interface OpportunityFormData {
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
}

export interface OpportunityUpdateData {
  stage?: string;
  amount?: number;
  accountName?: string;
}
