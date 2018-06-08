const proxyMiddleware = require('http-proxy-middleware');
const config = require('../config/develop.config');

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
