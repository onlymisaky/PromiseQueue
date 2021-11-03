import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const banner = `
/**
 * @license
 * author: ${pkg.author}
 * ${pkg.name} v${pkg.version}
 * (c) 2021-${new Date().getFullYear()}
 * Released under the ${pkg.license} license.
 */
`;

/** @type {import('rollup').RollupOptions} */
const rollupConfig = {
  input: 'src/index.ts',
  output: [
    {
      name: 'PromiseQueue',
      file: pkg.main,
      format: 'umd',
      exports: 'default',
      banner,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      module: 'es6',
      declarationDir: 'typings'
    }),
  ],
};

export default rollupConfig;
