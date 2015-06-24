import path from 'path';

const repoRoot = path.resolve(__dirname, '../../');

const srcRoot = path.join(repoRoot, 'src/');
const builtRoot = path.join(repoRoot, 'built/');

export {
  repoRoot,
  srcRoot,
  builtRoot
};
