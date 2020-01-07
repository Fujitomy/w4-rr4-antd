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
import ImageLoader from 'react-imageloader';

import LazyLoad from 'react-lazyload';
const loadingImg = require('./giphy.gif');
function preloader() {
    return <img src={loadingImg} />;
}
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
                openPreview: false
            })
        },3000)
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

        const imgList = [
            'http://img.kuai8.com/attaches/album/20140718/201407181722411740.jpg',
            'http://img4.xiazaizhijia.com/walls/20161013/mid_020251f05941d22.jpg',
            'http://pic.bizhi360.com/bbpic/32/3032.jpg',
         
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143910.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143913.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143915.jpg',

            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143916.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143917.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143918.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143919.jpg',
            'http://www.dnzhuti.com/uploads/allimg/180629/95-1P629143920.jpg'
        ];
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside style={{overflowY:'scroll'}}>
                        {/* <PhotoSwipe 
                            isOpen={openPreview} 
                            items={previewList} 
                            options={{errorMsg:'图片加载失败，请检查网络',fullscreenEl: false}} 
                            imageLoadComplete={ this.imageLoadComplete.bind(this)}
                            onClose={this.handleClose.bind(this)}
                        /> */}


            {
                imgList.map((url,idx)=>(
                    // <LazyLoad 
                    // height={200} 
                    // once={false}
                    // key={idx} 
                    // offset={[0, 100]}
                    // overflow={true}
                    // placeholder={<div style={{zIndex:'99999',color:'red'}}>图片加载中</div>}
                    
                    // >
                    //     <img style={{width:'100%'}}src={url} /> 
                    // </LazyLoad>
                    <img 
                    style={{width:'100%'}}
                    onLoad={function(e){
                        console.log(e,'图片加载中....')
                    }}
                    src={url}  key={idx}/> 
                ))
            }
      

      {/* <LazyLoad height={200}>
        <img src="http://img.kuai8.com/attaches/album/20140718/201407181722411740.jpg" /> 
      </LazyLoad> */}
       
                    <ImageLoader
 src="https://cn.bing.com/th?id=OIP.vo8ZLtGBS_LGY8dKvTNCtgHaEo&pid=Api&rs=1"
                        wrapper={React.createFactory('div')}
                        preloader={preloader}>
                        Image load failed!
                    </ImageLoader>


                   
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;