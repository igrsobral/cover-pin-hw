import type { ReactNode } from 'react';

import { useViewport } from '../hooks/useViewport';

import { ViewportContext } from './ViewportContextDefinition';

export interface ViewportProviderProps {
  children: ReactNode;
}

export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const viewportInfo = useViewport();

  return (
    <ViewportContext.Provider value={viewportInfo}>
      {children}
    </ViewportContext.Provider>
  );
};
