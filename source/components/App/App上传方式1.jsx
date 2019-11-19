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
import Cropper from 'react-cropper';
import reqwest from "reqwest";
import 'cropperjs/dist/cropper.css';
import './App.less';
import {
    Form,
    Select,
    message,
    Modal,
    InputNumber,
    Switch,
    Radio,
    Slider,
    Button,
    Upload,
    Icon,
    Rate,
    Checkbox,
    Row,
    Col,
    Card
  } from "antd";

// const style = require('./App.less');
// const fs = require('fs');
// const supportHistory = 'pushState' in window.history;

// 页面进入退出提示
// import { Prompt } from 'react-router';

// 第三方异步加载方式
// import Loadable from 'react-loadable';
// import ReactDOM from 'react-dom';
// asynchronous load
// const Home = Loadable({loader: () => import('pages/home/home'),loading:Loading});
// const One  = Loadable({loader: () => import('pages/home/one.jsx'),loading:Loading});
// const Two  = Loadable({loader: () => import('pages/home/two'),loading:Loading});
// const User = Loadable({loader: () => import('pages/user/user'),loading:Loading});

// 手动按需加载antd组件
// import DatePicker from 'antd/lib/date-picker';  // 加载 JS
// import 'antd/lib/date-picker/style/css';        // 加载 CSS


// mock virtual data
const Mock = require('mockjs');
const Random = Mock.Random;
// window.Mock = Mock;
// const obj = { a:1, b:2, c:3, d:4 };
// const array = [1,2,3,4,5,'hello world'];
// const fun = x => x + 10;
// const dataFloat = Mock.mock({
//     // 数字
//     'number1|1-100.1-10': 1,
//     'number2|123.1-5': 1,// 1-5位小数
//     'number3|123.3': 1, // 三位小数
//     'number4|123.10': 1.123,
//     // 布尔值
//     'boolean1|1': true, // 生成一个布尔值，各一半 true/false 各一半
//     'boolean2|1-3':true, // 1/4是true，3/4是false
//     // 对象
//     'name|1-3':obj,      // 随机从obj中寻找1到3个属性，新对象
//     'name2|2':obj,         // 随机从onj中找到两个属性，新对象
//     // 数组
//     'array|1': array, // 从属性值 array 中随机选取 1 个元素，作为最终值
//     'array2|+1': array, // 从属性值 array 中顺序选取 1 个元素，作为最终值
//     'array3|1-4': array, // 通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max
//     'array3|2': array, // 通过重复属性值 array 生成一个新数组，重复次数为 count
//     'list|8': [{
//         // 属性 id 是一个自增数，起始值为 1，每次增 1
//         'id|+1': 1
//     }],
//     // 函数
//     'fun': fun(10), // 返回函数的返回值20
//     // 正则
//     'reg':/\d{1,3}/, // 根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。 
//     'regexp1': /[a-z][A-Z][0-9]/,
//     'regexp2': /\w\W\s\S\d\D/,
//     'regexp3': /\d{5,10}/,
//      // 占位符 
//      'placeholder':{
//         'name1':'@first', // mmp 黑魔法呀 Name下的佔位符:first, last, name, cfirst, clast, cname
//         'name2':'@cfirst', 
//         'name3':'@clast',
//         'fullName': '@name1 @name2 @name3'
//     },
//     // 生成随机数
//     "random": {
//         "mtime": "@datetime",//随机生成日期时间
//         "score":  "@natural(1, 800)",//随机生成1-800的数字
//         "rank":  "@natural(1, 100)",//随机生成1-100的数字
//         "stars": "@natural(0, 5)",//随机生成1-5的数字
//         "nickname": "@cname",//随机生成中文名字
//     }
// });
// console.log(JSON.stringify(dataFloat, null, 4));

// 拦截所有后缀为.json的get请求
// Mock.mock(/\.json/,'GET', {
//     'list|1-10': [{
//         'id|+1': 1,
//         'email': '@EMAIL'
//     }]
// });

// Mock.mock('http://localhost:8088/water/common/admin/loginCheck', {
//     'list|1-10': [{
//         'id|+1': 1,
//         'email': '@EMAIL'
//     }]
// });

// function originAjax(url,type)
// {
// 	const xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function()
// 	{
// 		if (xmlhttp.readyState==4 && xmlhttp.status==200)
// 		{
//             console.log(xmlhttp,'xmlhttp.responseText');
// 			// document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
// 		}
// 	}
// 	xmlhttp.open(type||"GET",url,true);
// 	xmlhttp.send();
// }

// // originAjax('./configxxxxx.json');
// // originAjax('/water/common/admin/loginCheck');


// Mock.mock('http://localhost:8088/hello', {
//     'list|1-10': [{
//         'id|+1': 1,
//         'email': '@EMAIL'
//     }]
// });

// axios.get(`http://localhost:8088/hello`).then((res) => {
//     console.log(res,'----------res--axios代理接口');
// }).catch(function (error) {
//     console.log(error);
// });
  
// axios.get('./configxxxxx.json').then((res) => {
//     console.log(res,'----------res json');
// }).catch(function (error) {
//     console.log(error);
// });

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
};

