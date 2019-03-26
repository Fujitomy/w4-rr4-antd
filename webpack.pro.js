/*
 * @author: tomy
 * @date: 2019/03/22 12:00:00
 * @last modified: tomy
 * @last modified date: 2019/03/22 10:45
 * @Description: production dist config
 * 
 * antd 按需加载全量引入了icon，期待后续antd给出新的api，控制入口文件大小在700kkb以下，暂时这么处理
 * https://github.com/ant-design/ant-design/issues/12011
 * https://www.zhihu.com/question/308898834
 * 临时解决方案
 * https://github.com/HeskeyBaozi/reduce-antd-icons-bundle-demo
 * 
 */

const os = require("os");
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 4 }); // 开启一个多线程，线程数量等于最大线程减一，几乎全开

const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[3];

const production = process.argv.indexOf('--mode=production') > -1;

process.traceDeprecation = true; // 是否打印调用栈
process.noDeprecation = true; // 是否关闭弃用警告
// console.log(dllchunkname,'dllchunkname');

// webpack 三种chunk类型 entry chunk, children chunk , common chunk

module.exports = {
    // tree shaking 新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。
    mode: 'production',
    // 调试工具，错误打印等级，eval-source-map
    // devtool: "source-map",
    devtool: 'none',
    // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader 其上下文是入口文件所处的目录的绝对路径的字符串
    // context: path.resolve(__dirname, "./source/entry/"),
    // entry 对象是用于 webpack 查找启动并构建 bundle。其上下文 context 是入口文件所处的目录的绝对路径的字符串。
    entry:{
        // 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行
        index: [
            // 全局编译，会污染全局变量
            'babel-polyfill',
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
    // 编译控制台打印项配置
    // stats: 'none',
    stats: {
        // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
        // all: undefined,

        // 打印非入口文件的chunk编译信息
        assets: true,

        // 对资源按指定的字段进行排序
        // 你可以使用 `!field` 来反转排序。
        assetsSort: "field",

        // 添加构建日期和构建时间信息
        builtAt: true,

        // 添加缓存（但未构建）模块的信息
        cached: false,

        // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
        cachedAssets: false,

        // 添加 children 信息
        children: false,

        // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
        chunks: false,

        // 将构建模块信息添加到 chunk 信息
        chunkModules: false,

        // 添加 chunk 和 chunk merge 来源的信息
        chunkOrigins: false,

        // 按指定的字段，对 chunk 进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        chunksSort: "field",

        // 用于缩短 request 的上下文目录
        // context: "../src/",

        // `webpack --colors` 等同于
        colors: true,

        // 显示每个模块到入口起点的距离(distance)
        depth: false,

        // 通过对应的 bundle 显示入口起点
        entrypoints: true,

        // 添加 --env information
        env: false,

        // 添加错误信息
        errors: true,

        // 添加错误的详细信息（就像解析日志一样）
        errorDetails: true,

        // 将资源显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeAssets: (assetName) => { 
        //     console.log(moduleSource,'---------excludeAssets-----------');
        //     return false 
        // },
        //"filter", 
        // | /filter/ | (assetName) => ... return true|false |
        //     ["filter"] | [/filter/] | [(assetName) => ... return true|false],

        // 将模块显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeModules: (moduleSource) => {return false},
        // "filter",
        // | /filter/ | (moduleSource) => ... return true|false |
        //     ["filter"] | [/filter/] | [(moduleSource) => ... return true|false]
            

        // 和 excludeModules 相同
        // exclude: (moduleSource) => {
        //     console.log(moduleSource,'---------moduleSource-----------');
        //     return false
        // },
        // "filter", 
        // | /filter/ | (moduleSource) => ... return true|false |
        //     ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],

        // 添加 compilation 的哈希值
        hash: false,

        // 设置要显示的模块的最大数量
        maxModules: 15,

        // 添加构建模块信息
        modules: false,

        // 按指定的字段，对模块进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        modulesSort: "field",

        // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
        moduleTrace: false,

        // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
        performance: false,

        // 显示模块的导出
        providedExports: true,

        // 添加 public path 的信息
        publicPath: false,

        // 添加模块被引入的原因
        reasons: false,

        // 添加模块的源码
        source: false,

        // 添加时间信息
        timings: true,

        // 显示哪个模块导出被用到
        usedExports: false,

        // 添加 webpack 版本信息
        version: false,

        // 添加警告
        warnings: true,

        // 过滤警告显示（从 webpack 2.4.0 开始），
        // 可以是 String, Regexp, 一个获取 warning 的函数
        // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
        // warningsFilter: (warning) => { return false }
        // "filter" // | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
    },
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。Watch 模式默认关闭。
    watch: true,
    // --watch --info-verbosity verbose
    // 监听配置项
    // watchOptions:{
    //     aggregateTimeout: 300, // 编译延迟时长，默认300毫秒，如果不想频繁编译，可以加大时长
    //     // poll: 1000,  // 编译轮询时长，危险操作,高内存
    //     ignored: /node_modules/
    // },
    // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
    performance:{
        // hints: 'warning', // false | 'error' | 'warning'
        hints: 'warning',
        // 入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
        maxEntrypointSize: 400*1000,
        // 资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
        maxAssetSize: 250*1000,
        // 提示过滤项
        assetFilter: assetFilename =>  assetFilename.indexOf('entry-chunk')!==-1, // 入口文件不提示
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

        // webpack 默认配置 webpack 4 Code Splitting 的 splitChunks 配置探索 https://imweb.io/topic/5b66dd601402769b60847149
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 500000,
            minChunks: 1,
            maxAsyncRequests: 9,
            maxInitialRequests: 6,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vender: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'entry-vender',
                    chunks: 'initial',
                    priority: 10
                },
                antd: {
                    name: 'chunk-antd',
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 20,
                    chunks: 'async'
                },
                lodash: {
                    name: 'chunk-lodash',
                    test: /[\\/]node_modules[\\/]lodash[\\/]/,
                    priority: 30,
                    chunks: 'async'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },


        // 默认情况下，webpack v4 +为动态导入的模块提供了开箱即用的新的共同块（共享块）打包策略。
        // splitChunks: {
        //     name: true,
        //     // all 抽离所有共享模块，即便是异步和同步模块间共享的也抽离出来
        //     // chunks: 'all', 
        //     // 仅抽离异步模块间的共享
        //     // chunks: 'async',
        //     // 自定义抽离模块，可以排除掉一些已经抽离的模块，比如react，react-router，antd等相对稳定的模块
        //     // chunks (chunk) {
        //     //   // exclude `my-excluded-chunk`
        //     //   return chunk.name !== 'react' && chunk.name !== 'react-router-dom'  && chunk.name !== 'react-dom';
        //     // },
        //     chunks: 'all',
        //     minSize: 30000, // 模块大于30k会被抽离到公共模块
        //     maxSize: 512*1000, // 超过指定的大小就抽离成模块
        //     minChunks: 1, // 模块出现1次就会被抽离到公共模块
        //     maxAsyncRequests: 5, // 异步模块并行加载模块数，默认值为5
        //     maxInitialRequests: 3, // 初始加载模块最大并行请求数，默认值为3
        //     automaticNameDelimiter: '~',
        //     // name: 'tomy_vendor', // 指定缓存组块的名称
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10,
        //             reuseExistingChunk: true
        //         },
        //         // default:false,
        //         // default: {
        //         //     minChunks: 2,
        //         //     priority: -20,
        //         //     reuseExistingChunk: true
        //         // }
        //     },
        //     // cacheGroups: {
        //     //   vendor: {
        //     //     test: /[\\/]node_modules[\\/]/,
        //     //     name: 'vendors',
        //     //     chunks: 'all'
        //     //   }
        //     // }
        // },
        // object string boolean 将optimization.runtimeChunk设置为true或“multiple”会为每个仅包含运行时的入口点添加一个额外的块。
        // 默认值为false：为每个entry chunk嵌入运行时。
        runtimeChunk: false,
        // 取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不输出资源。 在编译时出现错误时，使用optimization.noEmitOnErrors跳过发射阶段。 这可确保不会发出错误资产。
        noEmitOnErrors: true,
        // 告诉webpack生成代码时使用可读的模块(modules)标识符以获得更好的调试。生产环境默认关闭，开发环境默认开启
        namedModules: false,
        // 告诉webpack使用可读的块(chunks)标识符以获得更好的调试。生产环境默认关闭，开发环境默认开启
        namedChunks: false,
        // 告诉webpack在打包选择模块（module）ID时使用哪种算法。默认值为false，不使用任何内建算法，可以指定通过其他插件来指定算法
        moduleIds: false,
        // 告诉webpack在选择块（chunk）ID时使用哪种算法。bool: false string: natural, named, size, total-size 配置规则同上moduleIds
        chunkIds: false,
        // 无需特殊设置-告诉webpack将process.env.NODE_ENV设置为给定的字符串值。 // 可能的值：1、任何字符串：给process.env.NODE_ENV设置的值。2、false：不修改/设置process.env.NODE_ENV的值。
        nodeEnv: 'production',
        // 无需单独设置 bool: false 设置为true时，告诉webpack通过将导入更改为更短的字符串来减小WASM的大小。它会破坏模块和导出名称。
        mangleWasmImports: false,
        // 无需单独设置 bool: true 当这些子模块存在于父级中的时候，告诉webpack检测并从块中删除这些模块
        removeAvailableModules: true,
        // 无需单独设置 bool: true 告诉webpack检测并删除空的块。
        removeEmptyChunks: true,
        // 无需单独设置 bool: true  告诉webpack合并包含相同模块的块。
        mergeDuplicateChunks:true,
        // 无需单独设置 告诉webpack确定并标记作为其他块的子集的块，其方式是当已经加载较大的块时不必加载子集。默认在生产模式下开启，否则禁用
        flagIncludedChunks: true, 
        // 无需单独设置 告诉webpack找出模块的顺序，这样可以让初始包变到最小。 默认在生产模式下启用，否则禁用。
        occurrenceOrder: true,

        // 无需单独设置 告诉webpack确定模块提供哪些导出，以便为 `export * from 'xxx.js'这种模式` 生成更高效的代码, 默认开启
        providedExports: true,
        // 无需单独设置 告诉webpack确定每个模块的已使用导出。这取决于providedExports。默认在生产模式下启用，否则禁用
        usedExports: true,
        // 无需单独设置 告诉webpack查找模块结构图的各个部分，这些部分可以安全地连接成一个模块。 取决于providedExports和usedExports。默认在生产模式下启用，否则禁用
        concatenateModules: true,
        // sideEffects主要用来用来做tree-shake
        // sideEffects告诉webpack 识别引入模 package.json中的sideEffects标志或规则,以跳出 没有在(未使用) 导出时标记为不包含副作用的模块，
        // 依赖于optimization.providedExports和optimization.usedExports
        // 通过给 package.json 加入 sideEffects: false|true 声明该包模块是否包含 sideEffects(副作用)，从而可以为 tree-shaking 提供更大的优化空间。 默认在生产模式下启用，否则禁用
        // 比如比如vue库的 package.json 设置为 sideEffects:false ，则optimization.sideEffects:true 之后 
        // import { xxx } from 'vue' 将 打包成 import xxx from 'vue/xxx', 因为标记vue将自己标记为没有副作用的包(vue就sideEffects设置为false了)，所以符合跳过规则
        // Webpack 中的 sideEffects 到底该怎么用？ https://segmentfault.com/a/1190000015689240
        // 如果我们引入的 包/模块 被标记为 sideEffects: false 了，那么不管它是否真的有副作用，只要它没有被引用到，整个 模块/包 都会被完整的移除
        sideEffects: false,

        // 无需单独设置 bool: false 告诉webpack生成具有相对路径的记录，以便能够移动上下文文件夹。
        portableRecords: false,
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
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
            }
        }),

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

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),

        new OpenBrowserWebpackPlugin({
            browser: 'Chrome',
            url: 'http://localhost:9090',
        }),

        new CleanWebpackPlugin(['dist/build','dist/vendors'],{
            // webpack文件夹的绝对路径,Default: root of your package
            root: __dirname,
            verbose: false,
            dry: true,
            // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
            // exclude: ['manifest.json'],
        }),
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
        // 编译控制台打印美化
        // new FriendlyErrorsWebpackPlugin(
        //     {
        //         compilationSuccessInfo: {
        //             messages: ['You app is running at http://localhost:3000'],
        //             notes: ['------------compile-over-----------------']
        //         },
        //         onErrors: function (severity, errors) {
        //             // You can listen to errors transformed and prioritized by the plugin
        //             // severity can be 'error' or 'warning'
        //         },
        //         // should the console be cleared between each compilation?
        //         // default is true
        //         clearConsole: true,
        //         // add formatters and transformers (see below)
        //         additionalFormatters: [],
        //         additionalTransformers: []
        //     }
        // ),
        // Antd icon 本地化
        // new StringReplacePlugin(),
        // 打包分析
        // new BundleAnalyzerPlugin(),
    ],
    // 文件解析配置
    resolve: {
        // 默认后缀名，配置后可省略
        extensions: ['.js', '.jsx','.es6'],
        // 指定模块查找目录，import 'redux'这样不是相对也不是绝对路径的写法时会去node_modules目录下找。但是默认的配置会采用向上递归搜索的方式去寻找node_modules
        modules: [path.resolve(__dirname, 'node_modules')],
        // 文件夹别名配置
        alias: {
            // 配置缩写路径 应用如下 @/components/App.jsx
            '@': path.resolve('source'),
            // 旧写法需要单独配置多个
            // components: path.resolve(__dirname, './source/components'),
            // $缩小查询范围，提升查询速度
            // react$: path.resolve(__dirname, 'react'),
            // 减少递归查询 发布到npm的库大多数都包含两个目录，一个是放着cmd模块化的lib目录，一个是把所有文件合成一个文件的dist目录，多数的入口文件是指向lib里面下的。 默认情况下webpack会去读lib目录下的入口文件再去递归加载其它依赖的文件这个过程很耗时，alias配置可以让webpack直接使用dist目录的整体文件减少文件递归解析。配置如下：
            // 'react': 'react/dist/react.js',
            // 防止antdicon全量打包临时方案 https://github.com/ant-design/ant-design/issues/12011
            // '@antd/icons/lib/dist$': path.resolve(__dirname, './source/icons.js'),
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
    // 引入意义？？？
    // dependencies: ["vendor.dll.92e3e6cb242f782bd03e.js"],
};



