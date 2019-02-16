/*
*  侧菜单栏
*
*/

import React, { PropTypes, PureComponent, Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button } from 'antd';
import './index.less';

const { SubMenu } = Menu;

function Sidebar(props){
    return (
        <aside className={'global-sidebar'} id='global-sidebar'>
            <Folder />
            <MenuList routes = { props.routes } />
        </aside>
    )
}

function Folder(props) {
    return (
        <button className='global-folder' id='global-folder'>
            展开
        </button>
    )
}

function MenuList(props) {
    const routes = props.routes;
    return (
        routes.map((route,idx)=>(
            <li key={route.url}>
                <Link to={`/${route.url}`}>
                    { route.name || '' }
                </Link>
            </li>
        ))
    )
}

export default Sidebar;


// class SidebarOld extends Component {
//     static contextTypes = {
//         router: PropTypes.object.isRequired
//     }
//     constructor(props){
//         super(props);
//         this.rootSubmenuKeys = this.props.accessRootKeys || [];
//         this.state = {
//             collapsed: false,
//             openKeys: [],// ['1130']
//             winHeight: document.documentElement.clientHeight || document.body.clientHeight,
//             leavePrompt: false,
//             // theme: 'dark',
//         }
//         this.onResize = this.onResize.bind(this);
//     }
//     componentWillReceiveProps(next){
//         if(next.location.dataMenu!==this.props.location.pathname){
//             // const sidebar = this.refs.sidebar;
//             // const height = document.getElementById("sidebar").offsetHeight
//             // console.log(sidebar.currentStyle,height,'height');
//             // console.log(next.dataMenu,'-------next.dataMenu--------');
//
//             let menu = next.dataMenu;
//             let pathname = next.location.pathname;
//             let activeIndex = 0;
//             let openKeys = [];
//             for(let i=0;i<menu.length;i++){
//                 let subRights = menu[i].subRights || [];
//                 openKeys = menu[i].rightId;
//                 for(let j=0;j<subRights.length;j++){
//                     let url = subRights[j].url;
//                     if(pathname.indexOf(url) != -1){
//                         activeIndex = subRights[j].rightId;
//                         break;
//                     }
//                 }
//             }
//             this.setState({
//                 selectedKeys:[`${activeIndex}`],
//                 // openKeys: [`${openKeys}`]
//             });
//             // console.log(activeIndex,'activeIndex',openKeys,'openKeys');
//         }
//     }
//     componentDidMount(){
//         this.handleResize();
//         window.addEventListener('resize', this.onResize);
//         // this.timer = setTimeout(()=>{
//         //     // const sidebar = this.refs.sidebar;
//         //     // const height = document.getElementById("sidebar").offsetHeight
//         //     // console.log(sidebar.offsetHeight,height,'height-');
//         //     // console.log(next.dataMenu,'-------next.dataMenu--------');
//         //     // 点击展开，获取包含层高度，如果超过一屏，出滚动条
//         // },2000);
//     }
//     componentWillUnmount(){
//         window.removeEventListener('resize',this.onResize.bind(this));
//     }
//     handleResize=()=>{
//         this.setState({ winHeight: document.documentElement.clientHeight || document.body.clientHeight });
//     }
//     onResize(){
//         this.handleResize();
//     }
//     // 展开关闭侧边栏
//     handleCollapsed = (openkeys) => {
//         this.setState({
//             collapsed: !this.state.collapsed,
// 			//sidebarCollapsed: !this.state.collapsed
//         },()=>{
// 			this.props._setState({
// 				sidebarCollapsed: this.state.collapsed
//             })
//         });
//     }
//     // 处理选中菜单项
//     handleOpenChange = (openKeys) => {
//         // console.log(openKeys,'-----------openKeys-------------');
//
//         // 找出数组中不存在的openKey，即最新选中展开项
//         const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
//         // console.log(latestOpenKey,'-----------openKeys-------------');
//         // console.log(latestOpenKey,'--------------latestOpenKey-------------');
//         if(this.rootSubmenuKeys.indexOf(latestOpenKey) === -1){
//
//             //console.log({ openKeys },'--openKeys---');
//             // 如果默认的根节点中也无法搜索到最新的展开键值的话，就使用最新的键值
//             // 展开多个
//             // this.setState({ openKeys });
//
//             // 展开一个
//             this.setState({ openKeys:[latestOpenKey] },()=>{
//                 // const sidebar = this.refs.sidebar;
//                 // const height = document.getElementById("sidebar").offsetHeight
//                 // console.log(sidebar.offsetHeight,'height -  after');
//             })
//             // const sidebar = this.refs.sidebar;
//             // const height = document.getElementById("sidebar").offsetHeight
//             // console.log(sidebar.offsetHeight,'height -  after');
//         }
//         else{
//             this.setState({
//                 openKeys: latestOpenKey ? [latestOpenKey] : [],
//             });
//         }
//     }
//     handleClick=(item, key, selectedKeys)=>{
//         this.props.leavePrompt!==undefined && !this.props.leavePrompt && this.setState({
//             selectedKeys:[item.key]
//         })
//     }
//     // 页面跳转前提示，默认关闭，确认/跳转，取消/不跳转
//     handlePrompt(pathname){
//         this.props._setState({
//             showDialog: true,
//             messageDialog: this.props.leaveMessage || '您确认要离开当前页面吗？',
//             dialogCallback:()=>{
//                 this.props._setState({
//                     leavePrompt: false,
//                     leaveMessage: '',
//                 },()=>{
//                     this.context.router.push({ pathname })
//                 })
//             }
//         });
//     }
//     render(){
//         const { dataMenu } = this.props;
//         const { winHeight,collapsed,selectedKeys } = this.state;
//         const maxHeight = winHeight - 80-48-50;
//
//         const sidebarStyles = {
//             width: collapsed ? 80:220,
//             height: winHeight-78 || 'auto',
//             background: collapsed ?'#fff':'#203a71',
//             overflow: 'auto'
//         }
//
//         const defaultOpenKeys = [];
//         const MenuList = dataMenu.map((el, i) => {
//             const { subRights,rightId,rightName,icon } = el;
//             if(subRights === undefined) {
//                 return (
//                     <SubMenu
//                         key={rightId}
//                         title={
//                             <span className='global-sidebar-title'>
//                                 <i className={`anticon-water anticon-${icon}`}></i>
//                                 <span>{rightName}</span>
//                             </span>
//                         }
//                     />
//                 )
//             }
//             return (
//                 <SubMenu
//                     key={rightId}
//                     title={
//                         <span className='global-sidebar-title'>
//                             <i className={`anticon-water anticon-${icon}`}></i>
//                             <span>{rightName}{/*{rightId}*/}</span>
//                         </span>
//                     }
//                 >
//                     {
//                         subRights.map((el2, i2) => {
//                             if(el2.url.indexOf(this.props.location.pathname)!==-1){
//                                 defaultOpenKeys.push(`${el.rightId}`)
//                             }
//                             const { rightId,rightName,url,icon } = el2;
//                             const hashUrl = typeof url === 'string'
//                                 ? `${url.indexOf('#') == -1 ? url: url.slice(url.indexOf('#')+1)}`
//                                 : `/main`;
//
//                             return (
//                                 <Menu.Item key={rightId}>
//                                     <a href={ this.props.leavePrompt ? 'javascript:;': `#${hashUrl}` }
//                                        onClick={!!this.props.leavePrompt && this.handlePrompt.bind(this,hashUrl)}
//                                        className='global-sidebar-subtitle'>
//                                         <i className={`anticon-water anticon-${icon}`}></i>
//                                         <span>{rightName}{/*{rightId}*/}</span>
//                                     </a>
//                                 </Menu.Item>
//                             )
//                         })
//                     }
//                 </SubMenu>
//             )
//         });
//         return <section id='global-sidebar' style={sidebarStyles} data-h={winHeight-78}>
//             <Button
//                 onClick={this.handleCollapsed}
//                 style={{
//                     display:'block',
//                     margin: '8px auto',
//                     background: collapsed?'transparent':'#203a71',
//                     border:  0,
//                     color: collapsed?'#203a71':'#B4D9FF',
//                 }}>
//                 <i className={collapsed?'anticon-water anticon-caidan':'anticon-water anticon-caidan' } />
//             </Button>
//             <div className='global-sidebar-wrapper'
//                  style={{ overflowY:'hidden',height: maxHeight }}
//                  ref={'sidebar'} id={'sidebar'}>
//                 <div style={{ display:collapsed?'none':'block' }}>
//                     <Menu
//                         defaultSelectedKeys={['1131']}
//                         defaultOpenKeys={['1130']}
//                         //selectedKeys={ ['2040']}
//                         mode="inline"
//                         theme="dark"
//                         openKeys={ this.state.openKeys }
//                         onOpenChange={ this.handleOpenChange }
//                         className='global-sidebar-ul'
//                         onClick={this.handleClick}
//                         selectedKeys = {selectedKeys}
//                     >
//                         { MenuList }
//                     </Menu>
//                 </div>
//             </div>
//             <aside className={`sidebar-logo-wrapper ${collapsed ?'hide':''}`}>
//                 <i className={`anticon-water anticon-clife-logo sidebar-logo`}/>
//             </aside>
//         </section>
//     }
// }
//
// export default Sidebar;