
const os = require("os");
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[1];
const production = process.argv.indexOf('--mode=production') > -1;

process.traceDeprecation = false; // 是否打印调用栈
process.noDeprecation = false; // 是否关闭弃用警告
// console.log(dllchunkname,'dllchunkname');

module.exports = {
    mode:'production',
    // 调试工具，错误打印等级，eval-source-map
    // devtool: "source-map",
    // webpack 4.0 之后独立出来，在配置文件中，配置才能生效，以前直接在packjson.script命令行中配置--colors也行
    stats: {
        colors: true,
        version: true,
    },
    devtool: 'none',
    // 引入意义？
    // dependencies: ["vendor.dll.92e3e6cb242f782bd03e.js"],
    entry:{
        // index: path.resolve(__dirname,'./source/entry/index.js'),
        index: [
            // 全局编译，会污染全局变量
            // 'babel-polyfill',
            path.resolve(__dirname, './source/entry/index.js')
        ]
    },
    // devServer模式下不配置output也是可以的
    output: {
        filename: '[name].[hash].js',
        chunkFilename: "[name].chunk.[chunkhash:8].js",
        // 这里业务代码为何输出到公共包目录了··
        // path: path.resolve(__dirname,'./source/vendors/'),
        path: path.resolve(__dirname,'./dist/build/'),
        // publicPath: "/",
        publicPath: './build/',
        // libraryTarget: 'umd'
    },
    optimization:{
        // 告诉webpack使用其默认默认最小化混淆UglifyJs插件混淆代码
        // minimize: true, 
        // 允许用户使用其他最小化插件，覆盖webpack默认最小化编译器
        minimizer: [
          new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false // set to true if you want JS source maps
          }),
          new OptimizeCssAssetsPlugin({})
        ],
        // usedExports: true,
        // 识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
        // 依赖于optimization.providedExports和optimization.usedExports
        // sideEffects: true,
        // 取代 new webpack.optimize.ModuleConcatenationPlugin()
        // concatenateModules: true,
        // 取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
        noEmitOnErrors: false,
        splitChunks: {
            name: true,
            // all 抽离所有共享模块，即便是异步和同步模块间共享的也抽离出来
            // chunks: 'all', 
            // 仅抽离异步模块间的共享
            // chunks: 'async',
            // 自定义抽离模块，可以排除掉一些已经抽离的模块，比如react，react-router，antd等相对稳定的模块
            // chunks (chunk) {
            //   // exclude `my-excluded-chunk`
            //   return chunk.name !== 'react' && chunk.name !== 'react-router-dom'  && chunk.name !== 'react-dom';
            // },
            chunks: 'async',
            minSize: 30000, // 模块大于30k会被抽离到公共模块
            maxSize: 512*1000, // 超过指定的大小就抽离成模块
            minChunks: 1, // 模块出现1次就会被抽离到公共模块
            maxAsyncRequests: 5, // 异步模块并行加载模块数，默认值为5
            maxInitialRequests: 3, // 初始加载模块最大并行请求数，默认值为3
            automaticNameDelimiter: '~',
            // name: 'tomy_vendor', // 指定缓存组块的名称
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true
                },
                // default:false,
                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true
                // }
            },
            // cacheGroups: {
            //   vendor: {
            //     test: /[\\/]node_modules[\\/]/,
            //     name: 'vendors',
            //     chunks: 'all'
            //   }
            // }
        },
    },
    plugins: [
        // 引入dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json')
        }),
        // 模板插件
        new HtmlWebpackPlugin({
            title: 'react-router 4 && webpack4.0+ && antd.design',
             // html模板文档地址，webpack默认模板为ejs
            template: './source/html/index.ejs', 
            // 由模板生成的文件名和存放位置，可带路径
            filename: '../index.html', 
            // 资源文件注入位置true,body,header,false
            inject: 'body',
            author: 'tomy',
            vendor: /*manifest.name*/'./vendors/vendor.dll.' + dllchunkname + '.js', // 动态引入dll， manifest就是dll生成的json
            // manifest: './vendors/vendor.manifest.json', // manifest ???
            // inline: true, // ????
            // 标签格式化配置，生产环境建议开启
            // minify: {
            //     collapseBooleanAttributes: true,
            //     collapseWhitespace: true,
            //     minifyCSS: true,
            //     minifyJS: true,
            //     removeComments: true,
            //     removeAttributeQuotes: true,
            //     removeEmptyAttributes: true,
            //     removeScriptTypeAttributes: true,
            //     removeStyleLinkTypeAttributes: true,
            // }
        }),
        // new OpenBrowserWebpackPlugin({
        //     browser: 'Chrome',
        //     url: 'http://localhost:9090',
        // }),
        new CleanWebpackPlugin(['dist/build','dist/vendors'],
            {
                // webpack文件夹的绝对路径,Default: root of your package
                root: __dirname,
                verbose: true,
                // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
                // exclude: ['manifest.json'],
            }
        ),
        // 经常使用的模块提取到打包编译文件靠前位置，提升查找效率和运行速度
        new webpack.optimize.OccurrenceOrderPlugin(),
        // // NamedModulesPlugin使用模块的相对路径作为模块的 id，
        // // 所以只要我们不重命名一个模块文件，那么它的id就不会变，更不会影响到其它模块了
        // new webpack.NamedModulesPlugin(),

        // 拷贝文件
        new CopyWebpackPlugin(
            [{
                from: path.join(__dirname, './source', 'vendors'),
                to: path.join(__dirname, './dist', 'vendors'),
                force: true
            },
            {
                from: path.join(__dirname, './source', 'html', 'favicon.ico'),
                to: path.join(__dirname, './dist'),
                force: true
            }]
        ),
        // Antd icon 本地化
        // new StringReplacePlugin(),
        // 打包分析
        new BundleAnalyzerPlugin(),
    ],
    module:{
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                // 排除查找模块的目录,提升编译速度
                exclude: /node_modules/,
                use: {
                    // loader: 'babel-loader?compact=true',
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.less$/,
                use:[
                        {
                            loader:'style-loader'
                        },
                        {
                            loader:'css-loader'
                        },
                        {
                            loader:'less-loader',
                            options: {
                                // 将less打包到js行内
                                javascriptEnabled: true
                            }
                        }
                ]
                ||  ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            },
        ],
    },
    // 文件解析配置
    resolve: {
        // 默认后缀名，配置后可省略
        extensions: ['.js', '.jsx','.es6'],
        // 指定模块查找目录，提升runtime模块查找速度
        // modules:['source/components','node_modules'],
        // 文件夹别名配置
        alias: {
            components: path.resolve(__dirname, './source/components'),
            com: path.resolve(__dirname, './source/components'),
            pages: path.resolve(__dirname, './source/pages'),
            utils: path.resolve(__dirname, './source/utils'),
            // $缩小查询范围，提升查询速度
            // react$: path.resolve(__dirname, 'react'),
            '@antd/icons/lib/dist$': path.resolve(__dirname, './source/icons.js')
        },
    },
};