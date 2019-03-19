# w4-rr4-antd


端口被占用
npm的时候 报错 端口被占用的解决方法 events.js:182 throw er;
// Unhandled 'error' event ^ Error: listen EADDRINUSE 127.0.0.1:8000 at Object.exports._errnoException (util.js:1024:11) at exports._e

vendors
vendors文件夹是公共依赖库，一次抽离，之后若公共包不更新便不用重新打包，减少编译代码，提升构建速度


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



# Webpack4.0Learn





#SplitChunksPlugin Reason The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。

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

我们来看看一些例子。


Defaults: Example 1

// index.js

// dynamically import a.js
import("./a");


// a.js
import "react";

// ...

结果：将创建一个包含react的单独块。 在导入调用时，此块与包含./a的原始块并行加载。

拆分依据：

条件1：块包含来自node_modules的模块
条件2：反应大于30kb
条件3：导入调用时的并行请求数为2
条件4：不影响初始页面加载时的请求

这背后的原因是什么？ react可能不会像您的应用程序代码那样频繁地改变。
通过将其移动到单独的块中，可以将此块与应用程序代码分开缓存（假设您正在使用chunkhash，记录，Cache-Control或其他长期缓存方法）。



Defaults: Example 2

// entry.js

// dynamically import a.js and b.js
import("./a");
import("./b");



// a.js
import "./helpers"; // helpers is 40kb in size

// ...



// b.js
import "./helpers";
import "./more-helpers"; // more-helpers is also 40kb in size

// ...


结果：将创建一个单独的块，其中包含./helpers及其所有依赖项。 在导入调用时，此块与原始块并行加载。


为什么：

条件1：两个导入调用之间共享块
条件2：助手大于30kb
条件3：导入调用的并行请求数为2
条件4：不影响初始页面加载时的请求

将助手的内容放入每个块中将导致其代码被下载两次。 通过使用单独的块，这将只发生一次。
我们以新增一个额外的请求为代价，来避免该共享模块被重复下载，这是一种权衡后的结果。 这就是为什么最小尺寸为30kb。

Configuration：配置项
对于希望更好地控制此功能的开发人员，webpack提供了一组选项以更好地满足您的需求。
如果您手动更改拆分配置，请测量更改的影响，以查看并确保实现真正的好处。

通常默认配置是适应Web性能的最佳实践，但项目的最佳策略可能会有所折扣，这具体取决于项目性质。

{ cacheGroups }
The defaults assign all modules from node_modules to a cache group called vendors and all modules duplicated in at least 2 chunks to a cache group default.
默认情况下将分配所有来自node_modules的模块打包为一个名为vendors的cacheGroups文件，
并且这些模块，至少在两个文件chunks中声明或引用，才会打包到名为vendors文件中

A module can be assigned to multiple cache groups.
The optimization then prefers the cache group with the higher priority (priority option) or that one that forms bigger chunks.
可以将一个共享模块分配给多个cacheGroups。
然后，webpack.optimization倾向于选择具有较高优先级配置的cacheGroups（优先级选项）或来自比较大的chunks文去优化，并打包到该文件名下的cacheGroups中。



Conditions
当满足所有条件时，来自相同块和缓存组的模块将形成新块。

配置条件有4个选项：
minSize（默认值：30000）块的最小大小。
minChunks（默认值：1）在拆分之前共享模块的最小块数
maxInitialRequests（默认值3）入口点处的最大并行请求数
maxAsyncRequests（默认值为5）按需加载时的最大并行请求数


{ name }
To control the chunk name of the split chunk the name option can be used.
要控制拆分块的块名称，可以使用name选项。


为不同的拆分块分配相同的名称时，所有vendor modules都放在一个共享块中，但不建议这样做，因为它可以导致更多的代码下载。
（可以把多个重复引用的拆分快，都打包到一个公共的共享文件中，虽然可行，但不建议，因为它可以导致更多的代码下载）

true是一个神奇的值，会根据块和缓存组键自动选择名称，否则可以传递字符串或函数。

当名称与入口点名称匹配时，将删除入口点。

{ automaticNameDelimiter }
optimization.splitChunks.automaticNameDelimiter
默认情况下，webpack将使用源块和名称生成名称，例如vendors~main.js。

如果您的项目与〜字符有冲突，可以通过将此选项设置为适用于您的项目的任何其他值来更改它：automaticNameDelimiter：“ - ”。

然后生成的名称将看起来像vendors-main.js。

automaticNameDelimiter更改生成共享文件名称的链接符，默认为~


{ test } 共享模块选择方式
test参数控制选择哪一个模块打包到cacheGroups共享文件中。
忽略该参数不写将选择所有模块。
test的值它可以是正则，字符串或函数。
它可以匹配绝对模块资源路径或块名称。
匹配块名称时，将选择此块中的所有模块。

{ chunks }
使用chunks参数，可以配置选定的块。
可选值"initial", "async" and "all"
 配置时，优化仅选择初始块，按需块或所有块。

当模块完全匹配时，选项reuseExistingChunk允许重用现有块而不是创建新块。

改参数可以控制cacheGroups的打包策略


optimization.splitChunks.chunks = all

正如之前提到的，这个插件会影响动态导入的模块。 将optimization.splitChunks.chunks选项设置为“all”
初始块将受其影响（即使是未动态导入的那些）。 这样，甚至可以在入口点和按需加载之间共享块。
这是推荐的配置。

您可以将此配置与HtmlWebpackPlugin结合使用，它将为您注入所有生成的vendor模块


optimization.splitChunks的默认配置如下

splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
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
默认情况下，cacheGroups从splitChunks.*继承选项，但test，priority和reuseExistingChunk只能在cacheGroups对象里面配置。
cacheGroups是一个对象，其中键是cacheGroups（共享公共文件的）的名称。比如vendors将生成包含名为vendors的.js
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

// cnpm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env


#Error: Plugin/Preset files are not allowed to export objects, only functions. In D:\OtherX\Webpack4+\node_modules\babel-preset-react\lib\index.js

https://github.com/babel/babel-loader/issues/540
#Error: Module build failed: TypeError: this.setDynamic is not a function #560
https://github.com/babel/babel-loader/issues/560\


webpack中output配置项中chunkFilename属性的用法
https://www.cnblogs.com/toward-the-sun/p/6147324.html?utm_source=itdadao&utm_medium=referral


https://segmentfault.com/a/1190000008315937

路由刷新之后404需要配置服务器代理环境，devServer or nginx



Webpack 打包优化之速度篇
https://www.jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/

w4打包优化
https://www.cnblogs.com/wmhuang/p/8967639.html



