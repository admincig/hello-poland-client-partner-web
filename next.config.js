const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const configPath = process.env.CONFIG_PATH || './config/develop.config.js';
// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);

module.exports = {
  serverRuntimeConfig: config.server,
  publicRuntimeConfig: config.public,
  ...withBundleAnalyzer({
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../../bundles/server.html',
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html',
      },
    },
  }),
};
