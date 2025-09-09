// Opportunities Feature - Main Export
export * from './components';
export * from './hooks';

// Re-export for convenience
export { default as OpportunitiesPage } from './components/OpportunitiesPage';
export { default as useOpportunities } from './hooks/useOpportunities';

// Export types separately to avoid conflicts
export type { OpportunityFormData, OpportunityUpdateData } from './types';
