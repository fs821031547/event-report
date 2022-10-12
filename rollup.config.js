import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './lib/index.ts',
  output: [
    {
      name: 'StatisticsPlugin',
      file: './dist/StatisticsPlugin.umd.js',
      format: 'umd',
    },
    {
      file: './dist/StatisticsPlugin.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    typescript({
      typescript: require('typescript'),
    }),
    terser(),
  ],
  external: ['fingerprintjs2', 'ua-parser-js'],
};
