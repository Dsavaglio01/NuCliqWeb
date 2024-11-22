const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const { parse: parseQuery } = require('querystring');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Add any custom URL paths and their corresponding redirects here
    if (pathname === '/redirect-to-expo') {
      // Redirect to the custom Expo app
      res.writeHead(302, { Location: 'nucliqv1://' });
      res.end();
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
