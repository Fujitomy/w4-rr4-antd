/** 
 * @description 开发环境编译配置-单线程版
 * @author tomy
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[1];

// 是否打印调用栈
process.traceDeprecation = true;
// 是否关闭弃用警告
process.noDeprecation = false;

module.exports = {
    mode: 'development',
    // 编译遇到错误是否停止编译 // https://segmentfault.com/a/1190000007915447 返回编译状态码1是错误，如果设置为true
    bail: false,
    // 调试工具，错误打印等级，eval-source-map
    devtool: "source-map",
    // w4之后独立出来，在配置文件中，配置才能生效，以前直接在packjson中配置也行
    stats: {
        colors: true,
        version: true,
    },
    entry:{
        // index: path.resolve(__dirname,'./source/entry/index.js'),
        index: [
            'babel-polyfill',path.resolve(__dirname, './source/entry/index.jsx')
        ]
    },
    output: {
        // 打包的chunks文件名
        filename: '[name].[hash].js',
        // ???
        chunkFilename: "[name]-chunk.js",
        // 打包输出路径
        path: path.resolve(__dirname,'./source/vendors/'),
        // ???
        publicPath: "/"
    },
    devServer:{
        // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要,
        // 若配置错误，是找不到资源文件的
        // 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录
        // 简单的说，在 Node.js 中使用 fs 读取文件的时候，
        // 经常碰到要拼一个文件的绝对路径的问题 (fs 处理相对路径均以进程执行目录为准)
        // 比如使用path.resolve(__dirname,'./source/vendors')拼一个绝对路径
        // 使用 require.resolve 可以简化这一过程
        contentBase: require.resolve('./source/vendors') || path.resolve(__dirname,'./source/vendors'),
        // 一切服务都启用gzip压缩(所有来自 './source/vendors' 目录的文件都做 gzip 压缩)
        compress: true,
        // 启动本地服务端口号
        port: 9999,
        // host: '0.0.0.0',
        // // 需要开启 plugins > new webpack.HotModuleReplacementPlugin()
        // hot: true,
        // // 是否关闭编译控制台打印，世界一下子安静了
        // quiet: false,
        // // 实时刷新 设置为true，当源文件改变时会自动刷新页面
        // inline: true,
        // // 当使用内联模式(inline mode)时，会在开发工具(DevTools)的控制台(console)显示消息，例如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐,使用none
        // // clientLogLevel: 'none',
        // historyApiFallback: true, // 不跳转
        // // disableHostCheck: true,
    },
    // 文件解析配置
    resolve: {
        // 默认后缀名，配置后可省略
        extensions: ['.js', '.jsx', '.json'],
        // 文件夹别名配置
        alias: {
            components: path.resolve(__dirname, './source/components'),
            pages:  path.resolve(process.cwd(), 'src') || path.resolve(__dirname, './source/pages'),
            // commonjsx: path.resolve(__dirname, '../src/commonjsx'),
            // common: path.resolve(__dirname, '../src/assets/common'),
            // actions: path.resolve(__dirname, '../src/redux/actions')
        },
    },
    plugins: [
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        // 引入dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json')
        }),
        new HtmlWebpackPlugin({
            title: 'React-router 4 && webpack4.0+',
            template: './source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'true',// 资源文件注入位置true,body,header,false
            // 动态引入dll
            vendor: /*manifest.name*/'vendor.dll.'+dllchunkname + '.js' //manifest就是dll生成的json
        }),
        new OpenBrowserWebpackPlugin({
            browser: 'Chrome',
            url: 'http://localhost:9999',
        }),
        new CleanWebpackPlugin([
            './source/vendors/index.*.js',
            './source/vendors/index.*.map',
        ],
        {
            // webpack文件夹的绝对路径,Default: root of your package // 当前工作目录
            root: __dirname, 
            verbose: true,
            // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
            exclude: ['manifest.json'],
        }),
        // // 经常使用的模块提取到打包编译文件靠前位置，提升查找效率和运行速度
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // // NamedModulesPlugin使用模块的相对路径作为模块的 id，
        // // 所以只要我们不重命名一个模块文件，那么它的id就不会变，更不会影响到其它模块了
        // new webpack.NamedModulesPlugin(),
    ],
    module:{
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                // 排除查找模块的目录
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 编译规则，如果不开启，编译jsx会报错，旧配置presets: ['es2015', 'react']
                        presets: ['@babel/preset-react'],
                        // plugins: ['syntax-dynamic-import'],
                        // plugins: ['@babel/plugin-transform-runtime']
                    }
                },
                // 排除node_modules下的文件，因为该目录下文件都已编译过了
                // exclude: [
                //     path.resolve(__dirname,'node_modules')
                // ],
            },
            // {
            //     test: /\.css$/,
            //     // use: [
            //     //     'style-loader',
            //     //     'css-loader'
            //     // ]
            //     use: [
            //         { loader: 'style-loader' },
            //         { loader: 'css-loader?modules' },
            //     ]
            // },
            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: "style-loader" // 将 JS 字符串生成为 style 节点
            //     }, {
            //         loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
            //     }, {
            //         loader: "sass-loader" // 将 Sass 编译成 CSS
            //     }]
            // },
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use:[
            //         'file-loader'
            //     ]
            // },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     use: 'file-loader'
            // },
            // {
            //     test: /\.xml$/,
            //     use: [
            //         'xml-loader'
            //     ]
            // },
        ],
    },
};