import { describe, it, expect } from 'vitest';

import { BREAKPOINTS } from '../../constants/responsive';
import { getViewportInfo, isBreakpoint } from '../responsive';

describe('responsive utilities', () => {
  describe('getViewportInfo', () => {
    it('should return mobile viewport info for width < 768px', () => {
      // given
      const width = 500;
      const height = 800;

      // when
      const result = getViewportInfo(width, height);

      // then
      expect(result).toEqual({
        width: 500,
        height: 800,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        currentBreakpoint: 'mobile',
        layoutType: 'cards',
      });
    });

    it('should return tablet viewport info for width between 768px and 1024px', () => {
      // given
      const width = 900;
      const height = 600;

      // when
      const result = getViewportInfo(width, height);

      // then
      expect(result).toEqual({
        width: 900,
        height: 600,
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        currentBreakpoint: 'tablet',
        layoutType: 'table',
      });
    });

    it('should return desktop viewport info for width >= 1024px', () => {
      // given
      const width = 1200;
      const height = 800;

      // when
      const result = getViewportInfo(width, height);

      // then
      expect(result).toEqual({
        width: 1200,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        currentBreakpoint: 'desktop',
        layoutType: 'table',
      });
    });

    it('should handle edge case at mobile breakpoint', () => {
      // given
      const width = BREAKPOINTS.mobile;
      const height = 600;

      // when
      const result = getViewportInfo(width, height);

      // then
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
    });

    it('should handle edge case at tablet breakpoint', () => {
      // given
      const width = BREAKPOINTS.tablet;
      const height = 600;

      // when
      const result = getViewportInfo(width, height);

      // then
      expect(result.isDesktop).toBe(true);
      expect(result.isTablet).toBe(false);
    });
  });

  describe('isBreakpoint', () => {
    it('should correctly identify mobile breakpoint', () => {
      // given / when / then
      expect(isBreakpoint(500, 'mobile')).toBe(true);
      expect(isBreakpoint(768, 'mobile')).toBe(false);
      expect(isBreakpoint(1000, 'mobile')).toBe(false);
    });

    it('should correctly identify tablet breakpoint', () => {
      // given / when / then
      expect(isBreakpoint(500, 'tablet')).toBe(false);
      expect(isBreakpoint(800, 'tablet')).toBe(true);
      expect(isBreakpoint(1024, 'tablet')).toBe(false);
      expect(isBreakpoint(1200, 'tablet')).toBe(false);
    });

    it('should correctly identify desktop breakpoint', () => {
      // given / when / then
      expect(isBreakpoint(500, 'desktop')).toBe(false);
      expect(isBreakpoint(800, 'desktop')).toBe(false);
      expect(isBreakpoint(1024, 'desktop')).toBe(true);
      expect(isBreakpoint(1200, 'desktop')).toBe(true);
    });
  });
});
