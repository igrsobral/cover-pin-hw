import { useCallback, useState } from 'react';

import { useErrorHandler } from './useErrorHandler';
import { useOptimisticUpdate } from './useOptimisticUpdate';

interface CrudOperations<T, K extends string | number> {
  create: (data: Omit<T, 'id'>) => Promise<T | null>;
  read: (id: K) => Promise<T | null>;
  update: (id: K, data: Partial<T>) => Promise<T | null>;
  delete: (id: K) => Promise<boolean>;
}

interface UseCrudOperationsOptions<T> {
  onSuccess?: (operation: string, data: T) => void;
  onError?: (operation: string, error: Error) => void;
}

export const useCrudOperations = <
  T extends { id: K },
  K extends string | number,
>(
  operations: CrudOperations<T, K>,
  options: UseCrudOperationsOptions<T> = {}
) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const { handleError } = useErrorHandler({
    onError: (error) => options.onError?.('generic', error),
  });

  const { performOptimisticUpdate, getOptimisticValue, hasOptimisticUpdate } =
    useOptimisticUpdate<T, K>({
      onSuccess: (data) => options.onSuccess?.('update', data),
      onError: (error) => options.onError?.('update', error),
    });

  const setOperationLoading = useCallback(
    (operation: string, isLoading: boolean) => {
      setLoading((prev) => ({ ...prev, [operation]: isLoading }));
    },
    []
  );

  const create = useCallback(
    async (data: Omit<T, 'id'>): Promise<T | null> => {
      setOperationLoading('create', true);

      try {
        const result = await operations.create(data);
        if (result && options.onSuccess) {
          options.onSuccess('create', result);
        }
        return result;
      } catch (error) {
        handleError(error);
        if (options.onError && error instanceof Error) {
          options.onError('create', error);
        }
        return null;
      } finally {
        setOperationLoading('create', false);
      }
    },
    [operations, options, handleError, setOperationLoading]
  );

  const read = useCallback(
    async (id: K): Promise<T | null> => {
      setOperationLoading(`read-${id}`, true);

      try {
        const result = await operations.read(id);
        if (result && options.onSuccess) {
          options.onSuccess('read', result);
        }
        return result;
      } catch (error) {
        handleError(error);
        if (options.onError && error instanceof Error) {
          options.onError('read', error);
        }
        return null;
      } finally {
        setOperationLoading(`read-${id}`, false);
      }
    },
    [operations, options, handleError, setOperationLoading]
  );

  const update = useCallback(
    async (id: K, data: Partial<T>, originalItem?: T): Promise<T | null> => {
      if (originalItem) {
        // Use optimistic update if original item is provided
        const optimisticItem = { ...originalItem, ...data };
        return performOptimisticUpdate(id, optimisticItem, async () => {
          const result = await operations.update(id, data);
          if (!result) throw new Error('Update failed');
          return result;
        });
      } else {
        // Regular update without optimistic UI
        setOperationLoading(`update-${id}`, true);

        try {
          const result = await operations.update(id, data);
          if (result && options.onSuccess) {
            options.onSuccess('update', result);
          }
          return result;
        } catch (error) {
          handleError(error);
          if (options.onError && error instanceof Error) {
            options.onError('update', error);
          }
          return null;
        } finally {
          setOperationLoading(`update-${id}`, false);
        }
      }
    },
    [
      operations,
      options,
      handleError,
      setOperationLoading,
      performOptimisticUpdate,
    ]
  );

  const remove = useCallback(
    async (id: K): Promise<boolean> => {
      setOperationLoading(`delete-${id}`, true);

      try {
        const result = await operations.delete(id);
        if (result && options.onSuccess) {
          // Create a mock item for success callback
          options.onSuccess('delete', { id } as T);
        }
        return result;
      } catch (error) {
        handleError(error);
        if (options.onError && error instanceof Error) {
          options.onError('delete', error);
        }
        return false;
      } finally {
        setOperationLoading(`delete-${id}`, false);
      }
    },
    [operations, options, handleError, setOperationLoading]
  );

  const isLoading = useCallback(
    (operation?: string, id?: K): boolean => {
      if (operation && id) {
        return loading[`${operation}-${id}`] || false;
      }
      if (operation) {
        return loading[operation] || false;
      }
      return Object.values(loading).some(Boolean);
    },
    [loading]
  );

  return {
    create,
    read,
    update,
    delete: remove,
    isLoading,
    getOptimisticValue,
    hasOptimisticUpdate,
  };
};
