const nanoid = require('nanoid');
const helmet = require('helmet');

module.exports = function helmetMiddleware(server, { csp = true }) {
  if (csp) {
    server.use((req, res, next) => {
      // nonce should be base64 encoded
      res.locals.nonce = Buffer.from(nanoid()).toString('base64');
      next();
    });

    const getNonce = (req, res) => `'nonce-${res.locals.nonce}'`;

    const scriptSrc = ["'self'", getNonce];

    // In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
    if (process.env.NODE_ENV !== 'production') {
      scriptSrc.push("'unsafe-eval'");
    }

    server.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc,
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            getNonce,
          ],
        },
      },
    }));
  } else {
    server.use(helmet());
  }
};
