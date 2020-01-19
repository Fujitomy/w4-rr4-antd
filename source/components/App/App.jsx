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

const loadingImg = require('./giphy.gif');
function preloader() {
    return <img src={loadingImg} />;
}



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
        var map = new AMap.Map('container', {
            zoom: 4,
            viewMode:'3D',//使用3D视图
            center: [116.397428, 39.90923],//中心点坐标
            resizeEnable: true
        });

        var geocoder = new AMap.Geocoder({
            city: "010", //城市设为北京，默认：“全国”
            radius: 1000 //范围，默认：500
        });



        
        var mapbounds = map.getBounds();
        
        console.log(mapbounds,'mapbounds');
        // 添加控制图层
        AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
            var layerCtrl = new BasicControl.LayerSwitcher({
                //my-red 见上方style
                theme: 'my-red',
                position: {
                    top:'30px',
                    right:'100px',
                }
            });
            map.addControl(layerCtrl);
        });

        // var marker111 = new AMap.Marker({
        //     position:[116.39, 39.9]//位置
        // })
        // map.add(marker111);//添加到地图

        // AMap.event.addListener(marker111, 'click', function (e) {
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

        // 创建标注
        AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
            if(!SvgMarker.supportSvg) {
                //当前环境并不支持SVG，此时SvgMarker会回退到父类，即SimpleMarker
                alert('当前环境不支持SVG');
            }
            // 省会城市水质等级标注点对象
            const provinceMarkers = [];
            const shape = new SvgMarker.Shape['Circle']({
                 height: 33,
                 strokeWidth: 1,
                 strokeColor: '#ccc',
                 fillColor: 'gray'
            });
            const labelCenter = shape.getCenter();
            console.log(labelCenter)
            // 
            for(let i = 0;i<dataProvince.length;i++){
                let provinceMakers = new SvgMarker(shape,{
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
                // 添加省会标记事件
                AMap.event.addListener(provinceMakers, 'click', function (e) {
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
                provinceMarkers.push(provinceMakers);
            }

            // 添加城市标记点
            let cityMakers = [];
            for(let i = 0;i<dataCity.length;i++){
                let makers = new SvgMarker(shape,{
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
                // 城市点击事件
                AMap.event.addListener(makers, 'click', function (e) {
                    console.log(e,'element content');
                    cityGroups && cityGroups.hide();
                    provinceGroups && provinceGroups.hide();
                    map.setZoom(11);
                    map.setCenter(dataCity[i].lnglat);
    
                    // // map.setCity('广西',(res)=>{
                    // //     console.log(res,'----------res');
                    // // });
                    // // map.remove(makerObj);
                    // // map.clearMap();
                    
                    console.log(cityGroups,'cityGroups');
                });
                cityMakers.push(makers);
            }
            cityGroups = new AMap.OverlayGroup(cityMakers);
            provinceGroups = new AMap.OverlayGroup(provinceMarkers);

            map.add(cityGroups);
            cityGroups.hide()
            map.add(provinceGroups);
            // 添加覆盖物群组
            function addOverlayGroup() {
                map.add(provinceGroups);
            }
            // 移除覆盖物群组
            function removeOverlayGroup() {
                map.remove(provinceGroups);
            }
        });

        // 监听点击事件
        map.on('click', function(e) {
            const lng = e.lnglat.getLng();
            const lat = e.lnglat.getLat()
            console.log(lng,lat,'-------------lat');
            const lnglat = `${lng},${lat}`;
            console.log(e,'-------------current data info');
            geocoder.getAddress(lnglat, function(status, result) {
                if (status === 'complete'&&result.regeocode) {
                    const {city,citycode} =  result.regeocode.addressComponent || {};
                    console.log(city,citycode,'citycode 城市信息',result.regeocode);
                    map.setCity(city,(res)=>{
                        console.log(res,'----------切换到指定城市');
                    });
                }else{
                    console.error('根据经纬度查询地址失败')
                }
            });
        });
        
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
            var zoomCtrl1 = new BasicControl.Zoom({
                theme: 'dark'
            }),
            zoomCtrl2 = new BasicControl.Zoom({
                position: 'br',
                showZoomNum: true
            });
    
            map.addControl(zoomCtrl1);
            map.addControl(zoomCtrl2);
        });
       
        // 绑定事件
        map.on('click', (e)=>{
            console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        });
      

        console.log(map.getAllOverlays(),'all masker');
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
                    <div id="container" style={{height:'100vh',width:'100%'}}></div>
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
export default App;