import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', // 打包入口
  output: {
    // 打包出口
    file: 'dist/umd/vue.js',
    name: 'Vue', // 使用 umd 规范在浏览器中使用 全局变量的名称
    format: 'umd', // 打包的模块化规范
    sourcemap: true // 源代码和运行代码的映射
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development'
      ? serve({
          open: true,
          openPage: '/public/index.html',
          port: 3300,
          contentBase: ''
        })
      : null
  ]
}
