/**
 * @description Production assets config
 * @author tomy
 * 
 * Antd 按需加载
 * 原因：由于其全量引入了icon，期待后续antd给出新的api，控制入口文件大小在700kb以下
 *
 * 临时解决方案
 * https://github.com/ant-design/ant-design/issues/12011
 * https://www.zhihu.com/question/308898834
 * https://github.com/HeskeyBaozi/reduce-antd-icons-bundle-demo
 * 
 * 抽离css
 * http://wangwl.net/static/pages/npm_minicssextractplugin.html
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
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 }); // 开启一个多线程，线程数量等于最大线程减一，几乎全开

const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[3];

const nodeEnv = process.argv.indexOf('--mode=production') > -1;

process.traceDeprecation = true; // 是否打印调用栈
process.noDeprecation = true; // 是否关闭弃用警告
// console.log(dllchunkname,'dllchunkname');

// webpack的三种chunk类型 entry chunk, children chunk , common chunk

module.exports = {
    // tree shaking 新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，
    // 向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。
    mode: 'production',
    // 调试工具，浏览器控制台错误打印配置，eval-source-map
    devtool: 'none', // devtool: "source-map",
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。默认关闭。
    watch: true,
    // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader，其上下文是入口文件所处的目录的绝对路径的字符串
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
    // 指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」
    output: {
        // filename 决定了每个 打包文件/bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        // 此选项，不会影响那些「按需加载 chunk」的输出文件，filename 基本上都是入口文件和基础依赖文件
        // 通过 loader 创建的文件也不受影响。在这种情况下，你必须尝试 loader 特定的可用选项。
        filename: '[name].js',   // '[id].[hash:4].js'
        
        // output: 输出目录对应一个绝对路径，指定 bundle 文件输出路径
        path: path.resolve(__dirname,'./dist/build/'),

        // chunkFilename: 非入口(non-entry) chunk 文件的名称。配置方式和filename类似，可以在 optimization.splitChunks.cacheGroups.vender 中重命名
        chunkFilename: "[name].[chunkhash:6]" || '[name].js' ||"[id].[chunkhash:6]", //"[name].[chunkhash:8].js"

        // 输出解析文件的目录，url 相对于 HTML 页面
        // publicPath 指定按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）路径，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。
        publicPath: './build/', 
    },
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
        // minimize: true, // 告诉webpack使用其默认的压缩混淆插件 UglifyJs 混淆代码
        // minimizer 允许用户自定义插件来优化配置，该配置会覆盖默认的配置，结合UglifyJsPlugin插件使用
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        // 深入理解 Webpack 打包分块 https://juejin.im/post/5cdfb48fe51d4510ac6721b7
        // https://www.cnblogs.com/wmhuang/p/8967639.html webpack4：连奏中的进化
        // webpack 4 Code Splitting 的 splitChunks 配置探索： https://imweb.io/topic/5b66dd601402769b60847149
        splitChunks: {
            chunks: 'all',
            minSize: 30000, // 模块大于30k会被抽离到公共模块
            maxSize: 500000, // 超过指定的大小就抽离成更小的模块
            minChunks: 1, // 模块出现1次就会被抽离到公共（共享）模块
            maxAsyncRequests: 9, // 异步模块并行加载模块数，默认值为5
            maxInitialRequests: 6, // 初始加载模块最大并行请求数，默认值为3
            automaticNameDelimiter: '-', // 模块名称的连接符号
            name: true,  // 指定缓存组块的名称,true 默认开头为vendors ,也可以指定为字符串
            // true | string | function(module, chunks, cacheGroupKey){ }
            // name:(module, chunks, cacheGroupKey)=> {
            //   // console.log(cacheGroupKey,'-----------cacheGroupKey name');
            //   cacheGroups里默认自带 vendors 配置来分离node_modules里的类库模块，
            //   所以不设置或者设置为true,cacheGroupKey = vendors，默认名称为vendors，生成，类似 vendors~13asd78sa.js
            //   return cacheGroupKey; 
            // },
            cacheGroups: {
                commons: {
                    name: 'vendor-page', // 要缓存的 分隔出来的 chunk 名称 ???
                    test: /[\\/]node_modules[\\/]/,
                    //chunks: 'initial',
                    priority: 10,
                    minChunks: 2, // 把所有 node_modules 的模块被不同的 chunk 引入超过 2 次的抽取为 commons
                    reuseExistingChunk: true
                },
                antd: {
                    name: 'chunk-antd',
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 20,
                    chunks: 'async'
                },
                // 把 lodash 模块抽取为 lodash
                lodash: {
                    name: 'chunk-lodash',
                    test: /[\\/]node_modules[\\/]lodash[\\/]/,
                    priority: 30,
                    chunks: 'async'
                },
                // 把 lodash 模块抽取为 lodash
                lodashChunk: {
                    name: 'reactBase',
                    test: (module) => {
                        return /lodash/.test(module.context);
                    },
                    chunks: 'initial',
                    priority: 12,
                },
                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true
                // }
            }
        },
        // 提取 webpack 运行时代码，默认值为false，设置为true或multiple会为每个仅包含运行时的入口点添加一个额外的块。
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

    // 加载器/loader
    // Webpack的loader加载器机制用于处理非 JavaScript 文件，并将其转换为Webpack能够处理的有效模块。
    // 即将JavaScript之外的其它类型文件，转换为 bundle 可以直接引用的模块
    // 例如：将文件从TypeScript转换为JavaScript，或者把内联图片转换为data URL，甚至允许在JavaScript模块内引入CSS文件。
    // Webpack配置文件中的 module 属性主要用于加载各种模块，可以通过其内嵌的 rules 属性指定加载某种类型文件时所需要使用到的 loader 加载器。
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
    // plugin 如同上面(加载器loader)所描述的那样，loader用于转换某些类型的模块，而插件plugin得益于其丰富的接口，
    // 可以用来处理加载器loader无法实现的更加丰富的任务，例如：打包优化与压缩、重新定义环境变量等等。
    // Webpack的插件plugin本质是一个拥有 apply 属性的JavaScript对象，这个 apply 属性会被Webpack的 compiler 对象调用，而该对象可以在整个Webpack编译生命周期内进行访问。
    plugins: [
        // 引入dll（react，react-router之类的基础依赖库文件）
        new webpack.DllReferencePlugin({ 
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json')
        }),

        new HtmlWebpackPlugin({
            title: 'react-router 4 && webpack4.0+ && antd.design',
            template: './source/html/index.ejs', // html模板文档目录地址，webpack默认模板为ejs
            filename: '../index.html', // 由模板生成的文件html文件以及存放位置（带路径则表示存放位置）
            inject: 'body', // script标签位于html文件的 body 底部 注入,默认值:true， 
            author: 'tomy', // 加上编辑人
            hash: true, // hash选项的作用是 给生成的 js 文件一个独特的 hash 值 xxx.js?xxxxxx
            vendor: /*manifest.name*/'./vendors/vendor.dll.' + dllchunkname + '.js', // 动态引入dll， manifest就是dll生成的json
            // manifest: './vendors/vendor.manifest.json', // manifest只是运行时构建映射文件，不需要单独引入
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

        // js线程 id：js 对应上文的 module.rules.use: happypack/loader?id=js
        new HappyPack({
            id: 'js', // 自定义的线程id='js'
            threads: 4,
            // 指定使用哪个线程池
            threadPool: HappyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true'],
            verbose: false,
        }),

        new HappyPack({
            id: 'node_moudles_css', // 自定义的线程id='node_moudles_css'
            threads: 4,
            threadPool: HappyThreadPool,  // 指定使用哪个线程池
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

        new CleanWebpackPlugin(['dist/build/','dist/vendors/'],{
            // webpack文件夹的绝对路径,Default: root of your package
            root: __dirname,
            verbose: false,
            dry: true,
            // 删除排除选项，无法排除指定正则文件格式,so,要排除从第一个参数吧
            // exclude: ['manifest.json'],
        }),

        // 经常使用的模块提取到打包编译文件靠前位置，提升查找效率和运行速度
        new webpack.optimize.OccurrenceOrderPlugin(),
        // // NamedModulesPlugin使用模块的相对路径作为模块的 id，只要我们不重命名一个模块文件，那么它的id就不会变，更不会影响到其它模块了
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
    ]
};



