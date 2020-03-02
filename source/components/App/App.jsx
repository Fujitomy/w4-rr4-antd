'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';
import './App.less';
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state =  {}
    }
    componentDidMount(){
    }
    componentWillUnmount () {
        this.isLivinig = false
    }
    render() {
        const { } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside style={{overflowY:'scroll'}}>
                        <div id="container" style={{height:'100vh',width:'100%'}}>Home Page AAAAA</div>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;