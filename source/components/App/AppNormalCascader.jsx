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
import { DatePicker,Select,Button,From,message } from 'antd';
const { Option } = Select;


 
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

const provinces = [
    {provinceId:'',provinceName:'请选择'},
    {provinceId: 21, provinceName: "辽宁省"},
    {provinceId: 22, provinceName: "吉林省"},
    {provinceId: 23, provinceName: "黑龙江省"},
    {provinceId: 11, provinceName: "北京市"},
    {provinceId: 12, provinceName: "天津市"},
    {provinceId: 13, provinceName: "河北省"},
    {provinceId: 14, provinceName: "山西省"},
    {provinceId: 15, provinceName: "内蒙古自治区"},
    {provinceId: 31, provinceName: "上海市"},
    {provinceId: 32, provinceName: "江苏省"},
    {provinceId: 33, provinceName: "浙江省"},
    {provinceId: 34, provinceName: "安徽省"},
    {provinceId: 35, provinceName: "福建省"},
    {provinceId: 36, provinceName: "江西省"},
    {provinceId: 37, provinceName: "山东省"},
    {provinceId: 71, provinceName: "台湾"},
    {provinceId: 41, provinceName: "河南省"},
    {provinceId: 42, provinceName: "湖北省"},
    {provinceId: 43, provinceName: "湖南省"},
    {provinceId: 44, provinceName: "广东省"},
    {provinceId: 45, provinceName: "广西壮族自治区"},
    {provinceId: 46, provinceName: "海南省"},
    {provinceId: 81, provinceName: "香港特别行政区"},
    {provinceId: 82, provinceName: "澳门特别行政区"},
    {provinceId: 50, provinceName: "重庆市"},
    {provinceId: 51, provinceName: "四川省"},
    {provinceId: 52, provinceName: "贵州省"},
    {provinceId: 53, provinceName: "云南省"},
    {provinceId: 54, provinceName: "西藏自治区"},
    {provinceId: 61, provinceName: "陕西省"},
    {provinceId: 62, provinceName: "甘肃省"},
    {provinceId: 63, provinceName: "青海省"},
    {provinceId: 64, provinceName: "宁夏回族自治区"},
    {provinceId: 65, provinceName: "新疆维吾尔自治区"},

    // {provinceId:1,provinceName:'北京'},
    // {provinceId:2,provinceName:'上海'},
    // {provinceId:3,provinceName:'天津'},
    // {provinceId:4,provinceName:'重庆'},
];
const cities = [
    {
        provinceId:'',cityId:'',cityName:'请选择',
    }
]

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
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        const { provinceId,cityId,areaId } = this.props;

        axios.get(
            `https://api.clife.cn/v1/web/env/provincialCascade/province`,
        ).then((res) => {
            console.log(res,'area 区县 data list');
            const { data:{code,data:dataList} } = res || {};
            console.log(dataList,'选中城市的区县列表');
            // 过滤下无用的冗余字段太多
            const provinces = dataList.map(data=>({
                provinceId: data.provinceId,
                provinceName: data.provinceName,
            }));
            console.log(areaList,'-----areaList-区县------');
            setTimeout(()=>{
                this.setState({
                    provinceLoading: false,
                    provinces: [{provinceId:'',provinceName:'请选择'},...provinces],
                    provinceId: provinceId ||''
                })
            },2000)
        }).catch(function (error) {
            this.setState({
                provinceLoading: false,
                provinces: [{provinceId:'',provinceName:'请选择'}],
                provinceId: provinceId ||''
            })
            message.info('省会信息请求失败，请稍后重试！');
        });
        if(provinceId!==undefined){
            this.getCityList(provinceId,cityId);
            if(cityId){
                this.getAreaList(cityId,areaId);
            }
        }
    }
    getCityList(provinceId,cityId){
        this.setState({
            cityLoading:true,
        });
        axios.get(`https://api.clife.cn/v1/web/env/provincialCascade/city?provinceId=${provinceId}`).then((res) => {
                console.log(res,'city data list');
                const { data:{code,data:dataList} } = res || {};
                if(code===0){
                    console.log(dataList,'选中省份的城市列表');
                    // 过滤下无用的冗余字段太多
                    const city = dataList.map(data=>({
                        cityId:data.cityId,
                        cityName:data.cityName,
                    }));
    
                    if(cityList[provinceId]===undefined){
                        cityList[provinceId] = city;
                    }
                    
                    console.log(cityList,'-----cityList-------');
    
                    setTimeout(()=>{
                        this.setState({
                            cityLoading: false,
                            cities: [{cityId:'',cityName:'请选择'},...city],
                            cityId: cityId || ''
                        })
                    },2000)
                }
            }).catch(function (error) {
                console.log(error);
                this.setState({
                    cityLoading: false,
                })
                message.info('城市信息请求失败，请稍后重试！');
        });
    }
    getAreaList(cityId,areaId){
        this.setState({
            areaLoading: true,
        });
        axios.get(
            `https://api.clife.cn/v1/web/env/provincialCascade/area?cityId=${cityId}`,
        ).then((res) => {
            console.log(res,'area 区县 data list');
            const { data:{code,data:dataList} } = res || {};
            console.log(dataList,'选中城市的区县列表');
            // 过滤下无用的冗余字段太多
            const area = dataList.map(data=>({
                areaId: data.areaId,
                areaName: data.areaName,
            }));
            if(areaList[cityId]===undefined){
                areaList[cityId] = area;
            }
            console.log(areaList,'-----areaList-区县------');
            setTimeout(()=>{
                this.setState({
                    areaLoading: false,
                    areas: [{areaId:'',areaName:'请选择'},...area],
                    areaId:areaId||''
                })
            },2000)
        }).catch(function (error) {
            console.log(error);
            this.setState({
                areaLoading: false,
                areas: [{areaId:'',areaName:'请选择'}],
                areaId: ''
            })
            message.info('区县信息请求失败，请稍后重试！');
        });
    }
    handleProvinceChange = value => {
        this.setState({
            provinceId:value,
            cityId: '',
            cities: initCities,
            cityLoading: true,
            areaId: '',
            areas: initAreas
            // city: city[value],
            // selectCity: city[value][0],
            // selectProvince: value
        },()=>{
            const provinceId = this.state.provinceId;
            this.returnSelectValue(provinceId,'provinceId');
            if(cityList[provinceId]!==undefined){
                const city = cityList[provinceId];
                console.log('---------???');
                this.setState({
                    cityLoading: false,
                    cities: [{cityId:'',cityName:'请选择'},...city]
                })
                return;
            }
            this.getCityList(provinceId);
            console.log('---------???');
            // axios.get(`https://api.clife.cn/v1/web/env/provincialCascade/city?provinceId=${provinceId}`).then((res) => {
            //     console.log(res,'city data list');
            //     const { data:{code,data:dataList} } = res || {};
            //     console.log(dataList,'选中省份的城市列表');
            //     // 过滤下无用的冗余字段太多
            //     const city = dataList.map(data=>({
            //         cityId:data.cityId,
            //         cityName:data.cityName,
            //     }));
            //     cityList[provinceId] = city;
            //     console.log(cityList,'-----cityList-------');

            //     setTimeout(()=>{
            //         this.setState({
            //             cityLoading: false,
            //             cities: [{cityId:'',cityName:'请选择'},...city]
            //         })
            //     },2000)
            // }).catch(function (error) {
            //     console.log(error);
            //     message.info('城市信息请求失败，请稍后重试！');
            // });
        });
    }
    handleCityChange = value => {
        this.setState({
            cityId: value,
            areaId:'',
            areas: initAreas,
            areaLoading: true,
        },()=>{
            const cityId = this.state.cityId;
            this.returnSelectValue({
                cityId,areaId:'',areas:'',
            });
            this.returnSelectValue('','areaId');
            if(areaList[cityId]!==undefined){
                const area = areaList[cityId];
                console.log('---------???');
                this.setState({
                    areaLoading: false,
                    areas: [{areaId:'',areaName:'请选择'},...area]
                })
                return;
            }
            this.getAreaList(cityId);
            console.log('---------???');
        //     axios.get(
        //         `https://api.clife.cn/v1/web/env/provincialCascade/area?cityId=${cityId}`,
        //     ).then((res) => {
        //         console.log(res,'area 区县 data list');
        //         const { data:{code,data:dataList} } = res || {};
        //         console.log(dataList,'选中城市的区县列表');
        //         // 过滤下无用的冗余字段太多
        //         const area = dataList.map(data=>({
        //             areaId: data.areaId,
        //             areaName: data.areaName,
        //         }));
        //         areaList[cityId] = area;
        //         console.log(areaList,'-----areaList-区县------');

        //         setTimeout(()=>{
        //             this.setState({
        //                 areaLoading: false,
        //                 areas: [{areaId:'',areaName:'请选择'},...area]
        //             })
        //         },2000)
        //     }).catch(function (error) {
        //         console.log(error);
        //         message.info('区县信息请求失败，请稍后重试！');
        //     });
        });
    }
    handleAreaChange = value =>{
        this.setState({
            areaId: value,
        },()=>{
            this.returnSelectValue(this.state.areaId,'areaId');
        });
    }
    returnSelectValue(state){
         this.props.changeSelect && this.props.changeSelect(state);
    }
    render() {
        const { provinces,cities,areas } = this.state;
        return (
            <HashRouter basename='manage' >
                <main className='main' ref={this.main}>
                    <Select
                        defaultValue={''}
                        value={this.state.provinceId}
                        style={{ width: 120 }}
                        loading={this.state.provinceLoading}
                        disabled={this.state.provinceLoading}
                        onChange={this.handleProvinceChange}
                    >
                        {Array.isArray(provinces)&&provinces.map(data => {
                            // console.log(data);
                           return (
                                <Option value={data.provinceId} key={data.provinceName}>
                                    {data.provinceName}
                                </Option>
                            )
                        })}
                    </Select>
                    <Select
                        style={{ width: 120 }}
                        value={this.state.cityId}
                        onChange={this.handleCityChange}
                        loading={this.state.cityLoading }
                        disabled={this.state.cityLoading || this.state.provinceLoading}
                    >
                        {cities.map(data => (
                            <Option value={data.cityId} key={data.cityName}>
                                {data.cityName}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: 120 }}
                        value={this.state.areaId}
                        onChange={this.handleAreaChange}
                        loading={this.state.areaLoading}
                        disabled={this.state.areaLoading || this.state.cityLoading}
                    >
                        {Array.isArray(areas) && areas.map(data => (
                            <Option value={data.areaId} key={data.areaName}>
                                {data.areaName}
                            </Option>
                        ))}
                    </Select>
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