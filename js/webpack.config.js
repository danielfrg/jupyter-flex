var path = require("path");
const webpack = require("webpack");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const pythonPkgStatic = path.resolve(
    __dirname,
    "..",
    "python",
    "share",
    "jupyter",
    "nbconvert",
    "templates",
    "flex",
    "static"
);

const extractPlugin = {
    loader: MiniCssExtractPlugin.loader,
};

module.exports = (env, argv) => {
    const IS_PRODUCTION = argv.mode === "production";

    // Build the UMD library
    const config_lib = {
        entry: path.resolve(__dirname, "src", "index.js"),
        output: {
            path: path.resolve(__dirname, "lib"),
            filename: "index.js",
            library: {
                name: "jupyter-flex",
                type: "umd",
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                    use: ["null-loader"],
                },
            ],
        },
        plugins: [
            // Extract CSS
            new MiniCssExtractPlugin({
                filename: "styles.css",
            }),
            // Fix for underlying deps
            new webpack.ProvidePlugin({
                process: "process/browser.js",
            }),
        ],
        resolve: {
            fallback: { path: false },
        },
        mode: "development",
        optimization: {
            minimize: false,
        },
        externals: [
            "@danielfrg/illusionist",
            /^@jupyter-widgets\/.+$/,
            /^@material-ui\/.+$/,
            /^@nteract\/.+$/,
            "papaparse",
            "react",
            "react-dom",
            "react-router-dom",
            "lodash",
        ],
    };

    // Build the bundle
    const config_bundle = {
        entry: path.resolve(__dirname, "src", "embed.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "jupyter-flex-embed.js",
            publicPath: "",
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [extractPlugin, "css-loader", "sass-loader"],
                },
                // Bundle Jupyter Widgets and Font Awesome in the CSS
                {
                    test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                    loader: require.resolve("url-loader"),
                },
            ],
        },
        plugins: [
            // Extract CSS
            new MiniCssExtractPlugin({
                filename: "jupyter-flex-embed.css",
            }),
            // Fix for underlying deps
            new webpack.ProvidePlugin({
                process: "process/browser.js",
            }),
            // Copy the output to the Python package
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        copy: [
                            {
                                source: "./dist/*.*",
                                destination: pythonPkgStatic,
                            },
                        ],
                    },
                },
            }),
            // new BundleAnalyzerPlugin(),
        ],
        resolve: {
            fallback: { path: false },
        },
        mode: IS_PRODUCTION ? "production" : "development",
        optimization: {
            minimize: true,
        },
        devtool: "source-map",
    };

    let config = [];
    if (IS_PRODUCTION) {
        config.push(config_bundle);
        config.push(config_lib);
    } else {
        config.push(config_bundle);
    }

    return config;
};
