export const API_ENDPOINTS = {
  LEADS: '/data/leads.json',
  OPPORTUNITIES: '/data/opportunities.json',
} as const;

export const SIMULATION_CONFIG = {
  DELAY: {
    MIN: 300,
    MAX: 1000,
  },
  ERROR_RATE: 0.1,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const REQUEST_TIMEOUT = 30000; // 30 seconds
