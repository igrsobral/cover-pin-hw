export const APP_CONFIG = {
  NAME: 'Mini Seller Console',
  VERSION: '1.0.0',
  DESCRIPTION: 'A lightweight React-based console for sales teams',
} as const;

export const STORAGE_KEYS = {
  LEAD_FILTERS: 'leadFilters',
  LEAD_SORT: 'leadSort',
  OPPORTUNITY_FILTERS: 'opportunityFilters',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
} as const;

export const DEFAULT_FILTERS = {
  LEADS: {
    search: '',
    status: 'all' as const,
  },
  OPPORTUNITIES: {
    search: '',
    stage: 'all' as const,
  },
} as const;

export const DEFAULT_SORT = {
  LEADS: {
    field: 'score' as const,
    direction: 'desc' as const,
  },
  OPPORTUNITIES: {
    field: 'amount' as const,
    direction: 'desc' as const,
  },
} as const;

export const FEATURE_FLAGS = {
  ENABLE_LEAD_CONVERSION: true,
  ENABLE_BULK_OPERATIONS: false,
  ENABLE_ADVANCED_FILTERS: false,
  ENABLE_EXPORT: false,
  ENABLE_NOTIFICATIONS: false,
} as const;

export const PERFORMANCE_CONFIG = {
  MAX_LEADS_DISPLAY: 100,
  VIRTUAL_SCROLL_THRESHOLD: 50,
  SEARCH_DEBOUNCE: 300,
  AUTO_SAVE_DELAY: 2000,
} as const;

// Environment-based configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL || '/',
} as const;

export const LOCALE_CONFIG = {
  DEFAULT_LOCALE: 'en-US',
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_TIMEZONE: 'America/New_York',
} as const;

export const FORMAT_CONFIG = {
  CURRENCY: {
    STYLE: 'currency' as const,
    CURRENCY_DISPLAY: 'symbol' as const,
  },
  DATE: {
    YEAR: 'numeric' as const,
    MONTH: 'short' as const,
    DAY: 'numeric' as const,
  },
  DATETIME: {
    YEAR: 'numeric' as const,
    MONTH: 'short' as const,
    DAY: 'numeric' as const,
    HOUR: '2-digit' as const,
    MINUTE: '2-digit' as const,
  },
  PERCENTAGE: {
    STYLE: 'percent' as const,
  },
} as const;
