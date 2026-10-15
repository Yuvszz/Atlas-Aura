import React from "react";

class ErrorBoundary
  extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false,
    };

  }

  static getDerivedStateFromError() {

    return {
      hasError: true,
    };

  }

  componentDidCatch(
    error,
    info
  ) {

    console.error(
      "Atlas Aura Error:",
      error,
      info
    );

  }

  render() {

    if (this.state.hasError) {

      return (

        <div className="error-page">

          <div className="error-card">

            <span>⚠️</span>

            <h1>
              Something went wrong
            </h1>

            <p>
              We couldn't load this
              page correctly.
              Please try again.
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Reload Page
            </button>

          </div>

        </div>

      );

    }

    return this.props.children;
  }
}

export default ErrorBoundary;