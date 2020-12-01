const proxyMiddleware = require('http-proxy-middleware');

const configPath = process.env.CONFIG_PATH || '../config/develop.config';
// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);

const port = parseInt(process.env.NODE_PORT, 10) || 3000;
const serverConfig = config.server;
const baseURL = serverConfig.apiURL || `http://localhost:${port}/api`;

const proxySettings = {
  '/api': {
    target: baseURL,
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  },
};

const middleware = Object.entries(proxySettings).map(entry => proxyMiddleware(entry[0], entry[1]));

module.exports = middleware;
