import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingCount: number;
}

const useGlobalLoading = () => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    loadingCount: 0,
  });
  const loadingIds = useRef(new Set<string>());

  const startLoading = useCallback((id?: string) => {
    const loadingId = id || `loading-${Date.now()}-${Math.random()}`;

    if (!loadingIds.current.has(loadingId)) {
      loadingIds.current.add(loadingId);
      setState((prev) => ({
        isLoading: true,
        loadingCount: prev.loadingCount + 1,
      }));
    }

    return loadingId;
  }, []);

  const stopLoading = useCallback((id: string) => {
    if (loadingIds.current.has(id)) {
      loadingIds.current.delete(id);
      setState((prev) => {
        const newCount = Math.max(0, prev.loadingCount - 1);
        return {
          isLoading: newCount > 0,
          loadingCount: newCount,
        };
      });
    }
  }, []);

  const clearAllLoading = useCallback(() => {
    loadingIds.current.clear();
    setState({ isLoading: false, loadingCount: 0 });
  }, []);

  return {
    isLoading: state.isLoading,
    loadingCount: state.loadingCount,
    startLoading,
    stopLoading,
    clearAllLoading,
  };
};

export default useGlobalLoading;
