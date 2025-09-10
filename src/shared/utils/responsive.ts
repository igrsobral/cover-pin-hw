import {
  BREAKPOINTS,
  type BreakpointKey,
  type LayoutType,
  type ViewportInfo,
} from '../constants/responsive';

export const getViewportInfo = (
  width: number,
  height: number
): ViewportInfo => {
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  let currentBreakpoint: BreakpointKey;
  let layoutType: LayoutType;

  if (isMobile) {
    currentBreakpoint = 'mobile';
    layoutType = 'cards';
  } else if (isTablet) {
    currentBreakpoint = 'tablet';
    layoutType = 'table';
  } else {
    currentBreakpoint = 'desktop';
    layoutType = 'table';
  }

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    layoutType,
  };
};

export const isBreakpoint = (
  width: number,
  breakpoint: BreakpointKey
): boolean => {
  switch (breakpoint) {
    case 'mobile':
      return width < BREAKPOINTS.mobile;
    case 'tablet':
      return width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    case 'desktop':
      return width >= BREAKPOINTS.tablet;
    default:
      return false;
  }
};
