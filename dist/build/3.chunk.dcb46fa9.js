(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{484:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),c=a(46);t.default=class extends s.a.Component{constructor(e,t){super(e,t),this.state={username:"wang"}}handle(e){}handlePage(e){this.props.history.push("/other/0")}render(){return s.a.createElement("div",null,s.a.createElement("div",{className:"tc"},"加载child /one/child 路由",s.a.createElement(c.Link,{to:"/one/child"},"/one/child")),s.a.createElement("div",{className:"tc mt20"},"加载动态路由",s.a.createElement("button",{className:"home-button",onClick:this.handlePage.bind(this)},"加载动态路由")),s.a.createElement("div",{className:"home"},this.state.username,s.a.createElement("br",null),s.a.createElement("img",{src:"http://img4.imgtn.bdimg.com/it/u=2064784076,1799293544&fm=200&gp=0.jpg"})),s.a.createElement("div",{className:"tc fs-20"}),s.a.createElement("input",{value:this.state.username,onChange:this.handle.bind(this)}))}}}}]);