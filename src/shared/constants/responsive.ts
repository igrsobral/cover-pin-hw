export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

export const RESPONSIVE_CONFIG = {
  breakpoints: BREAKPOINTS,
  layouts: {
    mobile: 'cards' as const,
    tablet: 'table' as const,
    desktop: 'table' as const,
  },
  debounceDelay: 150,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type LayoutType = 'cards' | 'table';

export interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: BreakpointKey;
  layoutType: LayoutType;
}
