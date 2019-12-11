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
import { DatePicker,Select,Button,From,message,Cascader,Icon,Upload,Modal } from 'antd';
const { Option, } = Select;

import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'


function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
class Apps extends React.Component {
    constructor(props){
        super(props)
        this.state = {


            previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }
    ],
            // 富文本编辑器
            editorState: BraftEditor.createEditorState(), // 设置编辑器初始内容
        }
    }
    componentDidMount() {  
    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    // handleChange = (editorState) => {
    //     this.setState({
    //       editorState: editorState,
    //       outputHTML: editorState.toHTML()
    //     })
    //     document.getElementById('details').innerHTML = editorState.toHTML();
    //     console.log(typeof editorState.toHTML(),'-------------------editorState---------',);
    // }
    setEditorContentAsync = () => {
        this.isLivinig && this.setState({
          editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
        })
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handleDownload = (file) => {
      console.log(file,'下载')
    }
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
      };
    
      handleChange = ({ fileList }) => this.setState({ fileList });
    render() {
        // const {
        //     provinces,cities,areas,editorState, outputHTML, controls
        // } = this.state;
        const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const showPreviewIcon = true
    const showRemoveIcon= true
    const showDownloadIcon = true
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    {/* <aside className='pager'>
                        <header>Hearder</header>
                    </aside> */}
                    1
                    <div className="clearfix">
                        <Upload
                            action=""
                            listType="picture-card"
                            fileList={fileList}
                            //   onDownload={this.handleDownload}
                            showUploadList={{showDownloadIcon:true}}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
                    </div>
                </main>
            </HashRouter>
        )
    }
}
const App = Apps;
export default App;









	
