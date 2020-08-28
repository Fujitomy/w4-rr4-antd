/**
 * 高德地图插件列表
 * https://lbs.amap.com/api/javascript-api/guide/abc/plugins
 * 
 */

'use strict'
import React, { Suspense, lazy as Lazy } from "react";
import { BrowserRouter, HashRouter, Link,Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import ErrBoundary from './ErrBoundary.jsx';
import './App.less';
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';
// import 'braft-editor/dist/index.css';
// import BraftEditor from 'braft-editor';
// const fs = require("fs"); 
// console.log(fs,'file system');
import { getAccessToken,getAccessSign,getUserInfo,getToken,getSign,login,getIndexData } from '@/components/Api/Axios.js';
import ajax from '@/components/Api/ajax.js';
const fetch = require('node-fetch');
const datamap = [
    {
        lnglat: [122.75359200,41.62160000],
        longitude: 122.75359200,
        latitude: 41.62160000,
        name: '辽宁',
        count: 900,
        cityType: 0, // 0省/直辖市 1省会 2市/区
        cityId: 21,
    },
    {
        lnglat: [123.43279100,41.80864500],
        longitude: 123.43279100,
        latitude: 41.80864500,
        name: '沈阳市',
        count: 100,
        cityType: 1, // 0省/直辖市 1省会 2市/区
        cityId: 210100,
    },
    {
        lnglat:[ 109.50378900,35.86002600],
        longitude: 109.50378900,
        latitude: 35.86002600,
        name:'陕西',
        count: 300,
        cityType: 0,
        cityId: 610000,
    },
    {
        lnglat:["108.948024", "34.263161"],
        longitude: "108.948024",
        latitude:"34.263161",
        name:'西安',
        count: 90,
        cityType: 1,
        cityId: 610100,
    },
    {
        lnglat:[102.89916000,35.86002600],
        longitude: 102.89916000,
        latitude: 35.86002600,
        name:'四川',
        count: 320,
        cityType: 0,
        cityId: 510000,
    },
    {
        lnglat:[104.079821,30.528333],
        longitude: 104.079821,
        latitude: 30.528333,
        name: '成都',
        count: 100,
        cityType: 1,
        cityId: 510100,
    },
    {
        lnglat:[104.70551900,31.50470100],
        longitude: 104.70551900,
        latitude: 31.50470100,
        name: '绵阳',
        count: 100,
        cityType: 3,
        cityId: 510700,
    },
    {
        lnglat: [101.59295200,24.86421300],
        longitude: 101.59295200,
        latitude: 24.86421300,
        name:'云南',
        count: 300,
        cityType: 0,
        cityId: 530000,
    },
    {
        lnglat: [102.71460100,25.04915300],
        longitude: 102.71460100,
        latitude: 25.04915300,
        name:'昆明',
        count: 300,
        cityType: 1,
        cityId: 530100,
    },
    {
        lnglat: [113.280637, 23.125178],
        longitude: 113.280637,
        latitude: 23.125178,
        name:'广州',
        count: 76,
        cityType: 0,
        cityId: '',
    },
    {
        lnglat: ["110.154393", "22.63136"],
        longitude: 110.154393,
        latitude: 22.63136,
        name:'玉林',
        count: 30,
        cityType: 2,
        cityId: '',
    },
    {
        lnglat: ["109.602146", "23.0936"],
        longitude: 109.602146,
        latitude: 23.0936,
        name:'贵港',
        count: 50,
        cityType: 2,
        cityId: '',
    },
    {
        lnglat: ["108.320004", "22.82402"],
        longitude: 108.320004,
        latitude: 22.82402,
        name:'南宁',
        count: 50,
        cityType: 2,
        cityId: '',
    },
    {
        lnglat: ["107.353926", "22.404108"] ,
        longitude: 107.353926,
        latitude: 22.404108,
        name:'崇左',
        count: 388,
        cityType: 2,
        cityId: '',
    },
    {
        lnglat: [110.792905,32.636313] ,
        longitude: 110.792905,
        latitude: 32.636313,
        name:'十堰',
        count: 99,
        cityType: 2,
        cityId: '',
    },
    {
        lnglat: [111.72066400,27.69586400] ,
        longitude: 111.72066400,
        latitude: 27.69586400,
        name:'湖南省',
        count: 99,
        cityType: 0,
        cityId: '430000',
    }
];
import request from './request.jsx';

import axios from 'axios';
import qs from 'qs';

function generateCitys(data){
    let provinces = [];
    let cities = [];
    Array.isArray(data) && data.length && 
    data.forEach(item=>{
        item.cityType ===0 ? provinces.push(item):cities.push(item);
    });
    return { provinces, cities }
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.state =  {}
    }
    componentDidMount(){
        // 创建地图
        const map = new AMap.Map('container', {
            zoom: 4,
            // viewMode:'3D',// 3D视图 => AMap.ArrayBounds
            center: [116.397428, 39.90923],//中心点坐标
            resizeEnable: true
        });
        
        
        // 创建地理逆编码实例 地址描述信息和地理坐标（经纬度）相互转换
        const geocoder = new AMap.Geocoder({
            city: "全国" || "010", // 010为北京，默认"全国"||""，city决定了转换的大范围
            radius: 1000 // 转换半径，m/米  
        });
        {
            // const address='武汉市长江大桥';
        // // getLocation 正向地理编码： 将地址描述信息转换成地理坐标（经纬度）
        // geocoder.getLocation(address, function(status, result) {
        //     if (status === 'complete'&&result.geocodes.length) {
        //         const lnglat = result.geocodes[0].location
        //         console.log(`经纬度:${lnglat}`);
        //         // const marker = new AMap.Marker();
        //         // marker.setPosition(lnglat);
        //         // map.add(marker);
        //         // map.setFitView(marker);
        //         AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
        //             const Circle = new SvgMarker.Shape['Circle']({
        //                 height: 33,
        //                 strokeWidth: 1,
        //                 strokeColor: 'lightblue',
        //                 fillColor: 'lightblue'
        //             });
        //             const Svgmaker = new SvgMarker(Circle,{
        //                 map: map,
        //                 position: lnglat || [108.320004,22.82402],
        //                 containerClassNames: 'shape-Circle',
        //                 iconLabel: {
        //                     innerHTML: address,
        //                     style: {
        //                         top: '10px',
        //                         color:'#fff'
        //                     }
        //                 },
        //                 showPositionPoint: false
        //             });
        //             map.add(Svgmaker);
        //         })
        //     }else{
        //         console.error('根据地址查询位置失败');
        //     }
        // });
        }
        // 获取地图中心点
        const center = map.getCenter();
        console.log(`地图中心点：${center}`);
        // 获取地图范围
        const bounds = map.getBounds();
        console.log('地图显示范围东北',bounds.northeast.toString());
        console.log('地图显示范围西南',bounds.northeast.toString());

        // 缩放按钮控件
        AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
            const layerCtrl = new BasicControl.LayerSwitcher({
                theme: 'my-red', // my-red 见上方style
                position: {
                    top:'30px',
                    right:'100px',
                }
            });
            map.addControl(layerCtrl);
        });

        // 给单个标注点添加数据
        // const testMarker = new AMap.Marker({
        //     position:[116.39, 39.9] // 经纬度
        // })
        // map.add(testMarker);//添加到地图
        // AMap.event.addListener(testMarker, 'click', function (e) {
        //     console.log(e,'element content')
        //     map.setZoom(8);
        //     map.setCenter(e.poi.location);
        // });

        const dataMap = generateCitys(datamap);
        const { cities, provinces } = dataMap;
        console.log(cities, provinces,'-------cities, provinces');
        let dataProvince = provinces || [];
        let dataCity = cities || [];
        let provinceGroups =  null;
        let cityGroups = null;
        let detailGroups = null;

        // 创建SvgMarker标注
        AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
            // 当前环境不支持SVG，此时SvgMarker会回退到父类，即SimpleMarker
            !SvgMarker.supportSvg && alert('当前环境不支持SVG'); 
            // 省会城市水质统计数量标记点 
            const provinceMakers = [];
            const circle = new SvgMarker.Shape['Circle']({
                 height: 33,
                 strokeWidth: 1,
                 strokeColor: '#ccc',
                 fillColor: 'gray'
            });
            const labelCenter = circle.getCenter();
            // 生成省会标记点
            for(let i = 0;i<dataProvince.length;i++){
                const maker = new SvgMarker(circle,{
                    map: map,
                    position: dataProvince[i].lnglat || [108.320004,22.82402],
                    containerClassNames: 'shape-Circle',
                    iconLabel: {
                        innerHTML: dataProvince[i].count || '--',
                        style: {
                            top: labelCenter[1] - 10 + 'px',
                            color:'#fff'
                        }
                    },
                    showPositionPoint: false
                });
                // 添加省会标记点事件
                AMap.event.addListener(maker,'click', function (e) {
                    console.log(e,'element content')
                    map.setZoom(7);
                    map.setCenter(dataProvince[i].lnglat);
                    // map.setCity('广西',(res)=>{
                    //     console.log(res,'----------res');
                    // });
                    // map.remove(makerObj);
                    // map.clearMap();
                    provinceGroups && provinceGroups.hide();
                    cityGroups && cityGroups.show();
                });
                provinceMakers.push(maker);
            }
            // 生成城市标记点
            const cityMakers = [];
            for(let i = 0;i<dataCity.length;i++){
                const maker = new SvgMarker(circle,{
                    map: map,
                    position: dataCity[i].lnglat || [108.320004,22.82402],
                    containerClassNames: 'shape-Circle',
                    iconLabel: {
                        innerHTML: dataCity[i].count || '--',
                        style: {
                            top: labelCenter[1] - 10 + 'px',
                            color:'#fff'
                        }
                    },
                    showPositionPoint: false
                });
                // 城市标记点点击事件
                AMap.event.addListener(maker, 'click', function (e) {
                    console.log(e,'element content');
                    const cityLnglat = dataCity[i].lnglat;
                    cityGroups && cityGroups.hide();
                    provinceGroups && provinceGroups.hide();
                    map.setZoom(11);
                    map.setCenter(cityLnglat);
                    console.log(cityLnglat,'城市经纬度------cityLnglat');
                    // 请求区县数据点
                    const latitude =cityLnglat[0];
                    const longitude =  cityLnglat[1]; // || ["110.154393", "22.63136"]
                    const url = 'http://200.200.200.230/hetapi/api/mock/51/v4/web/water/bigData/getWaterQualityByLoc';
                    const data = { latitude,longitude };
                    axios['get'](`${url}?`,data).then(res => { 
                        // console.log(res,'-----请求结果---------------------');
                        const data = res.data;
                        const { code, data:list } = data;
                        if(code===0 && list) {
                            const areaMakers = [];
                            // console.log(list,'-----请求结果---------------------');
                            const dataArea = list;
                            for(let i = 0;i<dataArea.length;i++){
                                const { longitude,latitude,level,locationId } = dataArea[i];
                                console.log(locationId,'-----------locationId');
                                const maker = new SvgMarker(circle,{
                                    map: map,
                                    // position: [longitude,latitude] || [108.320004,22.82402],
                                    position: ["110.154393", "22.63136"],
                                    containerClassNames: 'shape-Circle',
                                    iconLabel: {
                                        innerHTML: level || '--',
                                        style: {
                                            top: labelCenter[1] - 10 + 'px',
                                            color: '#fff'
                                        }
                                    },
                                    showPositionPoint: false,
                                    locationId
                                });
                                
                                // 区域标记点点击事件
                                AMap.event.addListener(maker,'click', function (e) {
                                    console.log(e,'element content');
                                    // console.log(e,'详情覆盖物点击');
                                    const locationId = e.target.opts.locationId;
                                    // const {lng:longitude,lat:latitude} = e.lnglat;
                                    const param = { waterType:0,locationId };
                                    const url = '/v4/web/water/bigData/getDetailsById';
                                    console.log(locationId,'详情点');
                                });
                                areaMakers.push(maker);
                            }
                            detailGroups = new AMap.OverlayGroup(areaMakers);
                            detailGroups.show();
                            // 详情覆盖物
                            // detailGroups = new AMap.OverlayGroup(areaMakers);
                            // detailGroups && detailGroups.on('click',(e)=>{
                            //     // console.log(e,'详情覆盖物点击');
                            //     const locationId = e.target.opts.locationId;
                            //     // const {lng:longitude,lat:latitude} = e.lnglat;
                            //     const param = { waterType:0,locationId };
                            //     const url = '/v4/web/water/bigData/getDetailsById'//'/v4/web/water/bigData/getCityDataDetails';
                            //     // this.timerShowBall && clearTimeout(this.timerShowBall)
                            //     // this.timerShowBall = setTimeout(()=>{
                            //     //      // this.setState({ show3DBall:true })
                            //     //      // drawtree({ closetree:true })
                            //     //      this.get3dBallData(url,param,500,500);
                            //     // },800)
                            //     console.log(locationId,'详情点 批量点击事件');
                            // });
                            // detailGroups.show();
                        }
                    });
                });
                cityMakers.push(maker);
            }
            
            cityGroups = new AMap.OverlayGroup(cityMakers);
            provinceGroups = new AMap.OverlayGroup(provinceMakers);
           

            map.add(cityGroups);
            cityGroups.hide();
            map.add(provinceGroups);
            // map.remove(provinceGroups);
        });
      
        // // 绑定事件
        // map.on('click', function(e) {
        //     console.log('您在--[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        //     const lng = e.lnglat.getLng();
        //     const lat = e.lnglat.getLat();
        //     console.log(lng,lat,'-------------lat');
        //     const lnglat = `${lng},${lat}`;
        //     console.log(e,'------------当前数据点信息 data info');
        //     geocoder.getAddress(lnglat, function(status, result) {
        //         if (status === 'complete' && result.regeocode) {
        //             const {city,citycode} =  result.regeocode.addressComponent || {};
        //             console.log(city,citycode,'citycode 城市信息',result.regeocode);
        //             map.setCity(city,(res)=>{
        //                 console.log(res,'----------切换到指定城市');
        //             });
        //         }else{
        //             console.error('根据经纬度查询地址失败');
        //         }
        //     });
        // });
        
        function getZoom(){
            return map.getZoom();
        };
        
        map.on('zoomstart', (e)=>{
            const zoom = getZoom();
            console.log(zoom,e,'zoomstart');
        });

        map.on('zoomchange', (e)=>{
            const zoom = getZoom();
            console.log(zoom,e,'zoomchange');
        });

        map.on('zoomend', e => {
            const zoom = getZoom();
            console.log(zoom,e,'zoomend');
            if(zoom<=6.04){
                provinceGroups && provinceGroups.show();
                cityGroups && cityGroups.hide();
            }
            if(zoom>6.04 && zoom<10){
                provinceGroups && provinceGroups.hide();
                cityGroups && cityGroups.show();
            }

            if(zoom>10){
                provinceGroups && provinceGroups.hide();
                cityGroups && cityGroups.hide();
            }
        });

        // 移动事件
        map.on('moveend',(e)=>{
            const centerPoint = map.getCenter();
            console.log(centerPoint,'center point info');
        });
        
        // 修改主题
        AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
            const zoomCtrl1 = new BasicControl.Zoom({
                theme: 'dark'
            }),
            zoomCtrl2 = new BasicControl.Zoom({
                position: 'br',
                showZoomNum: true
            });
            map.addControl(zoomCtrl1);
            map.addControl(zoomCtrl2);
        });
        // const alloverylays = map.getAllOverlays();
        // console.log(`所有图层${alloverylays}`);
    }
    componentWillUnmount () {
        this.isLivinig = false;
    }
    render() {
        const { } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside style={{overflowY:'scroll'}}>
                      <div id="container" style={{height:'100vh',width:'100%'}}></div>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;