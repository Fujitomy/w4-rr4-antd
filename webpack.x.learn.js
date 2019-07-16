/**
 *  很混乱整理中，很混乱整理中，很混乱整理中
 * 
 */

{
 `
 `optimization.splitChunks `
 * 最初，chunks(以及其在內部通過import导入的模块)，它们通过webpack graph中的父子关系进行连接
 * 从webpack v4起，删除了CommonsChunkPlugin，转而使用optimization.splitChunks 
 *
 * 默认情况下
 * 开箱即用的SplitChunksPlugin(默认配置)能够满足大多数用户的需求
 * By default it only affects on-demand chunks, because changing initial chunks would
 * affect the script tags the HTML file should include to run the project.
 *
 * 默认情况下，它仅影响按需加载的chunks，因为改变initial chunks（初始块）会影响HTML文件用应包含的script标签以运行项目
 * webpack will automatically split chunks based on these conditions:
 * webpack将根据以下条件自动拆分chunks
 *  1、新的chunk可以共享，或者来自node_modules文件夹内
 *  2、新的chunk至少要大于30kb (before min+gz)
 *  3、按需加载块时的最大并行请求数小于或等于5
 *  4、初始页面加载时的最大并行请求数将小于或等于3
 * webpack为希望更多控制此功能的开发人员提供了一组选项。
 * 默认配置是Web性能最佳的实践，但你的项目得最佳策略可能会有所不同。
 * 如果要更改配置，则应权衡利弊，以确保实现真正的好处
 * 

// webpack默认配置
optimization: {
  splitChunks: {
    chunks: 'async', // 默认值，async抽离异步模块的共享部分
    minSize: 30000, // 要生成的块的最小尺寸，默认30kb。
    maxSize: 0,
    minChunks: 1, // 分割前必须共享模块的最小块数。
    maxAsyncRequests: 5, // 按需加载的最大并行请求数,默认值为5的理由，浏览器最大并行请求限制 负载均衡www.cnblogs.com/sunsky303/p/8862128.html
    maxInitialRequests: 3, // 初始入口文件的最大并行请求数，默认3
    automaticNameDelimiter: '~', // 默认生成的chunk文件分隔符是~，此选项允许您指定用于生成的名称的分隔符。，例如vendors~main.js
    name: true, // 打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
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


* splitChunks.chunks
* function (chunk) | string
* 选择哪些块进行优化,提供字符串时，有效值为all，async和initial。
*

optimization: {
  splitChunks: {
  // all特别强大，这意味着即使在异步和非异步块之间也可以共享chunks。 
  chunks: 'all' 
  // 通过一个function来提供更多控制功能。 返回值将指示是否包括每个块。   
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


* splitChunks.name
* 拆分块的名称。 提供true将自动生成基于chunks和cache group key缓存组键的名称。
* 提供字符串或函数允许您使用自定义名称。
* 指定字符串或始终返回相同字符串的函数会将所有common modules和vendors合并为一个块。
* 这可能会导致更大的初始下载量和减慢页面加载速度。
* 如果splitChunks.name与入口点名称匹配，则将删除入口点。
* 对于生产版本，建议将splitChunks.name设置为false，以便它不会不必要地更改名称。
* 为不同的拆分块分配相同的名称时，所有vendors模块都放在一个共享块中，但不建议这样做，因为它可以导致更多的代码下载。


* splitChunks.cacheGroups
* cacheGroups可以继承或者覆盖splitChunks中的任何选项;
* 但是test，priority和reuseExistingChunk只能在缓存组级别配置。 要禁用任何默认缓存组，请将它们设置为false。

optimization: {
  splitChunks: {
    cacheGroups: {
      default: false
    }
  }
}

* splitChunks.cacheGroups.priority
* 模块可以属于多个缓存组。 优化将优先选择具有更高优先级的缓存组。
* 默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为0）。

* splitChunks.cacheGroups.{cacheGroup}.reuseExistingChunk
* 如果当前块包含已从主束拆分的模块，则将重用它而不是生成新的块。 这可能会影响块的结果文件名。

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

* splitChunks.cacheGroups.{cacheGroup}.filename
* 允许在当且仅当它是初始块时覆盖文件名。 output.filename中提供的所有占位符也可在此处获得。
* 此选项也可以在splitChunks.filename中全局设置，
* 但不建议这样做，如果splitChunks.chunks 未设置为 initial，则可能会导致错误。 避免全局设置。

optimization: {
  splitChunks: {
    cacheGroups: {
      vendors: {
        filename: '[name].bundle.js'
      }
    }
  }
}

* splitChunks.cacheGroups.{cacheGroup}.enforce
* boolean: false
* 告诉webpack忽略splitChunks.minSize，splitChunks.minChunks，
* splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项,并始终为此缓存组创建chunks。

optimization: {
  splitChunks: {
    cacheGroups: {
      vendors: {
        enforce: true
      }
    }
  }
}

`

}

