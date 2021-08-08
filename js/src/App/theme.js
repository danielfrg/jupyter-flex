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
            default: "#fff",
        },
        text: {
            primary: "#000",
        },
        primary: {
            light: "#757ce8",
            main: "#FFF",
            dark: "#002884",
            contrastText: "#000",
        },
        secondary: {
            light: "#ff7961",
            main: "#f44336",
            dark: "#ba000d",
            contrastText: "#000",
        },
    },
});

export default theme;
