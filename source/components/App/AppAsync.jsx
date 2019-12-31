'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';
import './App.less';
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
// const fs = require("fs"); 
// console.log(fs,'file system');
import { getAccessToken,getAccessSign,getUserInfo,getToken,getSign,login,getIndexData } from '@/components/Api/Axios.js';
import ajax from '@/components/Api/ajax.js';

const fetch = require('node-fetch');


import {PhotoSwipe} from 'react-photoswipe';
import 'react-photoswipe/lib/photoswipe.css';
// const style = require('react-photoswipe/lib/photoswipe.css');

// const fs = require('fs');




// const gen = function* () {
//     function resolve(data){
//         return data;
//     }
//     const f1 = yield ajax('http://www.mocky.io/v2/5dd65bfc3200005e00888974','get',{username:'test'},resolve)
//     console.log(f1,'f1');
//     yield 33
//     const f2 = yield ajax('http://www.mocky.io/v2/5dd65bfc3200005e00888974','get',{username:'test'},resolve);
//     console.log(f2,'f2');
// };
// const g = gen();
// console.log(g.next().value.then(data=>{
//     console.log(data,'取到的数据');
// }),'文件1');

// setTimeout(()=>{
//     console.log(g.next(),'文件2');
// },5000)

// window.fetch = fetch;

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
            outputHTML: '<p></p>',

            openPreview: false,
            previewList: [
                {
                    src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577704943554&di=f6496cfc537dad406ffc0f36762befe0&imgtype=0&src=http%3A%2F%2Fbbswater-fd.zol-img.com.cn%2Ft_s1200x5000%2Fg5%2FM00%2F08%2F0C%2FChMkJlpvNqeINXZAAAkzJHZr4CUAAkduAFAdLMACTM8734.jpg',
                    w: 1200,
                    h: 900,
                    title: 'Image 1'
                },
                {
                    src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=549593505,2073595966&fm=26&gp=0.jpg',
                    w: 1200,
                    h: 900,
                    title: 'Image 2'
                }
            ]
        }
    }
    componentDidMount() {
        this.isLivinig = true
        this.timer = setTimeout(this.setEditorContentAsync, 3000); // 3秒后更改编辑器内容
        
        setTimeout(()=>{
            this.setState({
                openPreview: true
            })
        },3000)
        // this.login = false;
        // const that = this;
        // function getLogins(username){
        //     const userinfo = login(username,that);
        //     console.log(userinfo,'userinfo------');
        // }
        // function* getUserInfo(username){
        //     yield getLogins(username);
        //     yield getIndexData('');
        //     // console.log(that.state,'用户信息');
        //     // if(loginOk){
        //     //     console.log(loginOk,'congratulation');
        //     //     this.setState({
        //     //         username:'Tomy'
        //     //     })
        //     //     const indexData = yield getIndexData();
        //     //     return indexData;
        //     // }else{
        //     //     return;
        //     // }
        // }
        // const getData = getUserInfo('tomy');
        // const goLogin = getData.next();
        // const loginStatus = goLogin;
        // console.log(loginStatus,'loginStatus');
        // getData.next();
        // return
        function* gen(){
            const url = 'https://api.github.com/users/github';
            console.log(0,' 00即将开始执行 步骤1 ？？？result');
            const result = yield fetch(url);
            console.log(result,'result');
            if(result){
                console.log(result.bio,'result bio');
            }
            console.log(11111111111,' 111顺序执行  ？？？result');
        }
    
        // const g = gen();
        // const step1 = g.next();
        // const step1Val = step1.value;
        // step1.value.then((data)=>{
        //     console.log(data,'step1 步骤1 data');
        //     return data;
        // }).then((data)=>{
        //     console.log(data,'step2 步骤2  data???');
        //     g.next(data);
        // })
        // console.log(step1Val,'--------------异步获取');
        // // debugger
        // // 由于执行了一个异步操作，所以step2会比step1.value的then先执行
        // const step2 = g.next();
        // console.log(step2.value,'--------------异步获取2',step2.done);
        // setTimeout(()=>{
        //     const step2 = g.next();
        //     console.log(step2.value,'--------------异步获取2',step2.done);
        // },0);
        
        // yield 语句执行没有返回值，但是可以接收next方法传入的参数作为下一个yield语句的返回值
        // 注意，由于next方法的参数表示上一个yield表达式的返回值,所以在第一次使用next方法时，传递参数是无效的。
        function* generatorQuery(userId,token,sign){
            // onloading();
            console.log('loding...');
            token = userId ? yield getAccessToken(userId):'';
            sign = token ? yield getAccessSign(token):'';
            sign && token && (yield getUserInfo(token,sign));
            // exitLoading();
            console.log('exit loding');
        }

        // async异步函数，await 执行的函数必须如果里面有异步,会直接走到return，然后再异步，所以需要直接返回一个异步函数
        // 错误写法，不能捕获到异步里的返回值
        // function logins(){
        //     setTimeout(()=>{
        //         return 'userName'
        //     },3000)
        //     return;
        // }
        // 正确写法
        // function logins(url){
        //     return axios.get(url).then(data=>{
        //         return data;
        //     }).catcht(err=>{
        //         return { msg:'请求错误',err:err }
        //     })
        // }

        // 迭代器
        // const g = generatorQuery('tomy');
        // g.next();
        window.generatorQuery = generatorQuery;

        async function asyncQuery(userId){
            const token = await getToken(userId);
            console.log(token,'-----1-----获取token');
            const sign = await getSign(token);
            console.log(token,sign,'----2----获取签名');
        }

        // asyncQuery();


        async function asyncAjax(){
            function resolve(data){
                return data;
            }
            const data = await ajax(
                'http://www.mocky.io/v2/5dd65bfc3200005e00888974',
                'get',
                {usename:'tomy'},
                resolve
            );
            console.log(data,'请求结果');
        }
        // asyncAjax();

    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    handleChange = (editorState) => {
        this.setState({
            editorState: editorState,
            outputHTML: editorState.toHTML()
        })
    }
    setEditorContentAsync = () => {
        this.isLivinig && this.setState({
            editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
        })
    }

    handleClose = () => {
        // het.toast('close');
        this.setState({
            openPreview: false
        })

        
    }

    imageLoadComplete = (e) =>{
        console.log(e,'------------e');
    }
    render() {
        const {
            editorState, outputHTML,openPreview,previewList
        } = this.state;

        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside>

                        {/* <div className="editor-wrapper">
                            <BraftEditor
                                value={editorState}
                                onChange={this.handleChange}
                            />
                        </div>
                        <h5>输出内容</h5>
                        <div className="output-content">{outputHTML}</div> */}

<PhotoSwipe 
                    isOpen={openPreview} 
                    items={previewList} 
                    options={{errorMsg:'图片加载失败，请检查网络',fullscreenEl: false}} 
                    imageLoadComplete={ this.imageLoadComplete.bind(this)}
                    onClose={this.handleClose.bind(this)}
                />
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;