{
  `

react-router 4.0+
react-router 4 demo
https://codepen.io/bradwestfall/project/editor/XWNWge?preview_height=50&open_file=src/app.js

All About React Router 4
https://css-tricks.com/react-router-4/

React Router 4：痛过之后的豁然开朗
https://www.jianshu.com/p/bf6b45ce5bcc
React Router v4 入坑指南
https://www.jianshu.com/p/6a45e2dfc9d9

React-router4简约教程
http://react-china.org/t/react-router4/15843

# Webpack 4 Learn

# SplitChunksPlugin Reason The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。

最初，块（chunks）（以及在块chunks内部通过import导入的模块）通过内部webpack图中的父子关系进行连接。
CommonsChunkPlugin用于避免跨越它们的重复依赖，但是不能再进一步优化了

从版本4开始，CommonsChunkPlugin被删除，转而使用optimization.splitChunks和optimization.runtimeChunk选项。
以下是新流程的工作原理。

默认配置
开箱即用的SplitChunksPlugin应该适合大多数用户;
默认情况下，它仅影响按需块，因为更改初始块会影响HTML文件应包含的脚本标记以运行项目。

webpack.optimization.SplitChunksPlugin 将根据以下条件自动拆分块：

1、可以共享新块或来自node_modules文件夹的模块
2、新块将大于30kb（在min + gz之前）
3、根据需要加载块时的最大并行请求数（将）小于或等于5的时候
4、初始页面加载时的最大并行请求数（将）小于或等于3的时候
当试图满足最后两个条件时，首选更大的块。

案例1：
// index.js
// dynamically import a.js
import("./a");

// a.js
import "react";

结果：将创建一个包含react的单独块。 在导入调用时，此块与包含./a的原始块并行加载。

拆分依据：

条件1：块包含来自node_modules的模块
条件2：react大于30kb
条件3：导入调用时的并行请求数为2（小于5）
条件4：不影响初始页面加载时的请求（小于3）

这背后的原因是什么？ react可能不会像您的应用程序代码那样频繁地改变。通过将其移动到单独的块中，
可以将此块与应用程序代码分开缓存（假设您正在使用chunkhash，记录，Cache-Control或其他长期缓存方法）

案例2
// entry.js
// dynamically import a.js and b.js
import("./a");
import("./b");

// a.js
import "./helpers"; // helpers is 40kb in size

// b.js
import "./helpers";
import "./more-helpers"; // more-helpers is also 40kb in size

// ...


结果：将创建一个单独的块，其中包含./helpers及其所有依赖项。 在导入调用时，此块与原始块并行加载。

Why:

条件1：两个导入调用之间共享块
条件2：helpers模块大于30kb
条件3：导入调用的并行请求数为2
条件4：不影响初始页面加载时的请求

将helpers的内容放入每个块中将导致其代码被下载两次。 通过使用单独的块，这将只发生一次。
我们以新增一个额外的请求为代价，来避免该共享模块被重复下载，这是一种权衡后的结果。 这就是为什么最小尺寸为30kb。

Configuration：配置项
对于希望更好地控制此功能的开发人员，webpack提供了一组选项以更好地满足您的需求。
如果您手动更改拆分配置，请权衡更改的影响，以查看并确保其实现真正的好处。

通常默认配置是适应Web性能的最佳实践，但项目的最佳策略可能会有所折扣，这具体取决于项目性质。

webpack.optimization.splitChunks.cacheGroups
`The defaults assign all modules from node_modules to a cache group called vendors and all modules duplicated in at least 2 chunks to a cache group default.`
默认情况下将分配所有来自node_modules的模块打包为一个名为vendors的cacheGroups文件，
并且这些模块，至少在两个文件chunks中声明或引用，才会打包到名为vendors文件中

`A module can be assigned to multiple cache groups`
`The optimization then prefers the cache group with the higher priority (priority option) or that one that forms bigger chunks`
可以将一个共享模块分配给多个cacheGroups。
然后，webpack.optimization 倾向于选择具有较高优先级配置的cacheGroups（优先级选项）,
或来自比较大的chunks文去优化，并打包到该文件名下的cacheGroups中。

`当满足所有条件时，来自相同块和缓存组的模块将形成新块 `

配置条件有4个选项：
minSize（默认值：30000）块的最小大小。
minChunks（默认值：1）在拆分之前共享模块的最小块数
maxInitialRequests（默认值3）入口点处的最大并行请求数
maxAsyncRequests（默认值为5）按需加载时的最大并行请求数


` optimization.splitChunks.name `
要控制拆分块的块名称，可以使用name选项。
可以把多个重复引用的拆分快，都打包到一个公共的共享文件中，虽然可行，但不建议，因为它可以导致更多的代码下载
true 是一个神奇的值，会根据块和缓存组键自动选择名称，也可以传递字符串或函数。当名称与入口点名称匹配时，将删除入口点。


`optimization.splitChunks.automaticNameDelimiter`

automaticNameDelimiter 更改生成共享文件名称的链接符，默认为~
默认情况下，webpack将使用源块和名称生成名称，例如vendors~main.js。

如果您的项目与〜字符有冲突，可以通过将此选项设置为适用于您的项目的任何其他值来更改它：automaticNameDelimiter：'-'。
然后生成的名称将看起来像vendors-main.js。

optimization.test  共享模块选择方式
test参数控制选择哪一个模块打包到cacheGroups共享文件中。
忽略该参数不写将选择所有模块。
test的值它可以是正则，字符串或函数。
它可以匹配绝对模块资源路径或块名称。
匹配块名称时，将选择此块中的所有模块。

optimization.chunks。
optimization.chunks : "initial" | "async" | "all"

chunks参数可以控制cacheGroups的打包策略 ,配置optimization仅选择初始块，按需块或所有块。

当模块完全匹配时（即不同模块引用了相同的模块），选项reuseExistingChunk允许重用现有块而不是创建新块。

optimization.splitChunks.chunks = all

正如之前提到的，这个插件会影响动态导入的模块。 
'all' => 初始块将受其影响（即使是未动态导入的那些）。 这样，甚至可以在入口点和按需加载之间共享块。
这也是推荐的配置。

您可以将此配置与HtmlWebpackPlugin结合使用，它将为您注入所有生成的vendor模块

optimization.splitChunks的默认配置如下

splitChunks: {
    chunks: "async", //默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
    minSize: 30000, // 表示在压缩前的最小模块大小，默认是30kb；
    minChunks: 1, // 表示被引用次数，默认为1
    maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为5；
    maxInitialRequests: 3, //最大的初始化加载次数，默认为3；
    automaticNameDelimiter: '~', // 抽取的chunks的名称分隔符
    name: true, // 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成，如果是true，将自动生成基于块和缓存组键的名称。如果是字符串或函数将允许您使用自定义名称。如果名称与入口点名称匹配，则入口点将被删除。
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/, // 可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该vendors的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。[有人尝试过程中发现不能提取出css，待进一步验证]。
            priority: -10, //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
            // enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
        },
        default: {
            minChunks: 2,  // 最少被几个chunk引用
            priority: -20,
            reuseExistingChunk: true, // 如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        }
    }
}

默认情况下，cacheGroups从splitChunks.*继承选项，但test，priority和reuseExistingChunk只能在cacheGroups对象里面配置。
cacheGroups是一个对象，其中键是cacheGroups（共享公共文件的）的name。比如vendors将生成包含名为vendors的.js
可以使用上面列出的所有选项：chunks，minSize，minChunks，maxAsyncRequests，maxInitialRequests，name。

您可以将optimization.splitChunks.cacheGroups.default设置为false以禁用默认cacheGroups，
对于vendors cacheGroups也是如此。

default对象的优先级为负，以允许任何自定义cacheGroups采用更高的优先级（默认值为0）。

splitChunks:案例1
创建一个公共块，其中包括入口点之间共享的所有代码。
splitChunks: {
    cacheGroups: {
        commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
        }
    }
}

此配置会增大您的初始bundles打包文件，建议在不立即需要模块时使用import()动态导入。

splitChunks:案例2
创建一个名为vendors共享资源模块，其中包括所有引用来自node_modules的代码，
这可能会导致包含所有外部包的大块。 建议仅包含核心框架和实用程序，并动态加载其余的依赖项。
splitChunks: {
    cacheGroups: {
        commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
        }
    }
}

将optimization.runtimeChunk设置为true会为每个仅包含运行时的入口点添加一个附加块。
单值代替创建一个运行时文件，以便为所有生成的块共享。

  `
}

