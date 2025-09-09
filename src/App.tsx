import { AppLayout } from './shared/components/layout';
import ErrorBoundary from './shared/components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
};

export default App;
