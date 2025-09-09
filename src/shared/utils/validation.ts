import { VALIDATION_RULES, FIELD_LIMITS } from '../constants';

export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateScore = (score: number): boolean => {
  return (
    score >= VALIDATION_RULES.SCORE.MIN && score <= VALIDATION_RULES.SCORE.MAX
  );
};
export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= VALIDATION_RULES.NAME.MIN_LENGTH &&
    trimmed.length <= VALIDATION_RULES.NAME.MAX_LENGTH
  );
};

export const validateCompany = (company: string): boolean => {
  const trimmed = company.trim();
  return (
    trimmed.length >= VALIDATION_RULES.COMPANY.MIN_LENGTH &&
    trimmed.length <= VALIDATION_RULES.COMPANY.MAX_LENGTH
  );
};

export const validateOpportunityName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= VALIDATION_RULES.OPPORTUNITY_NAME.MIN_LENGTH &&
    trimmed.length <= VALIDATION_RULES.OPPORTUNITY_NAME.MAX_LENGTH
  );
};

export const validateAccountName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= VALIDATION_RULES.ACCOUNT_NAME.MIN_LENGTH &&
    trimmed.length <= VALIDATION_RULES.ACCOUNT_NAME.MAX_LENGTH
  );
};

export const validateSearchQuery = (query: string): boolean => {
  return (
    query.length >= FIELD_LIMITS.SEARCH_QUERY.MIN_LENGTH &&
    query.length <= FIELD_LIMITS.SEARCH_QUERY.MAX_LENGTH
  );
};