// 以下配置作废
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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

process.traceDeprecation = false; // 是否打印调用栈
process.noDeprecation = false; // 是否关闭弃用警告

const config = {
    mode:'production',
    devtool: "source-map", // eval-source-map
    stats: {
      colors: true,
      version: true,
    },
    devtool: 'none',
    // dependencies: ["vendor.dll.92e3e6cb242f782bd03e.js"],
    entry:{
      // index: path.resolve(__dirname,'./source/entry/index.js'),
      index: [
        // 编译新版本js的新api(如Promise)，主要是让低版本瀏覽器可以支持es6+的新增api和全局對象
        // 在入口引入会导致污染全局变量，需要结合transform-runtime来在运行时打包，但是transform-runtime并不会加载到实例方法中,怎么办呢？
        // 除此之外有没有更好的办法
        'babel-polyfill',
        path.resolve(__dirname, './source/entry/index.js')
      ]
    },
    // devServer模式下不配置output也是可以的
    output: {
        filename: '[name].[hash].js',
        chunkFilename: "[name].chunk.[chunkhash:8].js",
        path: path.resolve(__dirname,'./dist/build/'),
        publicPath: './build/',
    },
    optimization:{
        // minimize: true, // Tell webpack to minimize the bundle using the UglifyjsWebpackPlugin
        minimizer: [
            // // 压缩 js
            // new UglifyJsPlugin({
            //     cache: path.resolve(__dirname, "cache"),
            //     parallel: os.cpus().length - 1
            // }),

            // 压缩分离的 css
            // new OptimizeCssAssetsPlugin({
            //     cssProcessor: require("cssnano"),
            //     cssProcessorOptions: {
            //         discardComments: { removeAll: true }
            //     }
            // }),

            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        // minimizer: [new UglifyJsPlugin({/* your config */})],  // 允许用户使用其他最小化插件，覆盖webpack默认最小化编译器
        // usedExports: true,
        // // 识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
        // // 依赖于optimization.providedExports和optimization.usedExports
        // sideEffects: true,
        // //取代 new webpack.optimize.ModuleConcatenationPlugin()
        // concatenateModules: true,
        // //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
        noEmitOnErrors: false,
        splitChunks: {
            name: true,
            // 抽离所有共享模块，即便是异步和同步模块间共享的也抽离出来
            // chunks: 'all',
            // chunks: 'async',
            // 自定义抽离模块，可以排除掉一些已经抽离的模块，比如react，react-router，antd类似相对稳定的模块
            // chunks (chunk) {
            //     // exclude `my-excluded-chunk`
            //     console.log(chunk.name,'----------模块名称');
            //     return chunk.name !== 'react' && chunk.name !== 'react-router-dom'  && chunk.name !== 'react-dom';
            // },
            minSize: 30000, // 模块大于30k会被抽离到公共模块
            chunks: 'all',
            maxSize: 512*1000,
            minChunks: 1, // 模块出现1次就会被抽离到公共模块
            maxAsyncRequests: 6, // 异步模块并行加载模块数，默认值为5
            maxInitialRequests: 6, // 初始加载模块最大并行请求数，默认值为3
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
            '@': path.resolve('source'),
            // 旧写法需要单独配置多个
            // components: path.resolve(__dirname, './source/components'),
            // 减少递归查询 发布到npm的库大多数都包含两个目录，一个是放着cmd模块化的lib目录，一个是把所有文件合成一个文件的dist目录，多数的入口文件是指向lib里面下的。 默认情况下webpack会去读lib目录下的入口文件再去递归加载其它依赖的文件这个过程很耗时，alias配置可以让webpack直接使用dist目录的整体文件减少文件递归解析。配置如下：
            // 'react': 'react/dist/react.js',
            // 防止antdicon全量打包临时方案 https://github.com/ant-design/ant-design/issues/12011
            // '@antd/icons/lib/dist$': path.resolve(__dirname, './source/icons.js'),
            // $缩小查询范围，提升查询速度
            // react$: path.resolve(__dirname, 'react'),
            // '@antd/icons/lib/dist$': path.resolve(__dirname, './source/icons.js')
        },
    }
};

module.exports = config;