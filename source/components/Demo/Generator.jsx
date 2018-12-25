/*
*  Generator 生成器
*
*  概念：
*  1、语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
*  2、执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。
*
*  Iterator是一种接口机制，数组或者类数组的对象，原生部属有 Symbol.iterator 属性，可以直接使用es6新增的 for of 循环
*  典型的Object对象没有 Symbol.iterator 属性，但是可以通过手动部属 Symbol.iterator 遍历器生成函数，来实现扩展
*
*  遍历器的目的:为了一种可中断，更高级，更便捷，可解构的循环遍历方式 for of 而生
*
*  Generator 生成器函数是一种api级别的语法，执行 Generator 生成器函数可以快速生成一个可遍历对象
*
*  语法：
*  在function 和 函数名 之间有一个 * 来表示这是一个生成器函数
*  函数体内部使用yield表达式，定义不同的内部状态
*
*  function * firstGenerator(){
*       yield 'hello';
*       yield 'world';
*       return 'ending';
*  }
*  const fg = firstGenerator();
*  fg.next(); // { value: 'hello', done: false }
*  fg.next(); // { value: 'world', done: false }
*  fg.next(); // { value: 'ending', done: true }
*  fg.next(); // { value: undefined, done: true }
*
*
*  调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。
*  以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。
*  value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
*
*
*  讲的挺好的
*  深入解析Javascript异步编程
*  https://www.cnblogs.com/nullcc/p/5841182.html
*
*  JS 生成器 vs. Lua 协程
*  https://www.jianshu.com/p/911f93208335
*
*  ES6 生成器 - 1. ES6 生成器基础
*  https://www.jianshu.com/p/fe03910deaba
*
*/

import React from "react";
const fs = require('fs');


const Generator = () =>{

    const myIterable = {};
    myIterable[Symbol.iterator] = function* () {
        yield 1;
        yield 2;
        yield 3;
    };

    [...myIterable] // [1, 2, 3]

    // next 方法的参数
    function* f() {
        for(var i = 0; true; i++) {
            var reset = yield i;
            if(reset) { i = -1; }
        }
    }

    var g = f();

    g.next() // { value: 0, done: false }
    g.next() // { value: 1, done: false }
    g.next(true) // { value: 0, done: false }


    // yield*命令可以很方便地取出嵌套数组的所有成员。
    function* iterTree(tree) {
        if (Array.isArray(tree)) {
            for(let i=0; i < tree.length; i++) {
                yield* iterTree(tree[i]);
            }
        } else {
            yield tree;
        }
    }

    const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

    for(let x of iterTree(tree)) {
        console.log(x);
    }
    return <section>
        生成器
    </section>
}

export default Generator;