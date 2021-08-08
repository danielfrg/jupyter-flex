import React from "react";

import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI
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
                <Container maxWidth="md" className="error-boundary">
                    <Typography align="center">
                        <h1>
                            Something went wrong while building the dashboard
                        </h1>
                    </Typography>
                    <Typography>
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
                            <p className="details">
                                {this.state.error &&
                                    this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </p>
                        </details>
                    </Typography>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
