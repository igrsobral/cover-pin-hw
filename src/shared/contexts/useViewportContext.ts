import { useContext } from 'react';

import { ViewportContext } from './ViewportContextDefinition';

import type { ViewportInfo } from '../constants/responsive';

export const useViewportContext = (): ViewportInfo => {
  const context = useContext(ViewportContext);

  if (context === undefined) {
    throw new Error(
      'useViewportContext must be used within a ViewportProvider'
    );
  }

  return context;
};
