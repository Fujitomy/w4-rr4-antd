
import React, { Component } from "react";
import { BrowserRouter, Link,Route } from 'react-router-dom';
// import { DatePicker } from 'antd';
import Loadable from 'react-loadable';
import Loading from 'components/Loading/';

const Home = Loadable({loader: () => import('pages/home/home'),loading:Loading});
const One = Loadable({loader: () => import('pages/home/one.jsx'),loading:Loading});
const Two = Loadable({loader: () => import('pages/home/two'),loading:Loading});
const User = Loadable({loader: () => import('pages/user/user'),loading:Loading});


class App extends React.Component{
    onChange=(date, dateString)=>{
        console.log(date, dateString);
    }
    render() {
        return <BrowserRouter>
            <main>
                <h1>React Web App 16.0+</h1>
                <ul className="nav">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/one">One</Link></li>
                    <li><Link to="/two">Two</Link></li>
                    <li><Link to="/user">User</Link></li>
                </ul>
                {/*<DatePicker onChange={this.onChange} />*/}
                {/*{renderRoutes(routes)}*/}
                <div>
                    <Route path="/" exact component={Home}/>
                    <Route path="/one" component={One}/>
                    <Route path="/two" component={Two} />
                    <Route path="/user" component={User} />
                </div>
            </main>
        </BrowserRouter>
    }
}

export default App;