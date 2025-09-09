// String manipulation utilities

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (
  str: string,
  length: number,
  suffix = '...'
): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

export const removeExtraSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

export const isEmptyOrWhitespace = (str: string): boolean => {
  return !str || str.trim().length === 0;
};
