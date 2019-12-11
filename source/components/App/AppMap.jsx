'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';
import axios from 'axios';
import qs from 'qs';
import *as $ from 'jquery';
// import { DatePicker,Select,Button } from 'antd';
// const Option = Select.Option;
import reqwest from "reqwest";

import './App.less';

const allCity = require('./all.json');
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';
const { Option } = Select;

import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'



class Apps extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            // 富文本编辑器
            editorState: BraftEditor.createEditorState(), // 设置编辑器初始内容
            outputHTML: '<p></p>',
            controls:[
                {
                  key: 'bold',
                  text: <b>加粗</b>
                },
                'italic', 'underline', 'separator','color',
                'undo', 
                'redo', 
                'split', 
                'font-size', 
                // 'line-height', 
                'letter-spacing',
                'indent',
                'text-color', 
                'bold', 
                'italic', 
                'underline', 
                'strike-through',
                'superscript', 
                'subscript', 
                'remove-styles', 
                'text-align', 
                'split', 
                // 'headings', 
                // 'list_ul',
                // 'list_ol', 
                // 'blockquote', 
                // 'hr', 
            ]
        }
    }
    async componentDidMount() {
        // this.isLivinig = true
        // // 3秒后更改编辑器内容
        // // setTimeout(this.setEditorContentAsync, 3000)

        const map = new AMap.Map('amapContainer', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom:11, //初始化地图层级
            center: [116.397428, 39.90923] //初始化地图中心点
        });


         const self = this;
         //获取并展示当前城市信息
         const logMapinfo = ()=>{
            map.getCity((info)=>{
            console.log(info,'城市信息');
            window.info = info;
            self.setState({
                    cityInfo: info
                })
        //   var node = new PrettyJSON.view.Node({
        //       el: document.querySelector("#map-city"),
        //       data: info
        //   });
        });
      }
  
      logMapinfo();
  
      //绑定地图移动事件
      map.on('moveend', logMapinfo);
        // const getBaesInfo = async ()=>{
        //     const htmlContent = await getHtmlConetent();
        //     console.log(htmlContent,'------htmlContent-----');
        //     this.setState({
        //         editorState: BraftEditor.createEditorState(htmlContent)
        //     })
        // }
        // getBaesInfo();

        
        // console.log(111111111);
        // async function pollyData(userId){
        //     const token = await getToken(userId);
        //     console.log(token,'----------获取签名和token');
        //     const sign = await getSign(token);
        //     console.log(token,sign,'----------获取签名和token');
        // }
      
        // function getToken(userId){
        //     return axios.get(
        //             'http://www.mocky.io/v2/5dd65bfc3200005e00888974?mocky-delay=5000ms',
        //             {
        //                 params: {
        //                     userId:userId||'Andy'
        //                 }
        //             }
        //         )
        //         .then(function (res) {
        //             // debugger
        //             typeof res === 'string' ? JSON.parse(res):res;
        //             res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
        //             const { code,data } = res.data || {};
        //             console.log(res.data,'----response--------',data);
        //             if(code===0 && data){
        //                 console.log(data.token,'data.token')
        //             }
        //             return data.token
        //         })
        //         .catch(function (error) {
        //             console.log('获取token失败:',JSON.stringify(error));
        //         });
        // }

        // function getSign(userId){
        //     axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
        //         .then(function (res) {
        //             typeof res === 'string' ? JSON.parse(res):res;
        //             res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
        //             const { code,data } = res.data || {};
        //             console.log(res.data,'----response--------',data);
        //             if(code===0 && data){
        //                 console.log(data.token,'data.token')
        //             }
        //             // debugger
        //             return data.sign
        //         })
        //         // .catch(function (error) {
        //         //     console.log('获取token失败:',JSON.stringify(error));
        //         // });
        // }
        // pollyData();
    
        // function getHtmlConetent(){
        //     // axios.get('http://www.mocky.io/v2/5ddb3ca83100008124605f85')

        //     // axios.post('http://200.200.200.230/hetapi/api/mock/51/v4/web/water/waterServiceTips/add',{
        //     //     params: {
        //     //         title:''||'Andy',
        //     //         tips:'<p>Hello <strong><span style="letter-spacing:4px">World!</span></strong></p>'
        //     //     }
        //     // })

        //     axios.get('http://www.mocky.io/v2/5ddb4ac13100007a00605fbf')
        //     .then(res=>{
        //         console.log(typeof res,'----response--------',res);
        //         let response = res.data;
        //         console.log(typeof response,'----   数据--------',response);
        //         let html = typeof response === 'string' ? JSON.parse(response):response;
        //         // response = typeof response === 'string' ? JSON.parse(response):response;

        //         // console.log(html,'---- html --------');
        //         const { code,data } = html || {};
        //         console.log(data,'---- htmlout--------',typeof data);
        //         if(code===0 && data){
        //             console.log(data,'---- 富文本样式--------');
        //             return html;
        //         }
        //         // debugger
        //         return null
        //     })
        // }
        
    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    handleChange = (editorState) => {
        this.setState({
          editorState: editorState,
          outputHTML: editorState.toHTML()
        })
        document.getElementById('details').innerHTML = editorState.toHTML();
        console.log(typeof editorState.toHTML(),'-------------------editorState---------',);
    }
    setEditorContentAsync = () => {
        this.isLivinig && this.setState({
          editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
        })
    }

    returnHtml(){
        return `
        <!Doctype html>
        <html>
          <head>
            <title>Preview Content</title>
            <style>
              html,body{
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: auto;
                background-color: #f1f2f3;
              }
              .container{
                box-sizing: border-box;
                width: 1000px;
                max-width: 100%;
                min-height: 100%;
                margin: 0 auto;
                padding: 30px 20px;
                overflow: hidden;
                background-color: #fff;
                border-right: solid 1px #eee;
                border-left: solid 1px #eee;
              }
              .container img,
              .container audio,
              .container video{
                max-width: 100%;
                height: auto;
              }
              .container p{
                white-space: pre-wrap;
                min-height: 1em;
              }
              .container pre{
                padding: 15px;
                background-color: #f1f1f1;
                border-radius: 5px;
              }
              .container blockquote{
                margin: 0;
                padding: 15px;
                background-color: #f1f1f1;
                border-left: 3px solid #d1d1d1;
              }
            </style>
          </head>
          <body>
            <div class="container">${this.state.editorState.toHTML()}</div>
          </body>
        </html>
      `
    }
    render() {
        const {
            provinces,cities,areas,editorState, outputHTML, controls
        } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside>
                        {/* <div className="editor-wrapper">
                            <BraftEditor
                                controls={controls}
                                value={editorState}
                                onChange={this.handleChange}
                               
                            />
                        </div> */}
                        <div id='amapContainer' 
                        style={{width:'100vw',height:"100vh"}}>
                            

                        </div>
                  
                        <h5>输出内容</h5>
                        <div className="output-content">{outputHTML}</div>
                        <aside id='details'>

                        </aside>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
const App = Apps;
export default App;









	
