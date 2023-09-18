const config = require("./custom-webpack.config.js");
const ExtensionReloader = require("webpack-extension-reloader");

module.exports = {
  ...config,
  mode: "development",
  plugins: [
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        background: 'background: "./src/background.ts"',
        content: "./src/content.ts",
      },
    }),
  ],
};
