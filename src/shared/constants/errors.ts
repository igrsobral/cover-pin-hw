export const ERROR_MESSAGES = {
  // Network and API errors
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  SIMULATED_ERROR: 'Simulated network error',
  FETCH_LEADS_FAILED: 'Failed to fetch leads',
  FETCH_OPPORTUNITIES_FAILED: 'Failed to fetch opportunities',
  UPDATE_LEAD_FAILED: 'Failed to update lead',
  CREATE_OPPORTUNITY_FAILED: 'Failed to create opportunity',
  CONVERT_LEAD_FAILED: 'Failed to convert lead',

  // Validation errors
  INVALID_EMAIL: 'Please enter a valid email address',
  REQUIRED_FIELD: 'This field is required',
  INVALID_SCORE: 'Score must be between 0 and 100',

  // Data errors
  LEAD_NOT_FOUND: 'Lead not found',
  OPPORTUNITY_NOT_FOUND: 'Opportunity not found',

  // Generic errors
  GENERIC_ERROR: 'An error occurred',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',

  // Component errors
  ERROR_BOUNDARY_MESSAGE: 'ErrorBoundary caught an error:',
} as const;

export const SUCCESS_MESSAGES = {
  LEAD_UPDATED: 'Lead updated successfully',
  OPPORTUNITY_CREATED: 'Opportunity created successfully',
  LEAD_CONVERTED: 'Lead converted to opportunity successfully',
} as const;
