var path = require("path");

var rules = [
    {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
    },
    { test: /\.css$/, use: ["style-loader", "css-loader"] },
    {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
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
    },
];
