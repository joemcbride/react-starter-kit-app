import build from './app/build';

export default function Build(verbose) {
  return Promise.all([
    build()
  ]);
}
