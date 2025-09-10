// Utility modules organized by category
export * from './array';
export * from './config';
export * from './formatting';
export * from './object';
export * from './performance';
export * from './responsive';
export * from './string';
export * from './toast';
export * from './validation';

// Re-export commonly used utilities for convenience
export { groupBy, sortBy, unique } from './array';
export {
  getConfig,
  isDevelopment,
  isFeatureEnabled,
  isProduction,
} from './config';
export { formatCurrency, formatDate } from './formatting';
export { isEmpty, omit, pick } from './object';
export { debounce, throttle } from './performance';
export { getViewportInfo, isBreakpoint } from './responsive';
export { capitalizeFirst, truncate } from './string';
export { showToast } from './toast';
export { validateEmail, validateRequired, validateScore } from './validation';
