import ErrorBoundary from './shared/components/ErrorBoundary';
import { AppLayout } from './shared/components/layout';

const App = () => {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
};

export default App;
