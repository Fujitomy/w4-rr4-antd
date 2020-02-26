/**
 * @description development compile config / 开发环境编译配置 - happypack 多线程版
 * @author tomy
 * @date 2019/04/09 11:43:00
 * @more 详见底部扩展阅读 Read more at the bottom of this document
 * 
 */

const os = require("os");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[3];
const devMode = process.argv.indexOf('--mode=development') > -1;
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 }); // 开启多线程，线程数量等于最大线程减4，几乎全开

// console.log(dllchunkname,'dllchunkname');

process.traceDeprecation = false; // 跟踪弃用警告的调用栈,默认true
process.noDeprecation = true; // 关闭弃用警告,默认true

module.exports = {
    mode: 'development', // 编译模式 compile mode
    devtool: true ? 'cheap-module-eval-source-map' : 'hidden-source-map', // 错误跟踪工具
    stats: {  // 编译控制台打印配置
        colors: true, version: true 
    },
    node: {
        "fs": "empty"
    },
    entry:{ // 入口文件配置
        index: [
            // 入口头文件引入 babel-polyfill 会导致编译包体积增大，
            // 应该使用babel-runtime和babel-helpers按需引入和防止重复打包，
            // 比如有50个文件使用了Object.assign()方法，
            // 应该是抽一个es5 版Object.assign()的js模块，给其他各个文件引入，而不是打到这50个文件中，这个引入babel抽离到babel-helpers中了
            // 可以在这里配置hot-loader吗，how to do?
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
        // open: true, // 启动后打开浏览器,默认为true
        // contentBase: 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要,
        // 若配置错误，是找不到资源文件的
        // 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录
        // 这个很重要，假如你的静态资源（图片多媒体）或者react公共包放在./source/vendors/目录下，
        // 如果你不配置到此，那么devServer启动可能会找不到这些依赖的静态资源文件或公共包，导致启动失败
        contentBase: path.resolve(__dirname,'./source/vendors/'),
        // compress: 一切服务都启用gzip压缩(所有来自 './source/vendors' 目录的文件都做 gzip 压缩)
        compress: true,
        // port: 启动本地服务端口号
        port: 8088,
        // 配置host之后才可以使用本地ip打开localhost页面
        host: '0.0.0.0',
        // 需要开启 plugins > new webpack.HotModuleReplacementPlugin()
        quiet: false, // true关闭编译控制台打印，世界一下子安静了
        // inline: true, // 实时刷新 设置为true，当源文件改变时会自动刷新页面,默认为true
        // clientLogLevel: 当使用内联模式(inline mode)时，会在开发工具(DevTools)的控制台(console)显示消息，
        // 例如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐,So使用none
        // clientLogLevel: 'none', 
        historyApiFallback: true, // 不跳转
        hot: true,
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
            },
            'hetapi/api/mock/51/deviceTest1': {
                target: 'https://200.200.200.230/',
                changeOrigin: true,
                secure: false
            }
        }
    },
    module:{
        // 排除模块依赖解析项 => 有些库是自成一体,不依赖其他库,没有使用模块化的，比如jquey、momentjs、chart.js，要使用它们必须整体全部引入。 webpack是模块化打包工具完全没有必要去解析这些文件的依赖，因为它们都不依赖其它文件体积也很庞大，要忽略它们配置如下：
        noParse: /node_modules\/(moment\.js)/,
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                use: {
                    // babel编译过程很耗时，好在babel-loader提供缓存编译结果选项，在重启webpack时不需要重新编译而是复用缓存结果减少编译时间。
                    // babel-loader缓存机制默认是关闭的，打开的配置如下：babel-loader?cacheDirectory
                    // happypack/loader?id=js_modules 线程id用于下文plugins,使用该id分配解析js使用多少线程数和其他配置
                    loader:  'happypack/loader?id=js' || 'babel-loader?cacheDirectory',
                },
                // 排除查找模块的目录,提升编译速度
                exclude: path.resolve(__dirname, 'node_modules'),
            },
           
            {
                test: /\.css$/,
                // use: 'happypack/loader?id=css' || ['style-loader', 'css-loader'],
                use: [
                    // MiniCssExtractPlugin.loader,
                    'happypack/loader?id=node_moudles_css'
                ],
                include: [path.resolve(__dirname, 'node_modules')],
            },

            {
                test: /\.scss/,
                use: 'happypack/loader?id=node_moudles_sass' ||  ['style-loader', 'css-loader', 'sass-loader'],
                include: [path.resolve(__dirname, 'node_modules')],
            },
            // 自定义样式-模块化
            {
                test: /\.scss$/,
                use: [
                    // { 
                    //     loader: MiniCssExtractPlugin.loader,
                    //     // options: {
                    //     //     publicPath: '../'
                    //     // }
                    // },
                    'happypack/loader?id=customizeSass'
                ],
                exclude: [path.resolve(__dirname, 'node_modules')],

            },
            {
                test: /\.less$/,
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
                ]  ||  ['style-loader', 'css-loader', 'less-loader'],
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use:[
                    'file-loader'
                ]
            }
        ],
    },
    plugins: [
        // 告诉webpack编译器，遇到vendor.manifest.json中的依赖文件，就不再去打包了，直接根据该库id去dll文件中找到对应id索引模块
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json'),
        }),
        // Html模板插件
        new HtmlWebpackPlugin({
            title: 'react-router 4 && webpack4.0+ && antd.design',
            template: './source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'true',// 资源文件注入位置true,body,header,false
            chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
            // 动态引入dll， manifest就是dll生成的json,在index.ejs中引用
            // vendor: /*manifest.name*/'vendor.dll.' + dllchunkname + '.js',
        }),
        // Html引入dll文件插件
        new HtmlWebpackTagsPlugin({ tags: ['vendor.dll.' + dllchunkname + '.js'], append: false }),
        // 打开浏览器插件
        new OpenBrowserWebpackPlugin({
            browser: os.type()==='Darwin' ?'Google Chrome':'Chrome',
            url: 'http://localhost:8088',
        }),
        // 热更新，不刷新页面异步更新,熱更新需要引入額外代碼在入口文件
        new webpack.HotModuleReplacementPlugin(),
        // 经常使用的模块提取到打包编译文件靠前位置，提升编译查找效率和运行速度
        new webpack.optimize.OccurrenceOrderPlugin(),
        // // NamedModulesPlugin使用模块的相对路径作为模块的 id，
        // // 所以只要我们不重命名一个模块文件，那么它的id就不会变，更不会影响到其它模块了
        // new webpack.NamedModulesPlugin(),

        // // 编译报warn: Critical dependency: the request of a dependency is an expression
        // new webpack.ContextReplacementPlugin(
        //     /@0.1.12@encoding(\\|\/)lib/,
        //     path.resolve(__dirname, './')
        // ),

        // 根据HappyPack线程id分配不同loader的线程资源：js 对应上文的 module.rules.use:happypack/loader?id=js
        new HappyPack({
            id: 'js'||'js_modules',
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
    }
};

/**
 * @description: 扩展阅读
 * NamedModulesPlugin && OccurrenceOrderPlugin
 * https://blog.csdn.net/chenqiuge1984/article/details/80128021
 *
 * 编译异常
 * https://blog.csdn.net/weixiaoderensheng/article/details/82993332 
 * https://blog.csdn.net/ZYC88888/article/details/80592654
 * 
 * 编译配置
 * https://blog.csdn.net/u013738122/article/details/81809002 
 * 
 * core-js warning solve method
 * https://blog.csdn.net/kai_vin/article/details/88700181
 * 
 */