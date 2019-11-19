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


console.log(allCity,'allCity');

window.all = allCity;


// const swiper = require('swiper.min.js');
// import './swiper.min.css';

function getCascaderOptions(all={}){
    const partitions = Array.isArray(all.data) ? all.data[0]['partitions'] :null;
	const provinces = [];
	Array.isArray(partitions) && partitions.map(region=>{
		const provincesList = region.provinces;
		Array.isArray(provincesList) && provincesList.map(item=>{
             console.log(item,'--item-------------');
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



    }
   
   
    handleAreaChange = value =>{
        // this.setState({
        //     areaId: value,
        // },()=>{
        //     this.returnSelectValue(this.state.areaId,'areaId');
        // });
    }
    render() {
        const { provinces,cities,areas } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <Cascader 
                        fieldNames={{ label: 'name', value: 'id', children: 'child' }} 
                        options={this.state.options} 
                    />

                    
                </main>
            </HashRouter>
        )
    }
}
const App = Apps;
export default App;


// getDataList(params){
//     const { prefixName,keyId,childPrefixName,childkeyId,url } =params;
//     this.setState({
//         [`${prefixName}Loading`]:true,
//     });
//     axios.get(`${url}?${prefixName}Id=${keyId}`).then((res) => {
//             console.log(res,'city data list');
//             const { data:{code,data:dataList} } = res || {};
//             if(code===0){
//                 console.log(dataList,'选中省份的城市列表');
//                 // 过滤下无用的冗余字段太多
//                 const newList = dataList.map(data=>({
//                     cityId:data.cityId,
//                     cityName:data.cityName,
//                 }));

//                 if([`${prefixName}List`][provinceId]===undefined){
//                     cityList[provinceId] = newList;
//                 }
                
//                 console.log(cityList,'-----cityList-------');

//                 setTimeout(()=>{
//                     this.setState({
//                         cityLoading: false,
//                         cities: [{cityId:'',cityName:'请选择'},...city],
//                         cityId: cityId || ''
//                     })
//                 },2000)
//             }
//         }).catch(function (error) {
//             console.log(error);
//             this.setState({
//                 cityLoading: false,
//             })
//             message.info('城市信息请求失败，请稍后重试！');
//     });
// }










	
