'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';
import './App.less';
import { DatePicker,Select,Button,From,message,Cascader,Slider } from 'antd';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state =  {
            rangeValue:[0,3]
        }
    }
    componentDidMount(){
    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    onChange = (value)=>{
        console.log(value,'选择重复时间')
        this.setState({
            rangeValue: value
        })
    }
    render() {
        const { rangeValue=[0,3],defaultValue } = this.state;
        const marks = {
            0: '每天',
            1: '星期一',
            2: '星期二',
            3: '星期三',
            4: '星期四',
            5: '星期五',
            6: '星期六',
            7: '星期天'
        };

        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside style={{overflowY:'scroll'}}>
                        <div id="container" style={{height:'100vh',width:'100%'}}>
                            Home Page AAAAA
                            <Slider marks={marks}  tooltipVisible = {false}range min={0} max={7} step={1} value={rangeValue}  onChange={this.onChange} />
                        </div>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;