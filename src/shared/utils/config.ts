import { ENV_CONFIG, FEATURE_FLAGS, PERFORMANCE_CONFIG } from '../constants';

export const getConfig = () => {
  return {
    ...ENV_CONFIG,
    features: FEATURE_FLAGS,
    performance: PERFORMANCE_CONFIG,
  };
};

export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS
): boolean => {
  return FEATURE_FLAGS[feature];
};

export const getPerformanceConfig = () => {
  return PERFORMANCE_CONFIG;
};

export const isDevelopment = (): boolean => {
  return ENV_CONFIG.IS_DEVELOPMENT;
};

export const isProduction = (): boolean => {
  return ENV_CONFIG.IS_PRODUCTION;
};

export const getBaseUrl = (): string => {
  return ENV_CONFIG.BASE_URL;
};
