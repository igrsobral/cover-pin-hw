// UI Constants and Configuration

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLIDE_OVER: 300,
} as const;

export const UI_BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 10,
  MODAL: 50,
  SLIDE_OVER: 40,
  TOOLTIP: 30,
  OVERLAY: 20,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const STATUS_COLORS = {
  NEW: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  CONTACTED: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  QUALIFIED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  UNQUALIFIED: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
} as const;

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  SUCCESS: 'success',
} as const;
