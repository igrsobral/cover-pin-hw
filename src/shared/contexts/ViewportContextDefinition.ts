import { createContext } from 'react';

import type { ViewportInfo } from '../constants/responsive';

export const ViewportContext = createContext<ViewportInfo | undefined>(
  undefined
);
