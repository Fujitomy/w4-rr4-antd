/*
* 开发环境编译文件
* NamedModulesPlugin && OccurrenceOrderPlugin
* https://blog.csdn.net/chenqiuge1984/article/details/80128021
*
* https://blog.csdn.net/weixiaoderensheng/article/details/82993332 编译异常
* https://blog.csdn.net/ZYC88888/article/details/80592654
* https://blog.csdn.net/u013738122/article/details/81809002 编译配置
*
*/

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[2];

console.log(dllchunkname,'dllchunkname');

// 是否打印调用栈
// process.traceDeprecation = true;
// 是否关闭弃用警告
process.noDeprecation = false;

const dev = Boolean(process.env.WEBPACK_SERVE);
const production = process.argv.indexOf('--mode=production') > -1;

module.exports = {
    // mode: 'production',
    mode: 'development',
    // webpack 4.0 之后独立出来，在配置文件中，配置才能生效，以前直接在packjson.script命令行中配置--colors也行
    stats: { colors: true, version: true },
    // 调试工具，错误打印等级，可设置不同打印等级 devtool: 'inline-source-map',
    devtool: production ? 'cheap-module-eval-source-map' : 'hidden-source-map',
    entry:{
        // 简单写法
        // index: path.resolve(__dirname,'./source/entry/index.js'),
        index: [
            // 入口头文件引入会导致编译包体积增大，应该使用babel-runtime和babel-helpers按需引入和防止重复打包，
            // 比如有50个文件使用了Object.assign()方法，
            // 应该是抽一个es5 版Object.assign()的js模块，给其他各个文件引入，而不是打得到50个文件中，这个引入babel抽离到babel-helpers中了
            'babel-polyfill',
            path.resolve(__dirname, './source/entry/index.js')
        ]
    },
    // devServer模式下不配置output也是可以的
    output: {
        filename: '[name].[hash].js',
        chunkFilename: "[name].chunk.js",
        // 这里业务代码为何输出到公共包目录了··
        path: path.resolve(__dirname,'./source/vendors/'),
        // 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。
        publicPath: "/",
        // 模块注释信息，默认为false,不应该使用到生产环境
        pathinfo: true
    },
    optimization:{
        runtimeChunk: true,
        splitChunks: {
            // chunks: 'all',
            chunks: 'async',
            // minSize: 30000,
            // maxSize: 0,
            // minChunks: 1,
            // maxAsyncRequests: 5,
            // maxInitialRequests: 3,
            // automaticNameDelimiter: '+',
            // name: true,
            // cacheGroups: {
            //     vendors: {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10
            //     },
            //     default: {
            //         minChunks: 2,
            //         priority: -20,
            //         reuseExistingChunk: true
            //     }
            // }
        }
    },
    devServer:{
        // open: true, // 启动后打开浏览器
        // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要,
        // 若配置错误，是找不到资源文件的
        // 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录
        // 这个很重要，比如你的静态公共包资源放在./source/vendors/目录下，如果你不配置到此，那么devServer启动可能会找不到依赖文件
        contentBase: path.resolve(__dirname,'./source/vendors/'),
        // 一切服务都启用gzip压缩(所有来自 './source/vendors' 目录的文件都做 gzip 压缩)
        compress: true,
        // 启动本地服务端口号
        port: 8088,
        // 配置host之后才可以使用本地ip打开localhost页面
        host: '0.0.0.0',
        // 需要开启 plugins > new webpack.HotModuleReplacementPlugin()
        quiet: false, // true关闭编译控制台打印，世界一下子安静了
        // inline: true, // 实时刷新 设置为true，当源文件改变时会自动刷新页面
        // clientLogLevel: 'none', // 当使用内联模式(inline mode)时，会在开发工具(DevTools)的控制台(console)显示消息，例如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐,使用none
        historyApiFallback: true, // 不跳转
        // 接口代理
        proxy: {
            // 业务线接口升级到v4
            "/v4/*": {
                target: 'https://dp.clife.net/',
                changeOrigin: true,
                secure: false
            },
            // 公共接口未升级
            "/v1/web/*": {
                target: 'https://dp.clife.net/',
                changeOrigin: true,
                secure: false
            },
        },
        hot: true,
    },
    plugins: [
        // 热更新，不刷新页面异步更新,熱更新需要引入額外代碼在入口文件
        new webpack.HotModuleReplacementPlugin(),
        // 引入dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json'),
        }),
        // 模板插件
        new HtmlWebpackPlugin({
            title: 'react-router 4 && webpack4.0+ && antd.design',
            template: './source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'true',// 资源文件注入位置true,body,header,false
            chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
            // 动态引入dll， manifest就是dll生成的json
            vendor: /*manifest.name*/'vendor.dll.' + dllchunkname + '.js',
        }),
        new OpenBrowserWebpackPlugin({
            browser: 'Chrome',
            url: 'http://localhost:8088',
        }),
        // new CleanWebpackPlugin([
        //         './source/vendors/index.*.js',
        //         './source/vendors/index.*.map',
        //     ],
        //     {
        //         // webpack文件夹的绝对路径,Default: root of your package
        //         root: __dirname,
        //         verbose: true,
        //         // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
        //         exclude: ['manifest.json'],
        //     }
        // ),
        // 经常使用的模块提取到打包编译文件靠前位置，提升查找效率和运行速度
        new webpack.optimize.OccurrenceOrderPlugin(),
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
                        // // 编译规则，如果不开启，编译jsx会报错，旧配置presets: ['es2015', 'react']
                        // presets: ['@babel/preset-react'],
                        // // plugins: ['syntax-dynamic-import'],
                        // // plugins: ['@babel/plugin-transform-runtime']
                        // // 这个也可以在.babelrc中配置
                        // // plugins:[
                        // //     // 数组写法在babel7中已经弃用
                        // //     ['import',{libraryName:'antd', style:true}]
                        // // ],
                        // // This is a feature of `babel-loader` for webpack (not Babel itself).It enables caching results in ./node_modules/.cache/babel-loader/directory for faster rebuilds.
                        // // 这是webpack的“babel-loader”特征（不是Babel本身）。
                        // // 它可以在./node_modules/.cache/babel-loader/目录中启用缓存结果，以便更快地进行重建。
                        // cacheDirectory: true,


                        presets: ['@babel/preset-env','@babel/preset-react'],
                        // plugins: ['syntax-dynamic-import'],
                        // plugins: ['@babel/plugin-transform-runtime']
                        // 这个也可以在.babelrc中配置
                        // plugins:[
                        //     // 数组写法在babel7中已经弃用
                        //     ['import',{libraryName:'antd', style:true}]
                        // ],
                        // This is a feature of `babel-loader` for webpack (not Babel itself).It enables caching results in ./node_modules/.cache/babel-loader/directory for faster rebuilds.
                        // 这是webpack的“babel-loader”特征（不是Babel本身）。
                        // 它可以在./node_modules/.cache/babel-loader/目录中启用缓存结果，以便更快地进行重建。

                        cacheDirectory: true,
                        plugins: [
                            // '@babel/plugin-proposal-object-rest-spread',
                            // 编译动态引入语法，e.g: import('./xxx.js')
                            "syntax-dynamic-import",
                            // 编译一些es7语法
                            "@babel/plugin-proposal-class-properties",
                            [
                                // "import",
                                // {
                                //     "libraryName": "antd",
                                //     // "libraryDirectory": "lib",
                                //     "style": "css" // `style: true` 会加载 less 文件
                                // }
                                "import",
                                {
                                    "libraryName": "antd",
                                    "libraryDirectory": "es",
                                    "style": "css"
                                }
                            ]
                        ]


                    }
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
                // use: [
                //     { loader: 'style-loader' },
                //     { loader: 'css-loader?modules' },
                // ]
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
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
        },
    },
};