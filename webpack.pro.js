
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
    // tree shaking 新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。
    mode:'production',
    // 调试工具，错误打印等级，eval-source-map
    // devtool: "source-map",
    devtool: 'none',
    // 统计信息-编译控制台
    // stats: 'normal',
    stats: {
        colors: true,
        version: true,
        // 添加资源信息
        assets: false,
    },
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。Watch 模式默认关闭。
    watch: true,
    // --watch --info-verbosity verbose
    // 监听配置项
    watchOptions:{
        aggregateTimeout: 300, // 编译延迟时长，默认300毫秒，如果不想频繁编译，可以加大时长
        // poll: 1000,  // 编译轮询时长，危险操作,高内存
        ignored: /node_modules/
    },
    // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
    performance:{
        hints: 'warning', // || 'error' || 'warning'
        // 入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
        maxEntrypointSize: 5000000,
        // 资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
        maxAssetSize: 100000,
    },
    // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader 其上下文是入口文件所处的目录的绝对路径的字符串
    // context: path.resolve(__dirname, "./source/entry/"),
    // entry 对象是用于 webpack 查找启动并构建 bundle。其上下文 context 是入口文件所处的目录的绝对路径的字符串。
    entry:{
        // 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行
        index: [
            // 全局编译，会污染全局变量
            // 'babel-polyfill',
            path.resolve(__dirname, './source/entry/index.js')
        ]
    },
    // 位于对象最顶级键(key)，包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」
    output: {
        // 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        filename: '[name].[hash:8].js',  // 此选项不会影响那些「按需加载 chunk」的输出文件。对于这些文件，请使用 output.chunkFilename 选项来控制输出。通过 loader 创建的文件也不受影响。在这种情况下，你必须尝试 loader 特定的可用选项。
        // output 目录对应一个绝对路径，指定bundle文件输出路径
        path: path.resolve(__dirname,'./dist/build/'),
        // 此选项决定了非入口(non-entry) chunk 文件的名称。有关可取的值的详细信息，请查看 output.filename 选项
        chunkFilename: "[name].chunk.[chunkhash:8].js",
        // 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。
        publicPath: './build/',

        // publicPath: "https://cdn.example.com/assets/", // CDN（总是 HTTPS 协议）
        // publicPath: "//cdn.example.com/assets/", // CDN (协议相同)
        // publicPath: "/assets/", // 相对于服务(server-relative)
        // publicPath: "assets/", // 相对于 HTML 页面
        // publicPath: "../assets/", // 相对于 HTML 页面
        // publicPath: "", // 相对于 HTML 页面（目录相同）
        // 告诉 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项默认值是 false，并且不应该用于生产环境(production)，但是对阅读开发环境(development)中的生成代码(generated code)极其有用。
        // pathinfo: true,
        // 此选项会向硬盘写入一个输出文件，只在 devtool 启用了 SourceMap 选项时才使用。 我们建议只使用 [file] 占位符，因为其他占位符在非 chunk 文件(non-chunk files)生成的 SourceMap 时不起作用。
        // sourceMapFilename: "[file].map", 
        // 修改输出 bundle 中每行的前缀。 注意，默认情况下使用空字符串。使用一些缩进会看起来更美观，但是可能导致多行字符串中的问题。
        // sourcePrefix:'\t',
        // 暴露自定义js库的文件名 暴露 library 使其在各种用户环境(consumption)中可用
        // library: 'tomyjs',
        // 暴露 library 的方式 var(全局变量tomyjs),this(通过this访问this.tomyjs),window(window.tomyjs),UMD(require('tomyjs'))
        // libraryTarget: 'umd', // https://www.webpackjs.com/configuration/output/#%E9%80%9A%E8%BF%87%E5%9C%A8%E5%AF%B9%E8%B1%A1%E4%B8%8A%E8%B5%8B%E5%80%BC%E6%9A%B4%E9%9C%B2
    },
    // 编译优化项，主要用于生产环境包请求，加载以及长效缓存优化
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
    // 编译插件
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
    // 排除打包配置，如果单独引入了lodash或者jquery这样的库，则没必要在业务代码中作为依赖打包，externals用于排除配置
    // externals: {
    //     lodash: {
    //       commonjs: 'lodash', // commonjs中通过访问方式require('lodash')
    //       commonjs2: 'lodash',
    //       amd: 'lodash',
    //       root: '_' // 在全局变量中通过 _ 比如 _.indexOf 访问 lodash
    //     }
    // },
    // 引入意义？
    // dependencies: ["vendor.dll.92e3e6cb242f782bd03e.js"],
};