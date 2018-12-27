
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Link,Route } from 'react-router-dom';
import { DatePicker } from 'antd';
import Loadable from 'react-loadable';
import Loading from 'components/Loading/';

const style = require('./App.less');

import qs from 'qs';
import Iterator from '../Demo/Iterator';

import axios from 'axios';
// const fs = require('fs');

const Home = Loadable({loader: () => import('pages/home/home'),loading:Loading});
const One  = Loadable({loader: () => import('pages/home/one.jsx'),loading:Loading});
const Two  = Loadable({loader: () => import('pages/home/two'),loading:Loading});
const User = Loadable({loader: () => import('pages/user/user'),loading:Loading});

const handleRequest = (res,callback)=>{
    console.log(res,'--res');
    const { code } = res || {};
    switch (code) {
        case 0:
            typeof callback === 'function' && callback(res);
            break;
        case 100010110:
            const unLogin = `您还未登录，请重新登录！`;
            console.log(unLogin);
            break;
        default:
            const baseMsg = res.msg ? res.msg : res.data;
            const localMsg = `请求异常，请检查网络或稍后重试`;
            const msg = Object.prototype.toString.call(baseMsg)!== "[object String]"?localMsg:baseMsg;
            console.log(msg);
    }
}

class App extends React.Component {
    componentDidMount(){

        // fs.readFile("./config.json", function(err, contents) {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(contents,'打印结果1');
        //     console.log("Done");
        // });

        const ajax = new XMLHttpRequest();
        ajax.onreadystatechange= ()=> {
            if (ajax.readyState==4 && ajax.status==200)
            {
                this.refs.ajaxData.innerHTML= ajax.responseText;
            }
        }
        ajax.open("GET","https://www.easy-mock.com/mock/5bf4fa20fa81633e1ba92d78/miniApp/getInfo",true);
        ajax.send();

        // es5 实现迭代器
        const iterator = makeIterator([3,2,1])
        function makeIterator(arr){
            let idx = 0;
            return {
                next:function(){
                    let done = idx>=arr.length;
                    let value = !done ? arr[idx++]: undefined;
                    return {
                        value:value,
                        done:done
                    }
                }
            }
        };
        window.iterator = iterator;
        console.log(iterator.next(),'迭代器');
        // 生成器
        // 生成器是一种返回迭代器的函数，通过function关键字后的星号(*)来表示，函数中会用到新的关键字yield。
        // 星号可以紧挨着function关键字，也可以在中间添加一个空格

        // 生成器
        function *createIterator() {
            yield 1;
            yield 2;
            yield 3;
        }
        // 生成器能像正规函数那样被调用，但会返回一个迭代器
        let iterators = createIterator();
        console.log(iterators.next().value); // 1
        console.log(iterators.next().value); // 2
        console.log(iterators.next().value); // 3


        const url = `https://www.easy-mock.com/mock/5bf4fa20fa81633e1ba92d78/miniApp/getInfo`;
        const params = { user: 'tomy' }
        const callback = (fetchRes)=>{
            console.log(fetchRes,'接口请求成功返回结果');
        };

        this.fetchApi('get',url,params,callback).then((success)=>{
            console.log(success,'--------success');
        }).catch((err)=>{
            console.log(err,'--------err');
        });
    }
    onChange=(date, dateString)=>{
        console.log(date, dateString,'打印时间选择');
    }
    fetchApi=(method,url,params,callback,allConfig)=>{
        return new Promise((resolve,reject)=>{
            switch (method) {
                case 'get':
                    axios({
                        method:'get',
                        url:`${url}?${qs.stringify(params)}`,
                        // timeout: 2000,
                    }).then(res => {
                        console.log(res,'request success');
                        handleRequest(res,callback);
                        resolve(res);
                    }).catch(error => {
                        reject('请求失败');
                        console.log(error,'----------请求错误----------');
                    });
                    break;
                case 'post':
                    axios.post(`${url}`,qs.stringify(params)).then((res) => {});
                    break;
            }
        });
    }
    render() {
        return (
            <BrowserRouter>
                <main className='main'>
                    <aside>
                        {`设备独立像素 device dependent pixel = width-`}{ screen.width }
                    </aside>
                    <aside>
                        <div>
                            {`视觉视口 Visual viewport width  = innerWidth`}{ window.innerWidth }
                            <br/>
                            {`视觉视口 Visual viewport height = innerHeight`}{ window.innerHeight }
                            <br/>
                            {`设备像素比 设备像素比 = 物理像素 / 设备独立像素 // 在某一方向上，x方向或者y方向`}{ window.devicePixelRatio}
                        </div>
                        <div>
                            <p>Ideal Viewport：理想视口，其实就是设备的可见区域，和可见视口一致。</p>
                            <p>我们希望设备的最佳阅读体验是，默认不需要横向滚动条，就可以拥有堪比PC端的浏览体验</p>
                            <p>因为移动设备，安卓 & ios的视觉视口很小，所以我们希望我们的理想布局视口和视觉视口宽度保持一致</p>
                            <p>但是移动端浏览器厂商，各自的布局视口宽度各不相同，所以需要我们手动重置布局视口为我们想要的布局视口</p>
                            <p>为了保证我们再不同浏览器，不同设备像素比的设备下都能拥有相似的体验</p>
                            <p>就有了理想视口的需求</p>
                        </div>
                    </aside>
                    <aside>
                        <div>
                            迭代器函数
                            <Iterator/>
                        </div>
                    </aside>
                    <h1>React Web App 16.0+</h1>
                    <ul className="nav">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/one">One</Link></li>
                        <li><Link to="/two">Two</Link></li>
                        <li><Link to="/user">User</Link></li>
                    </ul>
                    <DatePicker onChange={this.onChange} />
                    {/*{renderRoutes(routes)}*/}

                    <aside ref={'ajaxData'}></aside>
                    <div>
                        <Route path="/" exact component={Home} />
                        <Route path="/one" component={One} />
                        <Route path="/two" component={Two} />
                        <Route path="/user" component={User} />
                    </div>
                </main>
            </BrowserRouter>
        )
    }
}

export default App;