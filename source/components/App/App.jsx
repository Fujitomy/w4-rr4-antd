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
import reqwest from "reqwest";

import './App.less';

const allCity = require('./all.json');
import { DatePicker,Select,Button,From,message,Cascader } from 'antd';
const { Option } = Select;


window.all = allCity;


// const swiper = require('swiper.min.js');
// import './swiper.min.css';

function getCascaderOptions(all={}){
    const partitions = Array.isArray(all.data) ? all.data[0]['partitions'] :null;
	const provinces = [];
	Array.isArray(partitions) && partitions.map(region=>{
		const provincesList = region.provinces;
		Array.isArray(provincesList) && provincesList.map(item=>{
             // console.log(item,'--item-------------');
             provinces.push({
				 provinceId:  item.provinceId,
				 provinceName: item.provinceName,
				 cities: item.cities		     
			});
    	});
    });


	
   function simpleNest(uglyArr,simpleArr=[]){
		
		if(Array.isArray(uglyArr)){
			  uglyArr.map(item=>{
				
					 let hasProvince = item.hasOwnProperty('provinces');
					 let keyName = '';

					 if(hasProvince) keyName = 'province';

                     const provinces = item || null;

					
   					let cityChild = [...provinces.cities];
					// console.log(cityChild,'-------------cityChild1111111111111111111111111---------------------');

					let newCity = null;
					if(cityChild){
					   
						//  console.log(cityChild,'-----------cityChild 遍历前-----------');
						
							     newCity = cityChild.map(item=>{
									// console.log(item,'-------------城市------------');
				
									return {
                                        id:item.cityId,
                                        name:item.cityName,
                                        child:((areas)=>{
											let areaList = null
											if(Array.isArray(areas)){
											   // console.log(areas,'-------------乡镇------------');
                                               areaList = areas.map(el=>{
                                                    return {
                                                        id:el.areaId,
                                                        name: el.areaName,
                                                    }
                                                })
								            }
				
											return areaList
										})(item.areas)
									}
					    })
	                    // console.log(newCity,'------------cityChild 遍历后------------');
					}
					
      
                     

					const province = {
						id:   provinces.provinceId,
						name: provinces.provinceName,
						child: newCity
					};

					// console.log(newCity,'-------------provinces--------省会------------');
					simpleArr.push(province);
			  })
		      
			// over
				  
		 }
		 console.log(simpleArr,'simpleArr');
		 return simpleArr
    }

    const provincesList = simpleNest(provinces,[])

    return provincesList


	console.log(provinces,provincesList,'------------------遍历结果')
}
// getCascaderOptions(allCity)
// function getCascaderOptions(all){
//     const { partitions } = all.data || {};
//     const provinces = Array.isArray(partitions)? partitions.filter(region=>region.provinces):null;
// }

// mock virtual data
const Mock = require('mockjs');
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


const provincesList = [
    {provinceId:'',provinceName:'请选择'},
    {provinceId:1,provinceName:'北京'},
    {provinceId:2,provinceName:'上海'},
    {provinceId:3,provinceName:'天津'},
    {provinceId:4,provinceName:'重庆'},
];
  
const citiesList = [
      {
          1:[
              {cityId:'11',cityName:'昌平区',},
              { cityId:'12',cityName:'鼓楼区',},
              {cityId:'13',cityName:'朝阳',},
           ]
      },
      {
          2:[
              {cityId:'21',cityName:'外滩',},
              { cityId:'22',cityName:'浦东区',}
           ]
      },
      {
          3:[
              {cityId:'33',cityName:'开发新区',},
              { cityId:'34',cityName:'老城区',}
           ]
      },
      {
          4:[
              { cityId:'41',cityName:'万州区',},
              { cityId:'42',cityName:'长寿区',},
              { cityId:'42',cityName:'渝中区',},
           ]
      },
];
const areasList = [
      {
          11:[
              {areaId:111,areaName:'燕山',},
              {areaId:112,areaName:'八达岭',}
          ]
      }
];



