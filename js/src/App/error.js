import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI.
    //     return { error: error };
    // }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.error) {
            return (
                <main className="container error-full">
                    <div className="container-fluid flex-column my-3 p-4">
                        <div className="center">
                            <h1>
                                Something went wrong while building the
                                dashboard
                            </h1>
                        </div>
                        <p>
                            Please consider opening an issue here:{" "}
                            <a href="https://github.com/danielfrg/jupyter-flex/issues">
                                github.com/danielfrg/jupyter-flex/issues
                            </a>
                        </p>
                        <p>
                            Include the error details below and an example
                            notebook if possible.
                        </p>
                        <details style={{ whiteSpace: "pre-wrap" }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </details>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
