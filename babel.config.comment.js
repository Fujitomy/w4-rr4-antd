/*
*
*  使用 webpack 4 和 Babel 7 配置 Vue.js 工程模板
*  https://segmentfault.com/a/1190000015247255
*
*  一口（很长的）气了解 babel
*  https://zhuanlan.zhihu.com/p/43249121
*
*  我们使用 @babel/cli 从终端运行 Babel，@babel/polyfill 来实现所有新的 JavaScript 功能，
*  env preset 只包含我们使用的功能的转换，实现我们的目标浏览器中缺少的功能
*
*
*
*  env = es2015 + es2016 + es2017
*  stage-0 = stage-1 + stage-2 + stage-3
*
*  babel-register
*
*  babel-register模块改写require命令，为它加上一个钩子。此后，每当使用require加载.js、.jsx、.es和.es6后缀名的文件，就会先用Babel进行转码。
*  使用时，必须首先加载babel-register。
*  require("babel-register");
*  require("./index.js");
*
*/


const path = require('path');
const plugins = [
    // 编译动态引入词法
    '@babel/plugin-syntax-dynamic-import',
    // 编译一些es7语法
    "@babel/plugin-proposal-class-properties",
    // 运行时，抽离重复打包的语法，
    // "@babel/plugin-transform-runtime",
    // 在webpack中，@babel/plugin-transform-runtime 实际上是依赖babel-runtime
    // 因为babel编译es6到es5的过程中，@babel/plugin-transform-runtime这个插件会自动polyfill es5不支持的特性，
    // 这些polyfill包就是在@babel/runtime这个包里core-js 、regenerator等poiiyfill模块
    // babel-runtime和 babel-plugin-transform-runtime的区别是，
    // 相当一前者是手动挡而后者是自动挡，每当要转译一个api时都要手动加上require('babel-runtime')，
    // 而babel-plugin-transform-runtime会由工具自动添加，
    // 主要的功能是为api提供沙箱的垫片方案，不会污染全局的api，因此适合用在第三方的开发产品中。

    // @babel/runtime优点
    //* 不会污染全局变量
    //* 多次使用只会打包一次
    //* 依赖统一按需引入,无重复引入,无多余引入
    // @babel/runtime缺点
    // * 不支持实例化的方法Array.includes(x) 就不能转化
    // * 如果使用的API用的次数不是很多，那么transform-runtime 引入polyfill的包会比不是transform-runtime 时大
    // 总的来说一句话，你可以使用内置的一些东西例如Promise,Set,Symbol等，
    // 就像使用无缝的使用polyfill,来使用babel 特性，并且无全局污染、极高的代码库适用性，适合用于库编写。

    // babel-polyfill
    // Babel默认只转换新的JavaScript句法（syntax），
    // 而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，
    // 以及一些定义在全局对象(BOM对象)上的方法（比如Object.assign）都不会转码。
    // babel-polyfill则是通过改写全局prototype的方式实现，比较适合单独运行的项目。
    // 开启babel-polyfill的方式，可以直接在代码中require，或者在webpack的entry中添加，也可以在babel的env中设置useBuildins为true来开启。
    // 但是babel-polyfill会有近100K，
    // 打包后代码冗余量比较大，
    // 对于现代的浏览器,有些不需要polyfill，造成流量浪费
    // 污染了全局对象
    // @babel/polyfill主要有两个缺点(在入口点全局引入@babel/polyfill)：
    // 使用@babel/polyfill会导致打出来的包非常大，因为 @babel/polyfill 是一个整体，把所有方法都加到原型链上。比如我们只使用了 Array.from，但它把 Object.defineProperty 也给加上了，这就是一种浪费了。这个问题可以通过单独使用 core-js 的某个类库来解决，core-js 都是分开的。
    // @babel/polyfill会污染全局变量，给很多类的原型链上都作了修改，如果我们开发的也是一个类库供其他开发者使用，这种情况就会变得非常不可控。

    // 因此在实际使用中，如果我们无法忍受这两个缺点(尤其是第二个)，通常我们会倾向于使用 babel-plugin-transform-runtime。
    // 但如果你的代码中包含高版本 js 中类型的实例方法
    // (例如 ECMAScript2016/ES7 中的 Array 实例方法 [1,2,3].includes(1))，这还是要使用 polyfill。

    // babel-polyfill主要由两部分组成，core-js和regenerator runtime。
    // core-js：提供了如ES5、ES6、ES7等规范中 中新定义的各种对象、方法的模拟实现。
    // regenerator：提供generator支持，如果应用代码中用到generator、async函数的话用到。
    // 链接：https://www.jianshu.com/p/7bc7b0fadfc2

    // 很多人说，集成了transform-runtime就不用babel-polyfill了，其实不然，看看官方怎么说的：
    // 注意：诸如“foobar”.includes（“foo”）之类的实例方法将无法工作，因为这需要修改现有的内置插件（使用babel-polyfill来实现）
    // 所以配置transform-runtime之后任然引入babel-polyfill的目的就是来实现一些实例化的新增全局对象调用了
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#technical-details
    // https://www.cnblogs.com/chyingp/archive/2018/06/01/understanding-babel-polyfill.html
    // https://www.cnblogs.com/JRliu/p/8280055.html

    [
        "@babel/plugin-transform-runtime",
        {
            "helpers": true,
            "regenerator": true, // 默认为true,切换生成器函数是否转换为使用不会污染全局范围的再生器运行时
            "useESModules":false, // 默认flase,启用后，转换将使用不通过@ babel/plugin-transform-modules-commonjs运行的帮助程序。 这允许在webpack等模块系统中进行较小的构建，因为它不需要保留commonjs语义。
            // "moduleName": "@babel/runtime",
            // "corejs": 2
        },
        // "transform-runtime"
    ],
    [
        "import",
        {
            "libraryName": "antd",
            "libraryDirectory": "lib", // `lib` 默认
            "style": "css" // `style: true` 会加载 less 文件
        },
        "antd"
    ]

    // 提案阶段插件，
    // babel-env只编译stage-4即已发布的语法，提案阶段的语法需要手动引入插件编译
    // babel-preset-env 变成了 @babel/preset-env。进一步，还可以省略 preset 而简写为 @babel/env。
    // babel-plugin-transform-arrow-functions 变成了 @babel/plugin-transform-arrow-functions。和 preset 一样，plugin 也可以省略，于是简写为 @babel/transform-arrow-functions。
    // stage-x 被删除了，它包含的插件虽然保留，但也被重命名了。babel 团队希望更明显地区分已经位于规范中的插件 (如 es2015 的 babel-plugin-transform-arrow-functions) 和仅仅位于草案中的插件 (如 stage-0 的 @babel/plugin-proposal-function-bind)。
    // 方式就是在名字中增加 proposal，所有包含在 stage-x 的转译插件都使用了这个前缀，语法插件不在其列。
    // 最后，如果插件名称中包含了规范名称 (-es2015-, -es3- 之类的)，一律删除。例如 babel-plugin-transform-es2015-classes 变成了 @babel/plugin-transform-classes。

    // // Stage 0
    // "@babel/plugin-proposal-function-bind",
    //
    // // Stage 1
    // "@babel/plugin-proposal-export-default-from",
    // "@babel/plugin-proposal-logical-assignment-operators",
    // ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    // ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    // ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
    // "@babel/plugin-proposal-do-expressions",
    //
    // // Stage 2
    // ["@babel/plugin-proposal-decorators", { "legacy": true }],
    // "@babel/plugin-proposal-function-sent",
    // "@babel/plugin-proposal-export-namespace-from",
    // "@babel/plugin-proposal-numeric-separator",
    // "@babel/plugin-proposal-throw-expressions",
    //
    // // Stage 3
    // "@babel/plugin-syntax-dynamic-import",
    // "@babel/plugin-syntax-import-meta",
    // ["@babel/plugin-proposal-class-properties", { "loose": false }],
    // "@babel/plugin-proposal-json-strings"
];

