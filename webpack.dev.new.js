
/**
 * @author: tomy
 * @last modified: tomy 2019/04/09 11:43:00
 * @description: Devlopment dist config / 开发环境编译文件
 * 
 */

const os = require("os");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[3];
const dev = Boolean(process.env.WEBPACK_SERVE);
const isProduction = process.argv.indexOf('--mode=production') > -1;
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 4 }); // 开启一个多线程，线程数量等于最大线程减一，几乎全开

process.traceDeprecation = false; // 是否打印调用栈
process.noDeprecation = false; // 是否关闭弃用警告

console.log(dllchunkname,'dllchunkname');

module.exports = {
    mode: 'development',
    devtool: true ? 'cheap-module-eval-source-map' : 'hidden-source-map',
    entry:{
        index: [
            // 入口头文件引入 babel-polyfill 会导致编译包体积增大，
            // 应该使用babel-runtime和babel-helpers按需引入和防止重复打包，
            // 比如有50个文件使用了Object.assign()方法，
            // 应该是抽一个es5 版Object.assign()的js模块，给其他各个文件引入，而不是打得到50个文件中，这个引入babel抽离到babel-helpers中了
            'babel-polyfill',
            path.resolve(__dirname, './source/entry/index.js')
        ]
    },
    // devServer模式下不配置output也是可以的
    // output: {
    //     // 入口文件名，如果是单入口文件的话，没有配置优化项的话只有一个，多入口文件的话会有多个
    //     filename: '[name].[hash].js',
    //     // 按需加载模块的js名称
    //     chunkFilename: "[name].chunk.js",
    //     // 这里业务代码为何输出到公共包目录了··
    //     path: path.resolve(__dirname,'./source/vendors/'),
    //     // 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。
    //     publicPath: "/",
    //     // 模块注释信息，默认为false,不应该使用到生产环境
    //     pathinfo: true
    // },
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
            // 支付接口联调
            '/pay/manager/*': {
                target: '10.8.9.96:18085/',
                changeOrigin: true,
                secure: false
            }
        },
        hot: true,
    },
    module:{
        // 排除编译项   有些库是自成一体不依赖其他库的没有使用模块化的，比如jquey、momentjs、chart.js，要使用它们必须整体全部引入。 webpack是模块化打包工具完全没有必要去解析这些文件的依赖，因为它们都不依赖其它文件体积也很庞大，要忽略它们配置如下：
        noParse: /node_modules\/(moment\.js)/,
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                use: {
                    // babel编译过程很耗时，好在babel-loader提供缓存编译结果选项，在重启webpack时不需要创新编译而是复用缓存结果减少编译流程。babel-loader缓存机制默认是关闭的，打开的配置如下babel-loader?cacheDirectory
                    loader:  'happypack/loader?id=js' || 'babel-loader?cacheDirectory',
                },
                // 排除查找模块的目录,提升编译速度
                exclude: path.resolve(__dirname, 'node_modules'),
            },
           
            {
                test: /\.css$/,
                // use: 'happypack/loader?id=css' || ['style-loader', 'css-loader'],
                include: [path.resolve(__dirname, 'node_modules')],
                use: [
                    // MiniCssExtractPlugin.loader,
                    'happypack/loader?id=node_moudles_css'
                ]
            },
            {
                test: /\.scss/,
                include: [path.resolve(__dirname, 'node_modules')],
                use: 'happypack/loader?id=node_moudles_sass' ||  ['style-loader', 'css-loader', 'sass-loader']
            },
            // 自定义样式-模块化
            {
                test: /\.scss$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                use: [
                    // { 
                    //     loader: MiniCssExtractPlugin.loader,
                    //     // options: {
                    //     //     publicPath: '../'
                    //     // }
                    // },
                    'happypack/loader?id=customizeSass'
                ]
            },
            {
                test: /\.less$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                use: 'happypack/loader?id=less' ||
                [
                    { loader:'style-loader' },
                    { loader:'css-loader'   },
                    {
                        loader:'less-loader',
                        options: {
                            // 将less打包到js行内
                            javascriptEnabled: true
                        }
                    }
                ]  ||  ['style-loader', 'css-loader', 'less-loader']
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


        // js线程 id：jsh 对应上文的 module.rules.use: happypack/loader?id=js
        new HappyPack({
            id: 'js',
            threads: 4,
            // 指定使用哪个线程池
            threadPool: HappyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true'],
            verbose: false,
        }),

        new HappyPack({
            id: 'node_moudles_css',
            threads: 4,
            // 指定使用哪个线程池
            threadPool: HappyThreadPool,
            loaders: [
                'style-loader', 
                'css-loader',
                'postcss-loader'
            ],
            verbose: false,
        }),

        new HappyPack({
            id: 'node_moudles_less',
            threads: 4,
            // less文件和js文件都指定了使用HappyThreadPool线程池
            threadPool: HappyThreadPool,
            loaders: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                {
                    loader:'less-loader',
                    options: {
                        // 将less打包到js行内
                        javascriptEnabled: true
                    }
                }
            ],
            verbose: false,
        }),

        new HappyPack({
            id: 'less',
            threads: 4,
            // less文件和js文件都指定了使用HappyThreadPool线程池
            threadPool: HappyThreadPool,
            loaders: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                {
                    loader: 'less-loader',
                    options: {
                        // 将less打包到js行内
                        javascriptEnabled: true
                    }
                }
            ],
            verbose: false,
        }),

        new HappyPack({
            id: 'node_moudles_sass',
            threads: 3,
            // less文件和js文件都指定了使用HappyThreadPool线程池
            threadPool: HappyThreadPool,
            loaders: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ],
            verbose: false,
        }),

        new HappyPack({
            id: 'customizeSass',
            threads: 3,
            // less文件和js文件都指定了使用HappyThreadPool线程池
            threadPool: HappyThreadPool,
            loaders: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ],
            verbose: false,
            debug: false
        }),
    ],
    // 文件解析配置
    resolve: {
        // 默认后缀名，配置后可省略
        extensions: ['.js', '.jsx','.es6'],
        // 文件夹别名配置
        alias: {
            '@': path.resolve('source'),
            // react$: path.resolve(__dirname, 'react'), // $缩小查询范围，提升查询速度
        },
    },
    // 编译控制台打印配置
    stats: { 
        colors: true,
        version: true 
    }
};