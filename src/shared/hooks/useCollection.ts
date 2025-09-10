import { useMemo, useCallback, useState } from 'react';

import { useDebounce } from './useDebounce';

interface UseCollectionOptions<T> {
  searchFields?: (keyof T)[];
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T) => boolean;
  debounceDelay?: number;
}

interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export const useCollection = <T extends Record<string, any>>(
  items: T[],
  options: UseCollectionOptions<T> = {}
) => {
  const {
    searchFields = [],
    sortField,
    sortDirection = 'asc',
    filterFn,
    debounceDelay = 300,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    sortField ? { field: sortField, direction: sortDirection } : null
  );

  const { debouncedCallback: updateDebouncedSearch } = useDebounce(
    (term: string) => setDebouncedSearchTerm(term),
    debounceDelay
  );

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      updateDebouncedSearch(term);
    },
    [updateDebouncedSearch]
  );

  const processedItems = useMemo(() => {
    let result = [...items];

    if (filterFn) {
      result = result.filter(filterFn);
    }

    if (debouncedSearchTerm && searchFields.length > 0) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue === bValue) return 0;

        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [items, debouncedSearchTerm, searchFields, sortConfig, filterFn]);

  const handleSort = useCallback((field: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const reset = useCallback(() => {
    clearSearch();
    clearSort();
  }, [clearSearch, clearSort]);

  const paginate = useCallback(
    (page: number, pageSize: number) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return processedItems.slice(startIndex, endIndex);
    },
    [processedItems]
  );

  const getTotalPages = useCallback(
    (pageSize: number) => {
      return Math.ceil(processedItems.length / pageSize);
    },
    [processedItems.length]
  );

  return {
    // Processed data
    items: processedItems,
    totalCount: processedItems.length,
    originalCount: items.length,

    // Search
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm: handleSearchChange,
    clearSearch,

    // Sorting
    sortConfig,
    handleSort,
    clearSort,

    // Utilities
    reset,
    paginate,
    getTotalPages,

    // State indicators
    isSearching: searchTerm !== debouncedSearchTerm,
    hasActiveFilters: !!debouncedSearchTerm || !!sortConfig,
  };
};