function ajax(url, type='get', data, successFn,errorFn){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange=(res)=>{
        if (xhr.readyState==4 ){
            if (xhr.status == 200 || xhr.status == 304) {
                console.log(res,'res---');
                successFn([xhr.responseText]);
            } else {
                errorFn(xhr.status);
            }
        }
    }
    if (type === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.withCredentials = true;
  
    xhr.open(type,url,true);
    xhr.setRequestHeader('*', 'Access-Control-Allow-Origin');
    
    xhr.send(makeHttpRequestData(data));
}

/**
 * 转换json数据为http请求数据格式
 * @param    {json}   data json格式的数据
 * @return   {string} 返回http请求数据格式(形如：name=张三&age=21)
 */

function makeHttpRequestData(data) {
    let dataString = '';
    for (let k in data) {
        dataString += k + '=' + encodeURI(data[k]) + '&';
    }
    return dataString.slice(0, -1);
}

const cityList = {};
const areaList = {};
const initProvinces = [{ provinceId:'',provinceName:'请选择' }];
const initCities = [{cityId:'',cityName:'请选择'}];
const initAreas = [{areaId:'',areaName:'请选择'}];
class Apps extends React.Component {
    constructor(props){
        super(props)
      
        this.state = {
            provinces: initProvinces,
            provinceId:'',
            cities:  initCities,
            cityId:'',
            areas: initAreas,
            areaId:'',
            provinceLoading: true,
            cityLoading: false,
            areaLoading: false,
        }
    }
    componentDidMount() {


        this.setState({
            options:getCascaderOptions(allCity)
        })

        // 轮询数据
        
        function* pollydata(userId,token,sign){
            // onloading();
            console.log('loding...');
            token = userId ? yield getAccessToken(userId):'';
            sign = token ? yield getAccessSign(token):'';
            sign && token && (yield getUserInfo(token,sign));
            // exitLoading();
            console.log('exit loding');
        }

        
        async function pollyData(){
            const token = getToken();
            const sign = await getSign(token);
            console.log(token,sign,'----------获取签名和token');
        }
      
        function getToken(userId){
            axios.get('http://www.mocky.io/v2/5dd65bfc3200005e00888974?mocky-delay=5000ms')
                .then(function (res) {
                    typeof res === 'string' ? JSON.parse(res):res;
                    res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
                    const { code,data } = res.data || {};
                    console.log(res.data,'----response--------',data);
                    if(code===0 && data){
                        console.log(data.token,'data.token')
                    }
                    return data.token
                })
                // .catch(function (error) {
                //     console.log('获取token失败:',JSON.stringify(error));
                // });
        }

        function getSign(userId){
            axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
                .then(function (res) {
                    typeof res === 'string' ? JSON.parse(res):res;
                    res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
                    const { code,data } = res.data || {};
                    console.log(res.data,'----response--------',data);
                    if(code===0 && data){
                        console.log(data.token,'data.token')
                    }
                    return data.sign
                })
                // .catch(function (error) {
                //     console.log('获取token失败:',JSON.stringify(error));
                // });
        }
        pollyData();
        // const g = pollydata('tomy');
        // g.next();

        // function getAccessToken(userId){
        //     console.log(userId,'userId获取token');
           
        //     axios.get('http://www.mocky.io/v2/5dd4ddb52f000072c3d4fc832121?mocky-delay=5000ms')
        //         .then(function (res) {
        //             typeof res === 'string' ? JSON.parse(res):res;
        //             res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
        //             const { code,data } = res.data || {};
        //             // console.log(res.data,'----response--------',data);
        //             if(code===0 && data){
        //                 console.log(data.token,'data.token')
        //                 g.next({
        //                     token: data.token
        //                 });
        //             }
        //         })
        //         .catch(function (error) {
        //             console.log('获取token失败:',JSON.stringify(error));
        //             g.next();
        //         });
        // }

        // function getAccessSign(token){
        //     console.log(token,'token获取签名------');
        //     axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
        //         .then(function (res) {
        //             typeof res === 'string' ? JSON.parse(res):res;
        //             res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
        //             const { code,data } = res.data || {};
        //             if(code===0 && data){
        //                 console.log(data.sign,'签名');
        //                 g.next({
        //                     sign: data.sign
        //                 });
        //             }
        //         })
        //         .catch(function (error) {
        //             g.return('结束')
        //             console.log('获取sign签名失败:',error);
        //         });
        // }

        // function getUserInfo(token,sign){
        //     console.log(token,sign,'ttoken,signoken获取用户信息------');
        //     axios.get('http://www.mocky.io/v2/5dd4dffb2f00007100d4fc95')
        //         .then(function (res) {
        //             typeof res === 'string' ? JSON.parse(res):res;
        //             res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
        //             const { code,data } = res.data || {};
        //             if(code===0 && data){
        //                 console.log(data.sign,'签名');
        //                 g.next({
        //                     sign: data.sign
        //                 });
        //             }
        //         })
        //         .catch(function (error) {
        //             g.return('结束')
        //             console.log('获取用户信息失败或错误:',error);
        //         });
        // }
    }

    


    render() {
        const { provinces,cities,areas } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <aside>
                        数据：{JSON.stringify(this.state.dataInfo)}
                    </aside>
                </main>
            </HashRouter>
        )
    }
}
const App = Apps;
export default App;









	