const presets = [
    // Babel 7 的 presets 设置由原来的 env 换成了 @babel/preset-env,
    // 可以配置 targets, useBuiltIns 等选项用于编译出兼容目标环境的代码。
    // 其中useBuiltIns如果设为 "usage"，Babel 会根据实际代码中使用的ES6/ES7代码，和你指定的targets，按需引入对应的 polyfill，
    // 而无需在代码中直接引入 import '@babel/polyfill'，避免输出的包过大，同时又可以放心使用各种新语法特性。
    // @babel/polyfill是一个编译新 api 或者方法的插件，是全局编译，是对所有语法的编译导出为一个公共包，不管你用没用都编译引入了
    // 不是用哪个编译输出哪个，类似于lodash 和 lodash.xxx 的区别
    [
        "@babel/preset-env",
        {
            // "modules": false,
            "targets": {
                //"browsers": "> 0.25%, not dead",
                "chrome":56,
                "ie": 11,
                // // "esmodules": true,
                // "debug": true // 加这个会导致报错
            },
            "useBuiltIns": 'usage', // usage只包括项目中需要的polyfill，而不是全局转换，这样会减少代码冗余量
        }
    ],
    '@babel/preset-react'
];

module.exports = {
    plugins,
    presets
};


/*
*  配置简读
*  Babel Note
*  语法转换
*
*  @babel/polyfill
*
*  babel 编译时只转换语法，几乎可以编译所有时新的 JavaScript 语法，但并不会转化BOM里面不兼容的API
*  babel 编译时只转换语法，几乎可以编译所有时新的 JavaScript 语法，但并不会转化BOM里面不兼容的API
*  babel 编译时只转换语法，几乎可以编译所有时新的 JavaScript 语法，但并不会转化BOM里面不兼容的API
*  比如 Promise,Set,Symbol,Array.from,async 等等的一些API，这时候就需要 polyfill 来转转化这些API
*
*
*  实现目标环境中缺少的功能，将es6+语法和api编译(转换)到低级浏览器比如ie9，ie8中，其使用用来打包程序业务代码，不适合打包库和框架文件
*  @babel/polyfill应该和@babel/preset-env和useBuiltIns选项一起使用，这样它就不会包含并不总是需要的整个polyfill。
*  否则，建议您手动导入单个polyfill。
*  TC39 Proposals
*  如果你需要使用还未发布到阶段4的提案，@babel/polyfil并不会自动帮你导入这些提案（语法插件）。
*  你必须单独从另外一个polyfill（如core-js）导入那些,我们会尽快努力的将其作为一个单独的文件包含在@babel/polyfill中
*  也就是需要手动配置非阶段4的提案API转译插件了
*  Usage in Node / Browserify / Webpack
*
*  require("@babel/polyfill");
*  要包含polyfill，您需要在你的应用程序入口的顶部引入它
*
*  import "@babel/polyfill";
*  如果你在你的应用程序入口使用es6的import导入语法，则应该在入口点的顶部导入polyfill，以确保首先加载polyfill
*
*
*  使用webpack,可以使用多种方法来include(包含引入)polyfill
*  当和@babel/preset-env一起使用时
*  1、如果在.babelrc中指定了useBuiltIns：'usage'，则不要在 webpack.config.js的entry入口配置项数组和源代码中包含@babel/polyfill
*    但是，你仍然需要安装@babel/polyfill
*
*  2、如果在.babelrc中指定了useBuiltIns：'entry'，则通过require或import将@babel/polyfill包含在应用程序入口点的顶部，如上所述。
*
*  3、如果未指定useBuiltIns键或在.babelrc中使用useBuiltIns：false显式设置，
*    请将@babel/polyfill直接添加到webpack.config.js中的entry入口配置项数组中。
*
*  如果未使用@babel/preset-env，
*  则将@babel/polyfill添加到webpack entry array中，如此：module.exports = {  entry: ["@babel/polyfill", "./app/js"]  };
*  它仍然可以通过import或require添加到应用程序入口点的顶部，但不建议这样做。
*
*  我们不建议直接引入整个polyfill，而是尝试使用useBuiltIns options配置项或者仅手动导入你需要的polyfill（从此包或其他地方）
*  比如导入提案语法包从package中，比如手动导入@babel/plugin-proposal-class-properties提案语法包
*
*  在浏览器中使用Usage in Browser
*  可从@ babel / polyfill npm版本中的dist / polyfill.js文件获得。 这需要包含在所有编译的Babel代码之前。 您可以将其添加到已编译的代码中，也可以将其包含在之前的<script>中。
*
*  如果您正在寻找不会修改要在工具/库中使用的全局变量的东西，请检查transform-runtime插件。
*  这意味着您将无法使用上面提到的实例方法，如Array.prototype.includes。
*  注意：根据您实际使用的ES2015方法，您可能不需要使用@ babel / polyfill或运行时插件。
*  您可能只想加载正在使用的特定polyfill（如Object.assign），或者仅记录加载库的环境应该包含某些polyfill。
*
*
*
*
*
*  babel-plugin-transform-runtime 插件做了以下三件事：
*当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator （使用 regenerator 运行时而不会污染当前环境） 。
* 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如   "foobar".includes("foo") ）。
* 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码）。
* 他们分别对应下面三个配置(默认都为true)
{
  "plugins": [
    ["transform-runtime", {
    　　  "regenerator": true,
         "polyfill": true,// default:true自动引入babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如"foobar".includes("foo") ）
         "helpers": true // default:true 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码）。
    }]
  ]
}
*
*
*
*
*/