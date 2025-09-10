import { useCallback, useState } from 'react';

import { useErrorHandler } from './useErrorHandler';

interface UseOptimisticUpdateOptions<T> {
  onError?: (error: Error) => void;
  onSuccess?: (result: T) => void;
}

export const useOptimisticUpdate = <T, K extends string | number>(
  options: UseOptimisticUpdateOptions<T> = {}
) => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<K, T>>(
    new Map()
  );
  const { handleError } = useErrorHandler({ onError: options.onError });

  const performOptimisticUpdate = useCallback(
    async (
      key: K,
      optimisticValue: T,
      asyncOperation: () => Promise<T>
    ): Promise<T | null> => {
      setOptimisticUpdates((prev) => new Map(prev).set(key, optimisticValue));

      try {
        const result = await asyncOperation();

        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });

        handleError(error);
        return null;
      }
    },
    [handleError, options]
  );

  const getOptimisticValue = useCallback(
    (key: K, originalValue: T): T => {
      return optimisticUpdates.get(key) || originalValue;
    },
    [optimisticUpdates]
  );

  const clearOptimisticUpdates = useCallback(() => {
    setOptimisticUpdates(new Map());
  }, []);

  const hasOptimisticUpdate = useCallback(
    (key: K): boolean => {
      return optimisticUpdates.has(key);
    },
    [optimisticUpdates]
  );

  return {
    performOptimisticUpdate,
    getOptimisticValue,
    clearOptimisticUpdates,
    hasOptimisticUpdate,
    optimisticUpdates: optimisticUpdates,
  };
};
