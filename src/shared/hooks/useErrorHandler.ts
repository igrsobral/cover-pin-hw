import { useCallback, useState } from 'react';
import { ERROR_MESSAGES } from '@constants/errors';

interface ErrorState {
  error: string | null;
  hasError: boolean;
}

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  defaultMessage?: string;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
  });

  const handleError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : options.defaultMessage || ERROR_MESSAGES.GENERIC_ERROR;

      setErrorState({
        error: errorMessage,
        hasError: true,
      });

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }

      return errorMessage;
    },
    [options]
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
    });
  }, []);

  const withErrorHandling = useCallback(
    <T extends unknown[], R>(fn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R | null> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          handleError(error);
          return null;
        }
      };
    },
    [handleError, clearError]
  );

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    handleError,
    clearError,
    withErrorHandling,
  };
};