// Iterator learn
// import Iterator from '../Demo/Iterator';

import Header from '../Header/index.jsx';
import Sidebar from '../Sidebar/index.jsx';

// asynchronous modules
const Article = Lazy(() => import('../Article/Article.jsx'));
// const Home = Lazy(() => import('@/pages/home/home'));
const One = Lazy(() => import('@/pages/home/one'));
const Two = Lazy(() => import('@/pages/home/two'));
const User = Lazy(() => import('@/pages/user/user'));
// asynchronous components
const AndYetAnotherLazyComponent = React.lazy(() =>
    import('../Article/AndYetAnotherLazyComponent')
);

// rem计算规则

function AnotherLazyComponent() {
    return (
        <div>
            <span>So...so..lazy..</span>
            <AndYetAnotherLazyComponent />
        </div>
    );
};


function getFileName(str,reg= /[^\\\/]*[\\\/]+/g){
    return str.replace(reg,'');
}

class Apps extends React.Component {
    state = {
        uploading: false,
        coverImage: null,
        fileList: [
            {
                uid: '-1',
                name: 'xxx.jpg',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }
        ],
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                const {x} = {}

            }
        });
    }
    normFile = (e, ok) => {
        if (ok) {
            console.log("ok:", ok);
            return [{
                ...fileList
            }]
        }
        if (Array.isArray(e)) {
            return e;
        }
        console.log(e, "----这是啥");
        const list = e && e.fileList && e.fileList.length ? [e.fileList[e.fileList.length - 1]] : undefined;
        console.log(list,'初次渲染时的图片');
        return e && list;
    }
    beforeUpload = file => {
        // const { log } = console;
        console.log(file, "file info beforeUpload s");
    
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          // this.setState({
          //     previewImg: fileReader.result,
          //     showCropper: true,
          //     coverImage: fileReader.result
          // })
        };
        // this.setState(state => ({
        //   fileList: [...state.fileList, file],
        // }));
        return false;
    }
    // 转二进制-后台需要二进制流传输
    dataURLtoBlob=(dataurl,filenameBlob)=> {
        let arr = dataurl.split(','),
	        mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]),
	        n = bstr.length,
	        u8arr = new Uint8Array(n);
	    while (n--) {
	        u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filenameBlob, { type: mime });
    }
    handleUpload = () => {
        const { fileList } = this.state;
        console.log("upload reading 上传准备中",fileList);
       

        let croppent = this.cropper.getCroppedCanvas();
        const { filenameBlob } = this.state;
        if(typeof croppent==='undefind'){
            return;
        }
        const dataurl = croppent.toDataURL();
        const file = this.dataURLtoBlob(dataurl,filenameBlob);

        const bigFile = fileList[0];

        console.log(dataurl,bigFile,'--------dataurl,bigFile----------');

        const formData = new FormData();
        formData.append("appId", 30896);
        formData.append("file", dataurl || bigFile); // 后台规定:file必须是二进制的文件流
        // fileList.forEach(file => {
        //   formData.append("files[]", file);
        // });
        this.setState({
           uploading: true
        });

        if (window.FormData) {
            const url = `https://www.mocky.io/v2/5da53133350000da834a79c7`; // => /v4/web/tencentcloud/upload
            // const formData = new FormData(); // const config = { headers:{'Content-Type': 'multipart/form-data'}}
            // formData.append('file',file); // 后台规定:file必须是二进制的文件流
            // formData.append('appId',appId);  // 业务线的产品id，用于区分业务线
            // console.log(formData,'formData',file,'file name');
            
            axios.create({ withCredentials: true }).post(url,formData).then(res => {
                console.log(res,'res', res.status+' ' + res.statusText)
                // this.trigger(res?res.data:null);
                    console.log(res,'------res--');
                    let data = res.data;
                  
                    data = typeof data === 'string' ? JSON.parse(data):data;
                    console.log(data,'------res.data--',
                        typeof data
                    );
                    this.setState({
                        uploading: false,
                        showCropper:false,
                        imageUrl:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                        fileList:[
                            {
                                uid: '1',
                                name: '维尼小熊.png',
                                status: 'done',
                                response: 'Server Error 500', // custom error message to show
                                url: data.url
                            }
                        ]
                    });
            }).catch(res => {
                console.log(res,'错误');
                // this.trigger({code: null, msg: res.status+' ' + res.statusText});
            });
        };

        // reqwest({
        //   url: "https://www.mocky.io/v2/5da52b08350000da834a79ae",
        //   method: "POST",
        //   processData: false,
        //   data: formData,
        //   success: (res) => {
        //     console.log("upload success",res);
        //     // this.setState({
        //     //     uploading: false,
        //     //     showCropper:false,
        //     //     imageUrl:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     //     fileList:[
        //     //         {
        //     //             uid: '1',
        //     //             name: 'xxx.png',
        //     //             status: 'done',
        //     //             response: 'Server Error 500', // custom error message to show
        //     //             url: res.data.url,
        //     //         }
        //     //     ]
        //     // });
        //   },
        //   error: (res) => {
        //     console.log("upload error",res);
        //     // this.setState({
        //     //   uploading: false
        //     // });
        //     // message.error("upload failed.");

        //     // this.setState({
        //     //     uploading: false,
        //     //     showCropper:false,
        //     //     imageUrl:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     //     fileList:[
        //     //         {
        //     //             uid: '1',
        //     //             name: 'xxx.png',
        //     //             status: 'done',
        //     //             response: 'Server Error 500', // custom error message to show
        //     //             url: res.data.url,
        //     //         }
        //     //     ]
        //     // });
        //   }
        // });
    }
    onCancel=()=>{
         console.log(this.state.fileList,'----------文件列表')
        //  const file = this.state.fileList[0];
        //  const fileReader = new FileReader();
        //  fileReader.readAsDataURL(file);
        //  fileReader.onload = () => {
        //     //  this.setState({ 
        //     //      previewImg: fileReader.result,
        //     //      showCropper: true,
        //     //      coverImage: fileReader.result
        //     //  });
        //     this.setState(state=>({
        //         fileList: state.fileList,
        //         showCropper:false,
        //     }));
        // }
        this.setState(state => {
            console.log(state.fileList);
            return ({
                fileList: [ {
                    uid: '1',
                    name: '维尼小熊.png',
                    status: 'done',
                    response: 'Server Error 500', // custom error message to show
                    url: 'https://cdn2.jianshu.io/assets/default_avatar/13-394c31a9cb492fcb39c27422ca7d2815.jpg'
                }],
                showCropper:false,
            })
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const fileList = this.state.fileList;
        console.log(fileList, "render time",this.state.showCropper,'是否显示裁剪器');
        const beforeUpload = this.beforeUpload;
        const props = {
        name: "file",
        accept: "image/jpeg,image/jpg,image/png",
        data: {
            appId: 30896
        },
        multiple: false,
        listType: "picture",
        // showUploadList: false,
        action: "/v4/web/tencentcloud/upload",
        headers: {
            authorization: "authorization-text"
        },
        // showUploadList: !this.state.showCropper ?{
        //     showRemoveIcon: true,
        //     showPreviewIcon: true
        // }:false,
        // showUploadList:{
        //     showRemoveIcon: false 
        // },
        showUploadList: true,
        fileList,
        // beforeUpload,
        // customRequest,
        beforeUpload: file => {
            console.log(file, "上传之前");

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                console.log(fileReader.result,'上传的图片地址');
                this.setState({
                    coverImages: fileReader.result,
                    showCropper: true
                })
            };
            this.setState({
                showCropper: true,
                fileList: [file],
            })
            // this.setState({
            //  fileList:[
            //   {
            //     uid: '-1',
            //     name: 'xxx.png',
            //     status: 'done',
            //     url: fileReader.result,
            //   },
            //  ],
            //  showCropper:true
            // });
            // const uploadSize = Array.isArray(this.state.fileList) ? this.state.fileList.length:0;
            // console.log(uploadSize, "文件个数选中的");
            // if (uploadSize >0 ) {
            //     Modal.error({
            //         title: '上传的文件不能超过3个，请重新选择'
            //     });
            //     return false;
            // }
            return false;
        },
        onRemove: file => {
            console.log("Do you want delete this file:", file);
            this.setState({
                fileList: []
            })
            return true;
        },
    };
    return (
        <HashRouter basename='manage' >
            <main className='main' ref={this.main}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {/* <Form.Item label="Upload">
                {getFieldDecorator("upload", {
                    valuePropName: "fileList",
                    getValueFromEvent: this.normFile
                })(
                    <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> Click to upload
                    </Button>
                    </Upload>
                )}
                </Form.Item> */}

                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> Click to upload
                    </Button>
                </Upload>
            {
            this.state.showCropper &&
            <section className='cropper-outter-wrapper'>
                <section className="clipping-modal" > 
                        <div className="clipping-main">

                            <aside className="clipping-header">
                                <div className="clipping-title">
                                    <input type="button" className="clipping-btn-img" value="上传图片"/>  
                                    <span className="clipping-icon">
                                        <button className="clipping-err" onClick={this.onCancel}><Icon type="close" /></button>
                                    </span>    
                                </div> 
                                <div className="clipping-text">
                                    <p>为了企业形象，请选择文件大小：1M以内的图片</p> 
                                    <p>支持图片格式：jpeg、jpg、png</p>    
                                </div> 
                            </aside>
                            <Cropper
                            aspectRatio={5/2}
                            src={this.state.coverImages}
                            preview=".clipping-img"
                            style={{height:'300px',width:'100%'}}
                            guides={false}
                            ref={cropper=>{this.cropper=cropper}}
                        />  
                                                
                         <button onClick={this.handleUpload}>上传图片</button>
                        </div>
                 </section>
            </section>
        }
            {/* {
                !this.state.showCropper && <img src={this.state.imageUrl}/>
            } */}
            
                            
            {/* <Form.Item label="Dragger">
            {getFieldDecorator('dragger', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,

            })(
                <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>,
            )}
            </Form.Item> */}

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
            </Form>
            </main>
        </HashRouter>
        )
    }
}
const App = Form.create({ name: 'horizontal_login' })(Apps);
export default App;