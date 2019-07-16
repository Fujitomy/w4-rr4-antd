
/** 
 * 提取公共包配置-dll
 * @author tomy
 * 
 * [dynamic-link-library] 动态链接库 => 一次构建多次受益，提示打包编译速度
 * 概念：初次运行项目时，构建一次，之后不用参与构建，提升开发构建速度，不同于CommonChunks,dll文件涉及具体业务
 * 一个 dll 包，就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app 或者业务代码引用的
 * 一般抽取一些固定很少发生更迭的库文件，比如react,react-router,redux这类基础库
 * dll文件的概念,借鉴了windows系统的动态链接库的理念，
 * Related Reading: https://zhuanlan.zhihu.com/p/21748318
 * 
 * [manifest.json] 
 * 作用：mainfest.json用于运行时编译器解析映射和加载编译后的模块
 * 一旦你的应用程序中，形如 index.html 文件、一些 bundle 和各种资源加载到浏览器中，会发生什么？
 * 你精心安排的 /src 目录的文件结构现在已经不存在，所以 webpack 如何管理所有模块之间的交互呢？这就是 manifest.json 用途的由来……
 * 
 * 具体实现方式：
 * 当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点
 * 这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在runtime运行时通过 Manifest 来解析和加载模块。
 * 无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，此方法指向模块标识符(module identifier)
 * 通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。
 * 
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // js压缩混淆插件
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const devConfig = { mode: 'development' };

const proConfig = {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js$/i,
        parallel: true,
        terserOptions: {
          compress: { 
            drop_console: true 
          },
          output: { 
            comments: false 
          }
        }
      })
    ]
  }
}

const baseConfig = {
  devtool: 'none',
  stats: { 
    colors: true, // 编译器控制台代码变色
    version: true, // 打印webpack版本
  },
  entry: {
    // 抽离公共包的文件名和需要抽离的模块
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      // 'react-loadable',
      'axios',
    ],
    // 先不抽离antd
    // antd:['antd'] 
    },
    output: {
      // 输出文件名 [name].dll.[chunkhash].js 中 [name] 对应上文的entry.vendor中的vendor，则生成的动态链接库文件名为 vendor.dll.[chunkhash].js
      filename: '[name].dll.[chunkhash].js',
      // dll 动态链接库文件内的全局变量名称命名（映射关系），与下文 webpack.DllPlugin的name配置项对应，
      // 例如对于 react 来说就是 _dll_react,  加上 _dll_ 防止全局变量冲突
      library: '_dll_[name]_[chunkhash]', // 这里因为抽取文件名为vendor 则抽取出的dll文件中的 全面全局变量名为 _dll_ + _[name]_ + [chunkhashe] => _dll_vendor_adce4022019e7220216
      // 输出文件存放路径
      path: path.join(__dirname, './source/vendors/'),
    },
    plugins:[
      // 打包前，先清除旧的打包文件
      new CleanWebpackPlugin([
        './source/vendors/'
            // './source/vendors/manifest.*.json',
            // './source/vendors/vendor.dll.*.js',
            // './source/vendors/vendor.*.js'
        ], {
          root: __dirname, // webpack配置文件的绝对路径, Default: root of your package
          verbose: true,
          dry: true,
          // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
          // exclude: ['manifest.json'], 
      }),
      // 抽离公共包配置
      new webpack.DllPlugin({
        // context是解析包路径的上下文
        context: __dirname,
        // name是dll內部暴露的对象名(manifest清单索引文件内的name),与output.library的library保持一致
        name: '_dll_[name]_[chunkhash]',
        // TODO 生成manifest索引清单的文件名，竟然是path属性，这里更改manifest的文件名，叫 manifestFilename不是更贴切吗
        // path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
        path: path.join(__dirname, './source/vendors/','[name].manifest.json'),
      }),
    ]
};

const dllconfig = (env) =>{
    const devMode = env.NODE_ENV === 'dev'; // 区分环境
    const config = devMode ? { ...baseConfig, ...devConfig } : { ...baseConfig, ...proConfig };
    return config;
}

module.exports = dllconfig;