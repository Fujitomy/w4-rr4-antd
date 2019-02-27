
const path = require('path');

/*
*
*  使用 webpack 4 和 Babel 7 配置 Vue.js 工程模板
*  https://segmentfault.com/a/1190000015247255
*
*
*/

const plugins = [
    // 编译动态引入词法
    '@babel/plugin-syntax-dynamic-import',
    // 编译一些es7语法
    "@babel/plugin-proposal-class-properties",
    // 运行时，抽离重复打包的语法，
    "@babel/plugin-transform-runtime",

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
            "modules": false,
            "targets": {
                "browsers": "> 0.25%, not dead",
                "esmodules": true,
                "debug":true
            },
            "useBuiltIns": 'entry'
        }
    ],
    '@babel/preset-react'
];

module.exports = {
    plugins,
    presets
};