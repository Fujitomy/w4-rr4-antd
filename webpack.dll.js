/** 
 * @description 提取公共包dll文件 compile dll file
 * @author tomy
 * @date 2020/2/26 11:11
 * @more 详见底部扩展阅读 Read more at the bottom of this document
 * 
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 2.0
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 官方压缩默认混淆插件
const TerserPlugin = require('terser-webpack-plugin'); // js压缩混淆插件
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');


console.log('-------------------------dll generation mode-------------------------');

const devConfig = { mode: 'development' }; // dll文件开发环境配置
const proConfig = { // dll文件正式环境配置
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                test: /\.js$/i,
                parallel: true,
                terserOptions: {
                    compress: { 
                        drop_console: true // 删除console
                    },
                    output: { 
                        comments: false  // 删除编译文件内的注释
                    }
                }
            })
        ]
    }
};

const config = {
    devtool: 'none',// dll文件删除warning,error打印
    stats: { 
        colors: true, // 编译器控制台代码变色
        version: true, // 打印webpack版本
    },
    entry: {
            // 抽离公共包的文件名和需要抽离的模块
            vendor: [
                'react','react-dom','react-router','react-router-dom','axios',// 'react-loadable',
            ],
            // 先不抽离antd
            // antd:['antd'] 
        },
    output: {
        // filename: 输出文件名 [name].dll.[chunkhash].js中[name]对应上文的entry.vendor中的vendor, 
        // So,如上配置输入的动态链接库文件名为 vendor.dll.[chunkhash].js
        filename: '[name].dll.[chunkhash].js',
        // library: dll 动态链接库文件内的全局变量名称命名（映射关系），与下文 webpack.DllPlugin的name配置项对应
        // 对于上文entry中vendor中抽取的react来说，就是 _dll_vendor(加上 _dll_ 前缀是防止全局变量冲突)
        // 则抽取出的dll文件中的 全面全局变量名为 _dll_ + _[name]_ + [chunkhashe] => _dll_vendor_adce4022019e7220216
        library: '_dll_[name]_[chunkhash]', 
        // path：dll文件存放路径
        path: path.join(__dirname, './source/vendors/'),
    },
    plugins:[
        // 打包前，先清除旧的打包文件 1.0.0配置，2.0+已经断崖式更新
        new CleanWebpackPlugin(
            // 3.0.0 配置
            //   {
            //     dry: false, // dry是否模拟删除文件，true是模拟删除，不会移除文件，false会移除文件再重新创建
            //     cleanStaleWebpackAssets: true,
            //     cleanStaleWebpackAssets: false,
            //     protectWebpackAssets: false,
            //     cleanOnceBeforeBuildPatterns: [
            //         path.join(__dirname,'./source/vendors/*'),
            //         // path.join(__dirname,'./source/vendors/react.manifest.json')
            //     ]
            // }
            // 1.0.0 配置
            [
                './source/vendors/*' // './source/vendors/vendor.manifest.json',
            ], 
            {
                root: __dirname, // webpack配置文件的绝对路径, Default: root of your package
                verbose: true,
                dry: false, // false才会删除指定目录的文件，true只是模拟删除
                // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
                // exclude: ['manifest.json'], 
            }
        ),
        // 编译报warn: Critical dependency: the request of a dependency is an expression
        new webpack.ContextReplacementPlugin(
            /encoding(\\|\/)lib/,
            path.resolve(__dirname, './')
        ),
        // 抽离公共包配置
        new webpack.DllPlugin({
            // context: 解析包路径的上下文
            context: __dirname,
            // name: 暴露出dll文件内的函数名(manifest清单索引文件内的name),与output.library的library保持一致
            name: '_dll_[name]_[chunkhash]',
            // TODO 生成manifest索引清单的文件名，竟然是path属性，这里更改manifest的文件名，叫 manifestFilename不是更贴切吗
            // path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
            path: path.join(__dirname, './source/vendors/','[name].manifest.json'),
        }),
    ]
};

const dllconfig = (env) =>{
    const configMode = env.NODE_ENV === 'dev' ? devConfig:proConfig;
    return { ...config, ...configMode };
}

module.exports = dllconfig;


/** 
 * 拓展阅读
 * [dynamic-link-library] 动态链接库 => 一次构建多次受益，提升打包编译速度
 * 概念：初次运行项目时，构建一次，之后不用参与构建，提升开发构建速度，与CommonChunks不同，dll文件涉及具体业务
 * 一个dll包就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app或者业务代码引用的
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
 * 通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块
 * 
 */