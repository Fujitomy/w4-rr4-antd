
import React, { Suspense, lazy as Lazy } from "react";

import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import { DatePicker } from 'antd';
import Loading from '@/components/Loading';

// import DatePicker from 'antd/lib/date-picker';  // 加载 JS
// import 'antd/lib/date-picker/style/css';        // 加载 CSS

// // import DatePicker from 'antd/lib/date-picker';  // 加载 JS
// // import 'antd/lib/date-picker/style/css';        // 加载 CSS
// // import Loadable from 'react-loadable';
// // import ReactDOM from 'react-dom';

const supportHistory = 'pushState' in window.history;
import ErrBoundary from './ErrBoundary.jsx';
import { Button } from 'antd';
import axios from 'axios';

// const style = require('./App.less');
// // const Mock = require('mockjs');
// // import qs from 'qs';
//
// import Iterator from '../Demo/Iterator';
//
// // const fs = require('fs');
// // asynchronous load
// // const Home = Loadable({loader: () => import('pages/home/home'),loading:Loading});
// // const One  = Loadable({loader: () => import('pages/home/one.jsx'),loading:Loading});
// // const Two  = Loadable({loader: () => import('pages/home/two'),loading:Loading});
// // const User = Loadable({loader: () => import('pages/user/user'),loading:Loading});
//
import Header from '../Header/index.jsx';
import Sidebar from '../Sidebar/index.jsx';
//
// // 文章
const Article = Lazy(() => import('../Article/Article.jsx'));
// // const Home = Lazy(() => import('@/pages/home/home'));
const One = Lazy(() => import(/* webpackChunkName: "one.js" */'@/pages/home/one'));
const Two = Lazy(() => import(/* webpackChunkName: "two.js" */'@/pages/home/two'));
const User = Lazy(() => import('@/pages/user/user'));
//
// // 进入退出提示
// // import { Prompt } from 'react-router';
//
// const handleRequest = (res,callback)=>{
//     console.log(res,'--res');
//     const { code } = res || {};
//     switch (code) {
//         case 0:
//             typeof callback === 'function' && callback(res);
//             break;
//         case 100010110:
//             const unLogin = `您还未登录，请重新登录！`;
//             console.log(unLogin);
//             break;
//         default:
//             const baseMsg = res.msg ? res.msg : res.data;
//             const localMsg = `请求异常，请检查网络或稍后重试`;
//             const msg = Object.prototype.toString.call(baseMsg)!== "[object String]"?localMsg:baseMsg;
//             console.log(msg);
//     }
// };
//

const AndYetAnotherLazyComponent = React.lazy(() =>
    import('../Article/AndYetAnotherLazyComponent')
);

function AnotherLazyComponent() {
    return (
        <div>
            <span>So...so..lazy..</span>
            <AndYetAnotherLazyComponent />
        </div>
    );
};

class App extends React.Component {
    static state = {
        screenWidth: null,
        showArticle: false
    }
    static defaultProps = {
        onLoading: true
    }
    constructor(props) {
        super(props);
        this.main = React.createRef();
        this.state = {
            showArticle: false,
            projectName: '诚品生活',
            projectLogo: '',
            routes: [
                { name:'one', url: 'one' },
                { name:'two', url: 'two' },
                { name:'user', url: 'user' },
                { name:'article', url: 'article' },
            ]
        }
    }
    componentDidMount(){
        // 异步加载文章
        setTimeout(()=>{
            this.setState({ showArticle:true });
        },3000);

        // const dataMock = Mock.mock({
        //     // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        //     'list|1-3': [{
        //         // 属性 id 是一个自增数，起始值为 1，每次增 1
        //         'id|+1': 1
        //     }]
        // });
        // 输出结果
        // console.log(JSON.stringify(dataMock, null, 4));

        console.log(this.main.current,'mainRef ref object');
        // fs.readFile("./config.json", function(err, contents) {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(contents,'打印结果1');
        //     console.log("Done");
        // });

        // const ajax = new XMLHttpRequest();
        // ajax.onreadystatechange= ()=> {
        //     if (ajax.readyState==4 && ajax.status==200)
        //     {
        //         this.refs.ajaxData.innerHTML= ajax.responseText;
        //     }
        // }
        // ajax.open("GET","https://www.easy-mock.com/mock/5bf4fa20fa81633e1ba92d78/miniApp/getInfo",true);
        // ajax.send();

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


        // const url = `https://www.easy-mock.com/mock/5bf4fa20fa81633e1ba92d78/miniApp/getInfo`;
        // const params = { user: 'tomy' }
        // const callback = (fetchRes)=>{
        //     console.log(fetchRes,'接口请求成功返回结果');
        // };

        // this.fetchApi('get',url,params,callback).then((success)=>{
        //     console.log(success,'--------success');
        // }).catch((err)=>{
        //     console.log(err,'--------err');
        // });

        // window.addEventListener('orientationchange',(data)=>{
        //     console.log(screen.width,'--------横屏');
        //     this.setState({screenWidth:screen.width})
        // },false);
    }

    onChange=(date, dateString)=>{
        console.log(date, dateString,'打印时间选择');
    }

    // fetchApi=(method,url,params,callback,allConfig)=>{
    //     return new Promise((resolve,reject)=>{
    //         switch (method) {
    //             case 'get':
    //                 axios({
    //                     method:'get',
    //                     url:`${url}?${qs.stringify(params)}`,
    //                     // timeout: 2000,
    //                 }).then(res => {
    //                     console.log(res,'request success');
    //                     handleRequest(res,callback);
    //                     resolve(res);
    //                 }).catch(error => {
    //                     reject('请求失败');
    //                     console.log('');
    //                     console.log(error,'----------请求错误----------');
    //                 });
    //                 break;
    //             case 'post':
    //                 axios.post(`${url}`,qs.stringify(params)).then((res) => {});
    //                 break;
    //         }
    //     });
    // }

