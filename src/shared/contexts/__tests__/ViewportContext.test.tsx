import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useViewportContext } from '../useViewportContext';
import { ViewportProvider } from '../ViewportContext';

vi.mock('../../hooks/useViewport', () => ({
  useViewport: () => ({
    width: 1024,
    height: 768,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    currentBreakpoint: 'desktop',
    layoutType: 'table',
  }),
}));

const TestComponent = () => {
  const viewport = useViewportContext();
  return (
    <div>
      <span data-testid="width">{viewport.width}</span>
      <span data-testid="height">{viewport.height}</span>
      <span data-testid="breakpoint">{viewport.currentBreakpoint}</span>
      <span data-testid="layout">{viewport.layoutType}</span>
      <span data-testid="is-mobile">{viewport.isMobile.toString()}</span>
    </div>
  );
};

describe('ViewportContext', () => {
  it('should provide viewport info to children', () => {
    render(
      <ViewportProvider>
        <TestComponent />
      </ViewportProvider>
    );

    expect(screen.getByTestId('width')).toHaveTextContent('1024');
    expect(screen.getByTestId('height')).toHaveTextContent('768');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('desktop');
    expect(screen.getByTestId('layout')).toHaveTextContent('table');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
  });

  it('should throw error when useViewportContext is used outside provider', () => {
    const ConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useViewportContext must be used within a ViewportProvider');

    ConsoleError.mockRestore();
  });
});
