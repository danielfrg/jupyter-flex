var path = require("path");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var pythonPkgStatic = path.resolve(
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

module.exports = [
    {
        entry: [path.resolve(__dirname, "src", "embed.js")],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "jupyter-flex-embed.js",
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "jupyter-flex.css",
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
        ],
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    include: path.resolve(__dirname, "src"),
                    // exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                // Jupyter Widgets CSS
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                    // use: ["null-loader"],
                },
                // Jupyter Widget Icons
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: ["url-loader"] },
                // Required to load font-awesome
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"] },
                { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"] },
                { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"] },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"] },
            ],
        },
        mode: "development",
        devtool: "source-map",
    },
    // {
    //     entry: [path.resolve(__dirname, "src", "index.js")],
    //     output: {
    //         path: path.resolve(__dirname, "dist"),
    //         filename: "index.js",
    //     },
    //     plugins: [
    //         new MiniCssExtractPlugin({
    //             filename: "jupyter-flex.css",
    //         }),
    //         // Copy the output to the Python Package
    //         new FileManagerPlugin({
    //             onEnd: {
    //                 copy: [
    //                     {
    //                         source: "./dist/*.*",
    //                         destination: pythonPkgStatic,
    //                     },
    //                 ],
    //             },
    //         }),
    //     ],
    //     externals: {
    //         react: "react",
    //         reactDOM: "react-dom",
    //         // Router: "react-router-dom",
    //         // Route: "react-router-dom",
    //         // Switch: "react-router-dom",
    //         // ReactRouter: "react-router-dom",
    //         IllusionistWidgetManager: "@danielfrg/illusionist",
    //         Provider: "@nteract/mathjax",
    //         RichMedia: "@nteract/outputs",
    //         Media: "@nteract/outputs",
    //         StreamText: "@nteract/outputs",
    //         KernelOutputError: "@nteract/outputs",
    //         // "@nteract/presentational-components":
    //         //     "@nteract/presentational-components",
    //     },
    //     mode: "development",
    //     devtool: "source-map",
    //     module: { rules: rules },
    // },
    // {
    //     entry: [path.resolve(__dirname, "src", "embed.js")],
    //     output: {
    //         path: path.resolve(__dirname, "dist"),
    //         filename: "embed.js",
    //         // libraryTarget: "commonjs2",
    //     },
    //     plugins: [
    //         new MiniCssExtractPlugin({
    //             filename: "jupyter-flex-embed.css",
    //         }),
    //     ],
    //     mode: "development",
    //     devtool: "source-map",
    //     module: { rules: rules },
    // },
];
