import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';

const isProduction = process.env.NODE_ENV === 'production';


export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName:'LinkageSelect',
  plugins: [
    commonjs(),
    eslint(),
    babel({ runtimeHelpers: true }),
    (isProduction && uglify())
  ],
  dest: isProduction ? 'dist/linkage-select.min.js' : 'dist/linkage-select.js'
};
