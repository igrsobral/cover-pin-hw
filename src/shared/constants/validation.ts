// Validation Constants

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SCORE: {
    MIN: 0,
    MAX: 100,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  COMPANY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  OPPORTUNITY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  ACCOUNT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
} as const;

export const FIELD_LIMITS = {
  SEARCH_QUERY: {
    MIN_LENGTH: 0,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  NOTES: {
    MAX_LENGTH: 1000,
  },
} as const;
