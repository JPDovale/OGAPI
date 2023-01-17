module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver", 
      {
        alias: {
          "@database": "./src/database",
          "@errors": "./src/errors",
          "@middlewares": "./src/middlewares",
          "@modules": "./src/modules",
          "@routes": "./src/routes",
          "@config": "./src/config",
          "@shared": "./src/shared"
        }
      }
    ],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", {legacy: true}],
    ["@babel/plugin-proposal-class-properties", {loose: false}],
  ]
}