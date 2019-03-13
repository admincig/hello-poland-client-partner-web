const express = require('express');
const next = require('next');
const helmet = require('helmet');
const routes = require('./routes');
const proxyMiddleware = require('./proxy');

const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({ dev });
const { nextConfig } = app;
const { serverRuntimeConfig } = nextConfig || {};
const host = serverRuntimeConfig.host || '127.0.0.1'; // https://tinyurl.com/y8nlgmj6
const port = +serverRuntimeConfig.port || 3000;

const handleRequest = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();

    server.use(helmet());

    // Proxy API requests to resolve problem with CORS
    if (dev) {
      proxyMiddleware.forEach((middleware) => {
        server.use(middleware);
      });
    }

    routes.forEach(({ page, path }) => {
      server.get(path, (req, res) => {
        app.render(req, res, page, { ...req.query, ...req.params });
      });
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handleRequest(req, res));

    server.listen(port, host, (err) => {
      if (err) {
        throw err;
      }

      // eslint-disable-next-line no-console
      console.log(`> Ready on http://${host}:${port} [${env || 'development'}]`);
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
