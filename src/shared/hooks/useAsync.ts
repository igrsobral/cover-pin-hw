import { useState, useEffect, useCallback } from 'react';

import { ERROR_MESSAGES } from '../constants';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = [],
  options: UseAsyncOptions<T> = { immediate: true }
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR;
      setState({ data: null, loading: false, error: errorMessage });

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }

      return null;
    }
  }, [asyncFunction, ...dependencies]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

export default useAsync;
