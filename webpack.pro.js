/*
* 生产环境编译配置
* NamedModulesPlugin && OccurrenceOrderPlugin
* https://blog.csdn.net/chenqiuge1984/article/details/80128021
*
* https://blog.csdn.net/weixiaoderensheng/article/details/82993332 编译异常
* https://blog.csdn.net/ZYC88888/article/details/80592654
* https://blog.csdn.net/u013738122/article/details/81809002 编译配置
*
*
*  最初，chunks(以及其在內部通過import导入的模块)，它们通过webpack graph中的父子关系进行连接
*  CommonsChunkPlugin被用于防止跨越它们引入重复依赖，但是也没法深入优化了
*  从webpack v4起，删除了CommonsChunkPlugin，转而使用optimization.splitChunks
*
*
*  Default
*  开箱即用的SplitChunksPlugin(默认配置)能够满足大多数用户的需求
*  By default it only affects on-demand chunks, because changing initial chunks would
*  affect the script tags the HTML file should include to run the project.
*  默认情况下，它仅影响按需加载的chunks，因为改变initial chunks（初始块）会影响HTML文件用应包含的script标签以运行项目
*  webpack will automatically split chunks based on these conditions:
*  webpack将根据以下条件自动拆分chunks
*  1、新的chunk可以共享，或者来自node_modules文件夹内
*  2、新的chunk至少要大于30kb (before min+gz)
*  3、按需加载块时的最大并行请求数小于或等于5
*  4、初始页面加载时的最大并行请求数将小于或等于3
*  webpack为希望更多控制此功能的开发人员提供了一组选项。
*  默认配置是Web性能最佳的实践，但你的项目得最佳策略可能会有所不同。 如果您要更改配置，则应衡量更改的影响，以确保实现真正的好处。
*  此配置对象表示SplitChunksPlugin的默认行为。
*
*  optimization: {
    splitChunks: {
      chunks: 'async', // 默认值，async抽离异步模块的共享部分
      minSize: 30000, // 要生成的块的最小尺寸，默认30kb。
      maxSize: 0,
      minChunks: 1, // 分割前必须共享模块的最小块数。
      maxAsyncRequests: 5, // 按需加载的最大并行请求数,默认值为5的理由，浏览器最大并行请求限制 负载均衡www.cnblogs.com/sunsky303/p/8862128.html
      maxInitialRequests: 3, // 初始入口文件的最大并行请求数，默认3
      automaticNameDelimiter: '~', // 默认生成的chunk文件分隔符是~
      name: true, //
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }

* splitChunks.automaticNameDelimiter
* 默认情况下，webpack将使用origin来源和chunks名称来生成名称（例如vendors~main.js）。 此选项允许您指定用于生成的名称的分隔符。
*
* splitChunks.chunks
* function (chunk) | string
* 选择哪些块进行优化,提供字符串时，有效值为all，async和initial。
*
* all
* 提供all可以特别强大，因为这意味着即使在异步和非异步块之间也可以共享chunks。
* optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
*
* function
* 或者，您可以通过一个function来提供更多控制功能。 返回值将指示是否包括每个块。
* optimization: {
    splitChunks: {
      chunks (chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'my-excluded-chunk';
      }
    }
  }
* 您可以将此配置与HtmlWebpackPlugin结合使用。 它将为您注入所有生成的vendor chunks块。
*
* maxSize
* 当共享块大小超过maxSize时，将共享块拆分成更小的共享块，该共享块不小于minSize(next to maxSize靠近最大值),
* maxSize选项旨在与HTTP / 2和长期缓存一起使用。它增加了请求数以获得更好的缓存。它还可用于减小文件大小以加快重建速度。
* maxInitialRequest/maxAsyncRequests < maxSize < minSize.
*
*
* splitChunks.name
* 拆分块的名称。 提供true将自动生成基于chunks和cache group key缓存组键的名称。
* 提供字符串或函数允许您使用自定义名称。
* 指定字符串或始终返回相同字符串的函数会将所有common modules和vendors合并为一个块。
* 这可能会导致更大的初始下载量和减慢页面加载速度。
* If the splitChunks.name matches an entry point name, the entry point will be removed.
* 如果splitChunks.name与入口点名称匹配，则将删除入口点。
* 对于生产版本，建议将splitChunks.name设置为false，以便它不会不必要地更改名称。
* 为不同的拆分块分配相同的名称时，所有vendors模块都放在一个共享块中，但不建议这样做，因为它可以导致更多的代码下载。
*
* splitChunks.cacheGroups
* cacheGroups可以继承或者覆盖splitChunks中的任何选项;
* 但是test，priority和reuseExistingChunk只能在缓存组级别配置。 要禁用任何默认缓存组，请将它们设置为false。
* optimization: {
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  }

  splitChunks.cacheGroups.priority
  模块可以属于多个缓存组。 优化将优先选择具有更高优先级的缓存组。
  默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为0）。

   splitChunks.cacheGroups.{cacheGroup}.reuseExistingChunk
   如果当前块包含已从主束拆分的模块，则将重用它而不是生成新的块。 这可能会影响块的结果文件名。

   optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          reuseExistingChunk: true
        }
      }
    }
  }

  splitChunks.cacheGroups.{cacheGroup}.test
  可能的值function (module, chunk) | RegExp | string
  控制此缓存组选择的模块。 省略它选择所有模块。 它可以匹配绝对模块资源路径或块名称。 匹配块名称时，将选择块中的所有模块。

   optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test(module, chunks) {
            //...
            return module.type === 'javascript/auto';
          }
        }
      }
    }
  }

  splitChunks.cacheGroups.{cacheGroup}.filename
  允许在当且仅当它是初始块时覆盖文件名。 output.filename中提供的所有占位符也可在此处获得。
  此选项也可以在splitChunks.filename中全局设置，
  但不建议这样做，如果splitChunks.chunks未设置为“initial”，则可能会导致错误。 避免全局设置。
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          filename: '[name].bundle.js'
        }
      }
    }
  }

  splitChunks.cacheGroups.{cacheGroup}.enforce
  boolean: false
  告诉webpack
  忽略splitChunks.minSize，splitChunks.minChunks，splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项,
  并始终为此缓存组创建chunks。

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          enforce: true
        }
      }
    }
  }

  
*/

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const manifest = require('./source/vendors/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[1];
const production = process.argv.indexOf('--mode=production') > -1;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
process.traceDeprecation = false; // 是否打印调用栈
process.noDeprecation = false; // 是否关闭弃用警告

// console.log(dllchunkname,'dllchunkname');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    // mode: 'development',
    mode: 'production',
    // 调试工具，错误打印等级，eval-source-map
    // devtool: "source-map",
    // webpack 4.0 之后独立出来，在配置文件中，配置才能生效，以前直接在packjson.script命令行中配置--colors也行
    stats: {
        colors: true,
        version: true,
    },
    devtool: 'none',
    // dependencies: ["vendor.dll.92e3e6cb242f782bd03e.js"],
    entry:{
        // index: path.resolve(__dirname,'./source/entry/index.js'),
        index: [
            'babel-polyfill', // 编译新版本js的新api(如Promise)，主要是让IE11能够执行编译后的代码
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
        libraryTarget: 'umd'
    },
    optimization:{
        minimize: true, // Tell webpack to minimize the bundle using the UglifyjsWebpackPlugin
        // minimizer: [new UglifyJsPlugin({/* your config */})],  // 允许用户使用其他最小化插件，覆盖webpack默认最小化编译器
        // usedExports: true,
        // // 识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
        // // 依赖于optimization.providedExports和optimization.usedExports
        // sideEffects: true,
        // //取代 new webpack.optimize.ModuleConcatenationPlugin()
        // concatenateModules: true,
        // //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
        // noEmitOnErrors: true,
        splitChunks: {
            // 抽离所有共享模块，即便是异步和同步模块间共享的也抽离出来
            // chunks: 'all',
            chunks: 'async',
            // 自定义抽离模块，可以排除掉一些已经抽离的模块，比如react，react-router，antd类似相对稳定的模块
            // chunks (chunk) {
            //     // exclude `my-excluded-chunk`
            //     console.log(chunk.name,'----------模块名称');
            //     return chunk.name !== 'react' && chunk.name !== 'react-router-dom'  && chunk.name !== 'react-dom';
            // },
            minSize: 30000, // 模块大于30k会被抽离到公共模块
            maxSize: 1024*1000,
            minChunks: 1, // 模块出现1次就会被抽离到公共模块
            maxAsyncRequests: 5, // 异步模块并行加载模块数，默认值为5
            maxInitialRequests: 3, // 初始加载模块最大并行请求数，默认值为3
            automaticNameDelimiter: '~',
            // name: 'tomy_vendor', // 指定缓存组块的名称
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // reuseExistingChunk: true
                },
                // default:false,
                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true
                // }
            },
        },
    },
    plugins: [
        // 引入dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./source/vendors/vendor.manifest.json')
        }),
        // // 模板插件
        new HtmlWebpackPlugin({
            title: 'react-router 4 && webpack4.0+ && antd.design',
            template: './source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: '../index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'body',// 资源文件注入位置true,body,header,false
            // inline: true, // ????
            // 动态引入dll， manifest就是dll生成的json
            vendor: /*manifest.name*/'./vendors/vendor.dll.' + dllchunkname + '.js',
            // manifest: './vendors/vendor.manifest.json',
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
        // antd icon 本地化
        // new StringReplacePlugin(),
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
                    // query: {},
                    // options: {
                    //     // 编译规则，如果不开启，编译jsx会报错，旧配置presets: ['es2015', 'react']
                    //     presets: [
                    //         ['@babel/preset-env',{
                    //             "targets": {
                    //                 "esmodules": true
                    //             }
                    //         }],'@babel/preset-react'
                    //     ],
                    //     // plugins: ['syntax-dynamic-import'],
                    //     // plugins: ['@babel/plugin-transform-runtime']
                    //     // 这个也可以在.babelrc中配置
                    //     // plugins:[
                    //     //     // 数组写法在babel7中已经弃用
                    //     //     ['import',{libraryName:'antd', style:true}]
                    //     // ],
                    //     // This is a feature of `babel-loader` for webpack (not Babel itself).It enables caching results in ./node_modules/.cache/babel-loader/directory for faster rebuilds.
                    //     // 这是webpack的“babel-loader”特征（不是Babel本身）。
                    //     // 它可以在./node_modules/.cache/babel-loader/目录中启用缓存结果，以便更快地进行重建。
                    //     cacheDirectory: true,
                    //     compact: true,
                    //     plugins: [
                    //         [
                    //             // "transform-runtime",
                    //             // "import",
                    //             // {
                    //             //     "libraryName": "antd",
                    //             //     // "libraryDirectory": "lib",
                    //             //     "style": "css" // `style: true` 会加载 less 文件
                    //             // }
                    //             "import",
                    //             {
                    //                 "libraryName": "antd",
                    //                 "libraryDirectory": "es",
                    //                 "style":   "css"// true 会打less
                    //             },
                    //             "ant"
                    //         ],
                    //         // "@babel/plugin-transform-runtime",
                    //         // '@babel/plugin-proposal-object-rest-spread',
                    //         // 编译动态引入语法，e.g: import('./xxx.js')
                    //         "syntax-dynamic-import",
                    //         // 编译一些es7语法
                    //         "@babel/plugin-proposal-class-properties",
                    //
                    //
                    //
                    //         // [
                    //         //     "@babel/plugin-transform-runtime",
                    //         //     {
                    //         //         "corejs": false,
                    //         //         "helpers": true,
                    //         //         "regenerator": true,
                    //         //         "useESModules": true
                    //         //     }
                    //         // ],
                    //     ]
                    // }
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
            // {
            //     test:/\.css$/,
            //
            //     use: [
            //         new MiniCssExtractPlugin().loader,
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 minimize:true || process.env.NODE_ENV === 'production'
            //             }
            //         }
            //     ],
            // },
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
        },
    },
    // externals: {
    //     'react-router-dom': 'react-router-dom',
    //     react: 'react',
    //     'react-dom': 'react-dom'
    // }
};