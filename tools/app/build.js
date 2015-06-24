import React from 'react';
import path from 'path';
import App from '../../src/pages/App';
import Root from '../../src/pages/Root';
import fsp from 'fs-promise';
import { exec } from '../exec';
import { builtRoot } from '../constants';

const rootFactory = React.createFactory(Root);

export default function Build() {
  console.log('Building: '.cyan + 'application'.green);

  return exec(`rimraf ${builtRoot}`)
    .then(() => fsp.mkdir(builtRoot))
    .then(() => {

      let pages = ['index.html'];

      let writes = pages
        .map(fileName => new Promise((resolve, reject) => {

          let markup = React.renderToString(<App/>);
          let html = React.renderToStaticMarkup(rootFactory({
            markup: markup
          }));

          let write = fsp.writeFile(path.join(builtRoot, fileName), html);
          resolve(write);

        }));

      return Promise.all(writes.concat([
        exec(`webpack --config webpack.config.js --bail`)
      ]));
    })
    .then(() => console.log('Built: '.cyan + 'aplication'.green));
}
