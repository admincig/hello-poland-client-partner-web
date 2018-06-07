const express = require('express');
const next = require('next');
const routes = require('./routes');

const port = parseInt(process.env.NODE_PORT, 10) || 3000;
const host = process.env.NODE_HOST || '127.0.0.1'; // https://tinyurl.com/y8nlgmj6
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();

    routes.forEach(({ page, path }) => {
      server.get(path, (req, res) => {
        app.render(req, res, page, req.params);
      });
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

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
