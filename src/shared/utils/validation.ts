const MIN_SCORE = 0;
const MAX_SCORE = 100;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateScore = (score: number): boolean => {
  return score >= MIN_SCORE && score <= MAX_SCORE;
};
