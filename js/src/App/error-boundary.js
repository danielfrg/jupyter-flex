import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
    errorBoundary: {
        margin: "50px auto",
    },
    title: {
        marginBottom: 20,
        fontSize: 32,
    },
    details: {
        marginTop: 20,
        color: "#ff0000",
    },
});

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
        const { classes } = this.props;

        if (this.state.error) {
            return (
                <Container maxWidth="md" className={classes.errorBoundary}>
                    <Typography
                        component="h1"
                        className={classes.title}
                        align="center"
                    >
                        Something went wrong while building the dashboard
                    </Typography>
                    <Typography>
                        Please consider opening an issue here:{" "}
                        <a href="https://github.com/danielfrg/jupyter-flex/issues">
                            github.com/danielfrg/jupyter-flex/issues
                        </a>
                    </Typography>
                    <Typography>
                        Include the error details below and an example notebook
                        if possible.
                    </Typography>
                    <Typography
                        className={classes.details}
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </Typography>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default withStyles(styles, { withTheme: true })(ErrorBoundary);