    render() {
        const getConfirmation = (message, callback) => {
            const allowTransition = window.confirm(message);
            callback(allowTransition);
        }

        const children = null;

        const {
            projectName,
            projectLogo,
        } = this.state;

        const headerInfo = { projectName, projectLogo }

        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    {/*<Prompt message="Are you sure you want to leave?" />*/}
                    <Header headerInfo={ headerInfo } />
                    <Sidebar routes = { this.state.routes } />
                    {/*<ul className="nav">*/}
                        {/*<li><Link to="/">Home</Link></li>*/}
                        {/*<li><Link to="/one">One</Link></li>*/}
                        {/*<li><Link to="/two">Two</Link></li>*/}
                        {/*<li><Link to="/user">User</Link></li>*/}
                        {/*<li><Link to="/article">Article</Link></li>*/}
                    {/*</ul>*/}
                    <DatePicker onChange={this.onChange} />
                    <Button>Antd Button</Button>
                    {/*{renderRoutes(routes)}*/}
                    <aside ref={'ajaxData'}></aside>
                    {/*<div>*/}
                        {/*<Route path="/" exact component={Home} />*/}
                    {/*</div>*/}

                    <ErrBoundary>
                        <Suspense fallback={false}>
                            {/*<Route path="/" exact component={Home} />*/}
                            <Route path="/article" component={ Article } />
                            <Route path="/user" component={User} />
                            <Route path="/one" component={One} />
                            <Route path="/two" component={Two} />
                        </Suspense>
                    </ErrBoundary>

                    {/*异步加载方案2*/}
                    <Suspense fallback={false}>
                        {/*{*/}
                        {/*this.state.showArticle && <Article/>*/}
                        {/*}*/}
                        <div>
                            <Suspense fallback="Sorry for our lazinessSorry">
                                <span>Cast</span>
                                <AnotherLazyComponent />
                            </Suspense>
                        </div>
                    </Suspense>
                    <section className='marquee-wrapper'>
                        <aside className='marquee-area'>
                            <a className={'marquee-item'}>111111</a>
                            <a className={'marquee-item'}>22222</a>
                            <a className={'marquee-item'}>3333</a>
                            <a className={'marquee-item'}>4444</a>
                            <a className={'marquee-item'}>5555</a>
                        </aside>
                    </section>

                    {/*<aside>*/}
                        {/*<h1 style={{width:'35%',background:'orange'}}>{ `width:'375px的蓝色div` }</h1>*/}
                        {/*<h1 style={{width:'750px',background:'orange'}}>*/}
                            {/*{`设备独立像素 device dependent pixel 获取 screen.width:`}*/}
                            {/*{ screen.width }*/}
                            {/*{ this.state.screenWidth || '--' }*/}
                        {/*</h1>*/}
                        {/*<br/>*/}
                        {/*<h1 style={{width:'980px',background:'orange'}}>*/}
                            {/*{`设备像素比 devicePixelRatio 获取 window.devicePixelRatio:`}*/}
                            {/*{ window.devicePixelRatio }*/}
                        {/*</h1>*/}
                        {/*<br/>*/}
                        {/*<h1 style={{width:'50vw',background:'orange'}}>*/}
                            {/*{`设备像素 Visual viewport width  = innerWidth`}{ window.innerWidth }*/}
                        {/*</h1>*/}
                    {/*</aside>*/}
                    {/*<aside>*/}
                        {/*<div>*/}
                            {/*<h1>{`视觉视口 Visual viewport width  = innerWidth`}{ window.innerWidth }</h1>*/}
                            {/*<br/>*/}
                            {/*<h1>{`视觉视口 Visual viewport height = innerHeight`}{ window.innerHeight }</h1>*/}
                            {/*<br/>*/}
                            {/*<h1>*/}
                                {/*{`设备像素比 设备像素比 = 物理像素 / 设备独立像素 // 在某一方向上，x方向或者y方向`}*/}
                                {/*{ window.devicePixelRatio}*/}
                            {/*</h1>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                            {/*<p>Ideal Viewport：理想视口，其实就是设备的可见区域，和可见视口一致。</p>*/}
                            {/*<p>我们希望设备的最佳阅读体验是，默认不需要横向滚动条，就可以拥有堪比PC端的浏览体验</p>*/}
                            {/*<p>因为移动设备，安卓 & ios的视觉视口很小，所以我们希望我们的理想布局视口和视觉视口宽度保持一致</p>*/}
                            {/*<p>但是移动端浏览器厂商，各自的布局视口宽度各不相同，所以需要我们手动重置布局视口为我们想要的布局视口</p>*/}
                            {/*<p>为了保证我们再不同浏览器，不同设备像素比的设备下都能拥有相似的体验</p>*/}
                            {/*<p>就有了理想视口的需求</p>*/}
                        {/*</div>*/}
                    {/*</aside>*/}
                    {/*<aside>*/}
                        {/*<div>*/}
                            {/*迭代器函数*/}
                            {/*<Iterator/>*/}
                        {/*</div>*/}
                    {/*</aside>*/}
                    {/*<h1>React Web App 16.0+</h1>*/}

                </main>
            </HashRouter>
        )
    }
}

export default App;



// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         // this.main = React.createRef();
//     }
//     render() {
//         // throw new Error('I crashed!');
//         if(Array.includes){
//             console.log([1,2].includes(1));
//         }else{
//             console.log('111111212121212我不支持呀?!!!!1212');
//         }
//         return (
//             // this.state.showArticle &&
//             <div>app
//                 <DatePicker />
//             </div>
//         )
//     }
// }

// export default App;