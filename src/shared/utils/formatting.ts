// Number and date formatting utilities
import { LOCALE_CONFIG, FORMAT_CONFIG } from '../constants';

export const formatCurrency = (
  amount: number,
  currency = LOCALE_CONFIG.DEFAULT_CURRENCY
): string => {
  return new Intl.NumberFormat(LOCALE_CONFIG.DEFAULT_LOCALE, {
    style: FORMAT_CONFIG.CURRENCY.STYLE,
    currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(LOCALE_CONFIG.DEFAULT_LOCALE, {
    year: FORMAT_CONFIG.DATE.YEAR,
    month: FORMAT_CONFIG.DATE.MONTH,
    day: FORMAT_CONFIG.DATE.DAY,
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat(LOCALE_CONFIG.DEFAULT_LOCALE, {
    year: FORMAT_CONFIG.DATETIME.YEAR,
    month: FORMAT_CONFIG.DATETIME.MONTH,
    day: FORMAT_CONFIG.DATETIME.DAY,
    hour: FORMAT_CONFIG.DATETIME.HOUR,
    minute: FORMAT_CONFIG.DATETIME.MINUTE,
  }).format(date);
};

export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat(LOCALE_CONFIG.DEFAULT_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat(LOCALE_CONFIG.DEFAULT_LOCALE, {
    style: FORMAT_CONFIG.PERCENTAGE.STYLE,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};
