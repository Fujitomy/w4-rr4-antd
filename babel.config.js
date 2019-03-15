
const path = require('path');
const plugins = [
    // 编译动态import词法
    '@babel/plugin-syntax-dynamic-import',
    // 编译一些es7语法
    '@babel/plugin-proposal-class-properties',
    // 按需加载polyfill，且不污染全局变量，
    // 入口处引入polyfill会全量引入，且污染全局
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
                "chrome": 56,
                "ie": 11,
                //"browsers": "> 0.25%, not dead",
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


