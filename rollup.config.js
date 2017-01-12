import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'k-util.js',
  plugins: [
    babel(),
    uglify()
  ]
}
