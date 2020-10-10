var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

const pythonPkgStatic = path.resolve(
    __dirname,
    "..",
    "python",
    "share",
    "jupyter",
    "nbconvert",
    "templates",
    "flex",
    "static",
    "dist"
);

const extractPlugin = {
    loader: MiniCssExtractPlugin.loader,
};

module.exports = (env, argv) => {
    const IS_PRODUCTION = argv.mode === "production";

    const config_lib_css = {
        entry: path.resolve(__dirname, "src", "styles/index.scss"),
        output: {
            path: path.resolve(__dirname, "lib", "styles"),
        },
        module: {
            rules: [
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        IS_PRODUCTION
                            ? extractPlugin
                            : require.resolve("style-loader"),
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        plugins: [
            new FixStyleOnlyEntriesPlugin(),
            new MiniCssExtractPlugin({
                filename: "jupyter-flex.css",
            }),
        ],
        optimization: {
            minimize: false,
        },
        mode: IS_PRODUCTION ? "production" : "development",
        devtool: "source-map",
    };

    // Config to create a bundle of JS and CSS
    const config_dist = {
        entry: path.resolve(__dirname, "src", "embed.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "jupyter-flex-embed.js",
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
                    // use: ["null-loader"],
                },
                // Bundle Jupyter Widgets and Font Awesome in the CSS
                {
                    test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                    loader: require.resolve("url-loader"),
                    // loader: require.resolve("file-loader"),
                    // options: {
                    //     name: "[name].[ext]?[hash]",
                    // outputPath: "assets/",
                    // },
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "jupyter-flex-embed.css",
            }),
            // Copy the output to the Python Package
            new FileManagerPlugin({
                onEnd: {
                    copy: [
                        {
                            source: "./dist/*.*",
                            destination: pythonPkgStatic,
                        },
                    ],
                },
            }),
            // new BundleAnalyzerPlugin(),
        ],
        mode: IS_PRODUCTION ? "production" : "development",
        devtool: "source-map",
    };

    let config = [];
    if (IS_PRODUCTION) {
        config.push(config_dist);
        config.push(config_lib_css);
    } else {
        config.push(config_dist);
    }

    return config;
};
