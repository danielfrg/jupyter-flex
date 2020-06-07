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
        use:
            "url-loader?limit=10000&mimetype=application/font-woff&publicPath=/voila/static/",
    },
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use:
            "url-loader?limit=10000&mimetype=application/font-woff&publicPath=/voila/static/",
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use:
            "url-loader?limit=10000&mimetype=application/octet-stream&publicPath=/voila/static/",
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader&publicPath=/voila/static/",
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use:
            "url-loader?limit=10000&mimetype=image/svg+xml&publicPath=/voila/static/",
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
    "static"
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
