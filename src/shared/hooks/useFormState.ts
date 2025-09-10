import { useState, useCallback, useMemo } from 'react';

import { useDebounce } from './useDebounce';

type ValidationRule<T> = (value: T) => string | null;
type ValidationRules<T> = Partial<
  Record<keyof T, ValidationRule<T[keyof T]>[]>
>;

interface UseFormStateOptions<T> {
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceValidation?: number;
}

interface FieldState {
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export const useFormState = <T extends Record<string, any>>(
  initialValues: T,
  options: UseFormStateOptions<T> = {}
) => {
  const {
    validationRules = {},
    validateOnChange = false,
    validateOnBlur = true,
    debounceValidation = 300,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [fieldStates, setFieldStates] = useState<Record<keyof T, FieldState>>(
    () => {
      const states = {} as Record<keyof T, FieldState>;
      Object.keys(initialValues).forEach((key) => {
        states[key as keyof T] = {
          error: null,
          touched: false,
          dirty: false,
        };
      });
      return states;
    }
  );

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | null => {
      if (!validationRules || typeof validationRules !== 'object') return null;

      const rules = (validationRules as any)[field];
      if (!rules || !Array.isArray(rules)) return null;

      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }
      return null;
    },
    [validationRules]
  );

  const { debouncedCallback: debouncedValidateField } = useDebounce(
    (field: keyof T, value: T[keyof T]) => {
      const error = validateField(field, value);
      setFieldStates((prev) => ({
        ...prev,
        [field]: { ...prev[field], error },
      }));
    },
    debounceValidation
  );

  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      setFieldStates((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          dirty: value !== initialValues[field],
        },
      }));

      if (validateOnChange) {
        debouncedValidateField(field, value);
      }
    },
    [initialValues, validateOnChange, debouncedValidateField]
  );

  const setFieldTouched = useCallback(
    (field: keyof T, touched = true) => {
      setFieldStates((prev) => ({
        ...prev,
        [field]: { ...prev[field], touched },
      }));

      if (validateOnBlur && touched) {
        const error = validateField(field, values[field]);
        setFieldStates((prev) => ({
          ...prev,
          [field]: { ...prev[field], error },
        }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], error },
    }));
  }, []);

  const validateAllFields = useCallback((): boolean => {
    let isValid = true;
    const newFieldStates = { ...fieldStates };

    Object.keys(values).forEach((key) => {
      const field = key as keyof T;
      const error = validateField(field, values[field]);
      newFieldStates[field] = {
        ...newFieldStates[field],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });

    setFieldStates(newFieldStates);
    return isValid;
  }, [values, fieldStates, validateField]);

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues
        ? { ...initialValues, ...newValues }
        : initialValues;
      setValues(resetValues);

      const resetFieldStates = {} as Record<keyof T, FieldState>;
      Object.keys(resetValues).forEach((key) => {
        resetFieldStates[key as keyof T] = {
          error: null,
          touched: false,
          dirty: false,
        };
      });
      setFieldStates(resetFieldStates);
    },
    [initialValues]
  );

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (value: T[keyof T]) => setValue(field, value),
      onBlur: () => setFieldTouched(field, true),
      error: fieldStates[field]?.error,
      touched: fieldStates[field]?.touched,
      dirty: fieldStates[field]?.dirty,
    }),
    [values, fieldStates, setValue, setFieldTouched]
  );

  // Computed properties
  const isValid = useMemo(() => {
    return Object.values(fieldStates).every((state) => !state.error);
  }, [fieldStates]);

  const isDirty = useMemo(() => {
    return Object.values(fieldStates).some((state) => state.dirty);
  }, [fieldStates]);

  const hasErrors = useMemo(() => {
    return Object.values(fieldStates).some((state) => state.error);
  }, [fieldStates]);

  const touchedFields = useMemo(() => {
    return Object.entries(fieldStates)
      .filter(([, state]) => state.touched)
      .map(([field]) => field as keyof T);
  }, [fieldStates]);

  return {
    // Values and state
    values,
    fieldStates,

    // Field operations
    setValue,
    setFieldTouched,
    setFieldError,
    getFieldProps,

    // Validation
    validateField,
    validateAllFields,

    // Form operations
    reset,

    // Computed properties
    isValid,
    isDirty,
    hasErrors,
    touchedFields,
  };
};
