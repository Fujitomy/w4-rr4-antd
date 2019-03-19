
/*
*  提取公共包
*  初次运行项目时，构建一次，之后不用参与构建，提升开发构建速度
*  Compile the dll file, only when you run the project for the first time
*  Dll is different from CommonChunks
*  一个 dll 包，就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app 或者业务代码引用的
*  Related Reading: https://zhuanlan.zhihu.com/p/21748318
*
*/

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
    // 模式，4.0之后必需
    // mode: "development",
    // 一般不需要查看库文件错误提示，直接production模式打包
    mode: "production",
    devtool: 'none',
    // 编译统计
    // stats: {
    //     // 编译代码变色
    //     colors: true,
    //     // 打印webpack版本
    //     version: true,
    // },
    // 抽离公共包入口
    entry: {
        // 抽离公共包文件名和模块
        vendor: [
            // 
            'react',
            'react-dom',
            // 'react-router',
            'react-router-dom',
            // 'react-loadable',
            'axios',
            // 'antd'
        ],
        // antd:['antd']
    },
    output: {
        // 输出文件路径
        path: path.join(__dirname, './source/vendors/'),
        // 输出文件名 [name].dll.[chunkhash].js中name对应上文中的，entry.vendor的vendor
        filename: '[name].dll.[chunkhash].js',
        // dll公共包文件内的name名称命名规则，映射关系，与下文DllPlugin.name对应
        library: '[name]_[chunkhash]',
    },
    plugins:[
        // 打包前，先清除旧的打包文件
        new CleanWebpackPlugin([
            './source/vendors/manifest.*.json',
            './source/vendors/vendor.dll.*.js',
            './source/vendors/vendor.*.js'
        ], {
            // webpack文件夹的绝对路径,Default: root of your package
            root: __dirname, 
            verbose: true,
            // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
            exclude: ['manifest.json'],
        }),

        // 抽离公共包配置
        new webpack.DllPlugin({
            // context是解析包路径的上下文
            context: __dirname,
            // name是dll內部暴露的对象名(manifest清单索引文件内的name),与上文output.library保持一致
            name: '[name]_[chunkhash]',
            // 生成manifest索引清单的文件名，竟然是path属性，这里更改manifest的文件名，why not filename？
            // path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
            path: path.join(__dirname, './source/vendors/','[name].manifest.json'),
        }),
    ],

}

{
// Manifest 
// 那么，一旦你的应用程序中，形如 index.html 文件、一些 bundle 和各种资源加载到浏览器中，会发生什么？
// 你精心安排的 /src 目录的文件结构现在已经不存在，所以 webpack 如何管理所有模块之间的交互呢？
// 这就是 manifest.json 用途的由来……

// 当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。
// 这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。
// 无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，
// 此方法指向模块标识符(module identifier)。
// 通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。
}