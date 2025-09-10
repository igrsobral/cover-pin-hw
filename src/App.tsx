import { Toaster } from 'sonner';

import ErrorBoundary from './shared/components/ErrorBoundary';
import { AppLayout } from './shared/components/layout';

const App = () => {
  return (
    <ErrorBoundary>
      <AppLayout />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
};

export default App;
