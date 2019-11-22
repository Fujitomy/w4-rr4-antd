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
            editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
            outputHTML: '<p></p>'
        }
    }

    async componentDidMount() {

        this.isLivinig = true
        // 3秒后更改编辑器内容
        setTimeout(this.setEditorContentAsync, 3000)


        const htmlContent = await getHtmlConetent();



        async function pollyData(userId){
            const token = await getToken(userId);
            console.log(token,'----------获取签名和token');
            const sign = await getSign(token);
            console.log(token,sign,'----------获取签名和token');
        }
      
        function getToken(userId){
            return axios.get(
                    'http://www.mocky.io/v2/5dd65bfc3200005e00888974?mocky-delay=5000ms',
                    {
                        params: {
                            userId:userId||'Andy'
                        }
                    }
                )
                .then(function (res) {
                    // debugger
                    typeof res === 'string' ? JSON.parse(res):res;
                    res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
                    const { code,data } = res.data || {};
                    console.log(res.data,'----response--------',data);
                    if(code===0 && data){
                        console.log(data.token,'data.token')
                    }
                    return data.token
                })
                .catch(function (error) {
                    console.log('获取token失败:',JSON.stringify(error));
                });
        }

        function getSign(userId){
            axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
                .then(function (res) {
                    typeof res === 'string' ? JSON.parse(res):res;
                    res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
                    const { code,data } = res.data || {};
                    console.log(res.data,'----response--------',data);
                    if(code===0 && data){
                        console.log(data.token,'data.token')
                    }
                    // debugger
                    return data.sign
                })
                // .catch(function (error) {
                //     console.log('获取token失败:',JSON.stringify(error));
                // });
        }
        pollyData();
    

        function getHtmlConetent(){
            axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
            .then(function (res) {
                typeof res === 'string' ? JSON.parse(res):res;
                res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
                const { code,data } = res.data || {};
                console.log(res.data,'----response--------',data);
                if(code===0 && data){
                    console.log(data.token,'data.token')
                }
                // debugger
                return data.sign
            })
        }
        
    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    handleChange = (editorState) => {
        this.setState({
          editorState: editorState,
          outputHTML: editorState.toHTML()
        })
        console.log(editorState,'-------------------editorState---------');
    }
    setEditorContentAsync = () => {
        this.isLivinig && this.setState({
          editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
        })
    }
    render() {
        const {
            provinces,cities,areas,editorState, outputHTML
        } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside>
                        <div className="editor-wrapper">
                            <BraftEditor
                                value={editorState}
                                onChange={this.handleChange}
                            />
                        </div>
                        <h5>输出内容</h5>
                        <div className="output-content">{outputHTML}</div>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
const App = Apps;
export default App;









	
