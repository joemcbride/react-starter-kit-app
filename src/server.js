import 'colors';
import React from 'react';
import express from 'express';
import path from 'path';
import httpProxy from 'http-proxy';

import App from './pages/App';
import Root from './pages/Root';

const rootFactory = React.createFactory(Root);

const development = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 4000;

const staticDir = '../built';

let app = express();

console.log('development?', development);

if (development) {
  let proxy = httpProxy.createProxyServer();
  let webpackPort = process.env.WEBPACK_DEV_PORT;
  let target = `http://localhost:${webpackPort}`;

  app.get('/assets/*', function (req, res) {
    proxy.web(req, res, { target });
  });

  app.use(function renderApp(req, res) {
    if (req.url === '/') {
      let markup = React.renderToString(<App/>);
      let html = React.renderToStaticMarkup(rootFactory({
        markup: markup
      }));
      res.send(html);
    }
  });

  proxy.on('error', function(e) {
    console.log('Could not connect to webpack proxy'.red);
    console.log(e.toString().red);
  });
} else {
  app.use(express.static(path.join(__dirname, staticDir)));
}

app.listen(port, function () {
  console.log(`Server started at http://localhost:${port}`);
});
