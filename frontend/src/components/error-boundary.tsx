import { Component, ErrorInfo, type ReactNode } from 'react';
import { ServerErrorPage } from '../pages/server-error';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Dashboard boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <ServerErrorPage
          error={this.state.error || new Error('Unknown Error')}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
