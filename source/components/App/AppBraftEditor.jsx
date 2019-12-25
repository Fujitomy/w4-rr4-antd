'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';

import './App.less';
const allCity = require('./all.json');
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';
const { Option } = Select;

import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

import { getAccessToken,getAccessSign,getUserInfo,getToken,getSign } from '@/components/Api/Axios.js';

class Apps extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
            outputHTML: '<p></p>'
        }
    }
    componentDidMount() {
        this.isLivinig = true
        this.timer = setTimeout(this.setEditorContentAsync, 3000); // 3秒后更改编辑器内容
        function* generatorQueue(userId,token,sign){
            // onloading();
            console.log('loding...');
            token = userId ? yield getAccessToken(userId):'';
            sign = token ? yield getAccessSign(token):'';
            sign && token && (yield getUserInfo(token,sign));
            // exitLoading();
            console.log('exit loding');
        }
        // 迭代器
        // const g = generatorQueue('tomy');
        // g.next();
        
        async function asyncQueue(userId){
            const token = await getToken(userId);
            console.log(token,'----------获取签名和token');
            const sign = await getSign(token);
            console.log(token,sign,'----------获取签名和token');
        }

        asyncQueue();
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
    render() {
        const {
            editorState, outputHTML
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
