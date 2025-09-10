import { useState, useEffect, useCallback } from 'react';

import { RESPONSIVE_CONFIG, type ViewportInfo } from '../constants/responsive';
import { debounce } from '../utils/performance';
import { getViewportInfo } from '../utils/responsive';

export const useViewport = (): ViewportInfo => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>(() => {
    if (typeof window !== 'undefined') {
      return getViewportInfo(window.innerWidth, window.innerHeight);
    }
    return getViewportInfo(1024, 768);
  });

  const updateViewport = useCallback(() => {
    if (typeof window !== 'undefined') {
      const newViewportInfo = getViewportInfo(
        window.innerWidth,
        window.innerHeight
      );
      setViewportInfo(newViewportInfo);
    }
  }, []);

  const debouncedUpdateViewport = useCallback(
    debounce(updateViewport, RESPONSIVE_CONFIG.debounceDelay),
    [updateViewport]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateViewport();

    window.addEventListener('resize', debouncedUpdateViewport);
    window.addEventListener('orientationchange', debouncedUpdateViewport);

    return () => {
      window.removeEventListener('resize', debouncedUpdateViewport);
      window.removeEventListener('orientationchange', debouncedUpdateViewport);
    };
  }, [debouncedUpdateViewport, updateViewport]);

  return viewportInfo;
};
