const withPlugins = require('next-compose-plugins');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');

const configPath = process.env.CONFIG_PATH || './config/develop.config.js';
// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);

const bundleAnalyzerConfig = {
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
};

const nextConfig = {
  assetPrefix: config.public.assetPrefix || '',
  serverRuntimeConfig: config.server,
  publicRuntimeConfig: config.public,
  poweredByHeader: false,
};

module.exports = withPlugins([
  [bundleAnalyzer, bundleAnalyzerConfig],
  nextConfig,
]);
