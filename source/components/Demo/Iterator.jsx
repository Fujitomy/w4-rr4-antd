/*
*  Iterator (遍历器/迭代器) 是一种为各种不同的数据结构提供统一的访问机制的接口，而不是一个API,类似于一种规范，比如CommonJs,AMD规范
*
*  任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。
*
*  实现原因：
*  1、修复传统循环遍历中需要定义跟踪变量维护迭代容易出错和for循环中难以break和return的bug
*  2、Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环
*
*
*  简单来说遍历器是一个部属了返回遍历器对象方法的对象或者数据结构
*  原生具备 Iterator 接口的数据结构如下:
*  Array Map Set String TypedArray  函数的 arguments 对象  NodeList 对象
*
*  传统的可以遍历的对象包括：数组，对象，字符串对象，类数组对象（比如domList,nodeList）
*  主要表示数据集合的还是Array和Object，ES6又新增了对象 Set 和 Map
*
*  我们需要一种统一的接口机制，来处理所有不同的数据结构，比如上面的Array、Object、Set、Map。
*  遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。
*
*  Iterator 的作用有三个：
*  1、是为各种数据结构，提供一个统一的、简便的访问接口
*  2、是使得数据结构的成员能够按某种次序排列
*  3、是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费
*
*
*  Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环
*  当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
*
*  一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。
*
*
*   对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。
*   本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。
*   不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。
*   for...of 循环
*   ES6 借鉴 C++、Java、C# 和 Python 语言，引入了for...of循环，作为遍历所有数据结构的统一的方法。

*  一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。
*  也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。

*  for...of循环可以使用的范围包括
*  数组、Set 和 Map 结构、某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。
*
*
*
*/

import React from "react";

const fs = require("fs");

console.log(fs,'fs');


const Iterator = () =>{



    // ES5实现的遍历器函数
    var it = makeIterator(['a', 'b']);
    window.it = it;
    it.next() // { value: "a", done: false }
    it.next() // { value: "b", done: false }
    it.next() // { value: undefined, done: true }

    function makeIterator(array) {
        var nextIndex = 0;
        return {
            next: function() {
                return nextIndex < array.length ?
                    {value: array[nextIndex++], done: false} :
                    {value: undefined, done: true};
            }
        };
    }

    // ES6的遍历器函数
    // ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，
    // 或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。

    const obj = {
        [Symbol.iterator] : function (arr) {
            let index = 0;
            return {
                next: function () {
                    return {
                        value: index++,
                        done: true
                    };
                }
            };
        }
    };
    window.obj = obj;
    obj[Symbol.iterator](['a','b','c']).next();
    obj[Symbol.iterator](['a','b','c']).next()
    obj[Symbol.iterator](['a','b','c']).next()
    obj[Symbol.iterator](['a','b','c']).next()
    obj[Symbol.iterator](['a','b','c']).next()
    obj[Symbol.iterator](['a','b','c']).next()
    console.log(obj[Symbol.iterator](['a','b','c']).next(),'es6 遍历器');


    // Object对象的遍历器函数需要手动部属
    // 因为遍历器函数返回一个可遍历的遍历器对象，
    // 所以语法 const it2 = obj2[Symbol.iterator](); it2是一个遍历器对象实例，其上部属了next方法，可以遍历

    let obj2 = {
        data: [ 'hello', 'world' ],
        [Symbol.iterator]() {
            const self = this;
            let index = 0;
            return {
                next() {
                    if (index < self.data.length) {
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
        }
    };

    const it2 = obj2[Symbol.iterator]();
    it2.next();
    it2.next();


    // 改写遍历器生成函数
    var str = new String("hi");
        // var str = "hi"; 为什么改写成直接的字符串就不能覆盖了
        [...str] // ["h", "i"]
    // 从协程到状态机--regenerator源码解析 https://zhuanlan.zhihu.com/p/37562698
    // 从协程到状态机--regenerator源码解析(2) https://zhuanlan.zhihu.com/p/37563837
    // 从协程到状态机--regenerator源码解析(3) https://zhuanlan.zhihu.com/p/37563947
    str[Symbol.iterator] = function() {
        return {
            next: function() {
                if (this._first) {
                    this._first = false;
                    return { value: "bye", done: false };
                } else {
                    return { done: true };
                }
            },
            _first: true
        };
    };

    [...str] // ["bye"]
    str // "hi"


    function* creatIterator(){
        let first = yield 1;
        let nextVal;
        try {
            nextVal = yield first +2;
        }
        catch(err){
            console.log('内部捕获外部错误',err);
        }
    }
    let it3 = creatIterator();


    return <section>
        遍历器demo，查看控制台
    </section>
}

export default Iterator;