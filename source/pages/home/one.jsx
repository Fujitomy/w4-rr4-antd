import React from 'react'
// import { renderRoutes } from 'react-router-config'
import { Link } from 'react-router-dom'


// require('./home.scss')

class One extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            username: 'wang'
        }
    }
    handle(e){
        // console.log(this);
    }
    handlePage(e){
        // console.log('000');
        const id = 0;
        this.props.history.push(`/other/${id}`);
    }
    render(){
        return <div>
            <div className="tc">
                加载child /one/child 路由
                <Link to="/one/child">/one/child</Link>
            </div>
            <div className="tc mt20">
                加载动态路由
                <button className="home-button" onClick={this.handlePage.bind(this)}>加载动态路由</button>
            </div>
            <div className="home">
                { this.state.username }<br/>
                <img src="http://img4.imgtn.bdimg.com/it/u=2064784076,1799293544&fm=200&gp=0.jpg" />
            </div>
            <div className="tc fs-20">
                {/*{renderRoutes(this.props.route.routes)}*/}
            </div>
            <input value={this.state.username} onChange={this.handle.bind(this)} />
        </div>
    }
}

export default One;