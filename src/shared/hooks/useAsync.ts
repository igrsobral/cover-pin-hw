import { useCallback, useEffect, useRef, useState } from 'react';

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
  options: UseAsyncOptions<T> = { immediate: true }
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const asyncFunctionRef = useRef(asyncFunction);
  const optionsRef = useRef(options);
  const hasExecutedRef = useRef(false);

  asyncFunctionRef.current = asyncFunction;
  optionsRef.current = options;

  const execute = useCallback(async (): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunctionRef.current();
      setState({ data, loading: false, error: null });

      if (optionsRef.current.onSuccess) {
        optionsRef.current.onSuccess(data);
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR;
      setState({ data: null, loading: false, error: errorMessage });

      if (optionsRef.current.onError && error instanceof Error) {
        optionsRef.current.onError(error);
      }

      return null;
    }
  }, []);

  useEffect(() => {
    if (options.immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
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
