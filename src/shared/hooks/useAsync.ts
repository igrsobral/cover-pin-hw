import { useState, useEffect, useCallback } from 'react';
import { ERROR_MESSAGES } from '../constants';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
}

const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = [],
  options: UseAsyncOptions = { immediate: true }
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR;
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, dependencies);

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
