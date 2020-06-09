var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var rules = [
    {
        test: /\.s?[ac]ss$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
        ],
    },
    {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
    },
    // required to load font-awesome
    {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/font-woff",
            },
        },
    },
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/font-woff",
            },
        },
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/octet-stream",
            },
        },
    },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "image/svg+xml",
            },
        },
    },
];

var distRoot = path.resolve(
    __dirname,
    "..",
    "share",
    "jupyter",
    "voila",
    "templates",
    "flex",
    "static",
    "dist"
);

module.exports = [
    {
        entry: [path.resolve(__dirname, "src", "FlexRenderer.js")],
        output: {
            filename: "FlexRenderer.js",
            path: distRoot,
        },
        module: { rules: rules },
        mode: "development",
        devtool: "source-map",
        plugins: [
            new MiniCssExtractPlugin({
                filename: "FlexRenderer.css",
            }),
        ],
    },
];
