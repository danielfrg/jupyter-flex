import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        background: {
            default: "#F8FAFB",
        },
        text: {
            primary: "#333",
        },
        primary: {
            light: "#8bd0ff",
            main: "#549fe0", // Metabase color
            dark: "#0071ae",
            contrastText: "#ffffff",
        },
        secondary: {
            light: "#ffa856",
            main: "#f27726", // Jupyter color
            dark: "#b94800",
            contrastText: "#ffffff",
        },
    },
});

export default theme;
