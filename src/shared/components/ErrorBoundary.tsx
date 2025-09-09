import { Component, type ReactNode } from 'react';

import { ERROR_MESSAGES } from '../constants';

import { ErrorMessage } from './ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error(ERROR_MESSAGES.ERROR_BOUNDARY_MESSAGE, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full">
            <ErrorMessage
              message={
                this.state.error?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG
              }
              onRetry={this.handleRetry}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
