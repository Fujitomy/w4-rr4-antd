
const path = require('path');
const plugins = [
    // 编译动态import词法
    '@babel/plugin-syntax-dynamic-import',
    // 编译一些es7语法
    '@babel/plugin-proposal-class-properties',
    // 按需加载polyfill，且不污染全局变量，
    // 入口处引入polyfill会全量引入，且污染全局，但是可以编译原型（实例）方法和类（静态）方法，比如Array.includes
    [
        "@babel/plugin-transform-runtime",
        {
            "helpers": true, // 是否切换将内联（inline）的 Babel helper（classCallCheck，extends 等）替换为对 moduleName 的调用。
            // "polyfill": true,// v7默认为true，不需要设置了 是否切换新的内置插件（Promise，Set，Map等）为使用非全局污染的 polyfill。 
            "regenerator": true, // 默认为true,generator是否被转译成用regenerator runtime包装成不污染全局作用域的代码。
            "useESModules": true, // 默认flase,启用后，转换将使用不通过@babel/plugin-transform-modules-commonjs运行的帮助程序。 这允许在webpack等模块系统中进行较小的构建，因为它不需要保留commonjs语义。
            // "moduleName": "@babel/runtime", // string，默认为 "babel-runtime"。 当引入 helper 时，设置要使用的模块的名称/路径。
            "corejs": 2, // 不设置会打包成全局，污染全局变量，设置为2打包成沙盒引入 比如 Promise 打包成 var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"))
            "absoluteRuntime": true, 
        },
        "transform-runtime"
    ],
    // "@babel/plugin-transform-runtime",
    // antd按需加载
    [
        "import",
        {
            "libraryName": "antd",
            "libraryDirectory": "es", // es or lib
            "style": "css" // `style: true` 会加载 less 文件
        }
    ]
];

const presets = [
    [
        '@babel/preset-env',
        {
            // "ignore":["./module/xxx.js"] // 忽略转换编译的模块
            // "modules": false, // modules通常都会设置为false，因为默认都是支持CommonJS规范
            'targets': {
                browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
                // "chrome": 52,
                // "ie": 10,
                // "browsers": "> 0.25%, not dead",
                // "esmodules": true,
                // "debug": true // 加这个会导致报错
            },
            'useBuiltIns': 'usage' // usage只包括项目中需要的polyfill，而不是全局转换，这样会减少代码冗余量
        }
    ],
    '@babel/preset-react'
];

module.exports = {
    plugins,
    presets
};