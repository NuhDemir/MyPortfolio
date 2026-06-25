import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="err-boundary" role="alert">
          <div className="err-boundary__inner">
            <h3>Bir sey ters gitti</h3>
            <p>Bu bolum yuklenirken bir hata olustu.</p>
            <button
              type="button"
              className="err-boundary__retry"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
