import axios from 'axios';
import qs from 'qs';
import *as $ from 'jquery';
import reqwest from "reqwest";

function getAccessToken(userId){
    console.log(userId,'userId获取token');
   
    axios.get('http://www.mocky.io/v2/5dd4ddb52f000072c3d4fc832121?mocky-delay=5000ms')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            // console.log(res.data,'----response--------',data);
            if(code===0 && data){
                console.log(data.token,'data.token')
                g.next({
                    token: data.token
                });
            }
        })
        .catch(function (error) {
            console.log('获取token失败:',JSON.stringify(error));
            g.next();
        });
}

function getAccessSign(token){
    console.log(token,'token获取签名------');
    axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            if(code===0 && data){
                console.log(data.sign,'签名');
                g.next({
                    sign: data.sign
                });
            }
        })
        .catch(function (error) {
            g.return('结束')
            console.log('获取sign签名失败:',error);
        });
}

function getUserInfo(token,sign){
    console.log(token,sign,'ttoken,signoken获取用户信息------');
    axios.get('http://www.mocky.io/v2/5dd4dffb2f00007100d4fc95')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            if(code===0 && data){
                console.log(data.sign,'签名');
                g.next({
                    sign: data.sign
                });
            }
        })
        .catch(function (error) {
            g.return('结束')
            console.log('获取用户信息失败或错误:',error);
        });
}


function getToken(userId){
    return axios.get(
            'http://www.mocky.io/v2/5dd65bfc3200005e00888974?mocky-delay=5000ms',
            {
                params: {
                    userId:userId||'Andy'
                }
            }
        )
        .then(function (res) {
            // debugger
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            console.log(res.data,'----response--------',data);
            if(code===0 && data){
                console.log(data.token,'data.token')
            }
            return data.token
        })
        .catch(function (error) {
            console.log('获取token失败:',JSON.stringify(error));
        });
    
}

function getSign(userId){
    return axios.get('http://www.mocky.io/v2/5dd4dd662f0000a7bed4fc7e')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            console.log(res.data,'----获取签名------',data);
            if(code===0 && data){
                console.log(data.sign,'data.sign')
            }
            // debugger
            return data.sign
        })
        // return 12210921
        .catch(function (error) {
            console.log('获取token失败:',JSON.stringify(error));
        });
    // return;
    // return;
}


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

function token(param){
    axios.get('http://www.mocky.io/v2/5dd4dffb2f00007100d4fc95')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            if(code===0 && data){
                console.log(data.sign,'签名');
                g.next({
                    sign: data.sign
                });
            }
        })
        .catch(function (error) {
            g.return('结束')
            console.log('获取用户信息失败或错误:',error);
        });
}

function login(username,self){
    console.log(username,'username获取用户登录信息------');
    axios.get('http://www.mocky.io/v2/5dd4dffb2f00007100d4fc95')
        .then((res)=> {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            if(code===0 && data){
                console.log(data,'用户登录信息');
                return data;
            }

        })
        .catch(function (error) {
            console.log('获取用户信息失败或错误:',error);
            return { msg:'登录失败' }
        });
}

function getIndexData(params){
    console.log(params,'params------');
    axios.get('http://www.mocky.io/v2/5dd4dffb2f00007100d4fc95')
        .then(function (res) {
            typeof res === 'string' ? JSON.parse(res):res;
            res.data = typeof res.data === 'string' ? JSON.parse(res.data):res.data;
            const { code,data } = res.data || {};
            if(code===0 && data){
                console.log(data,'签名');
                return data
            }
        })
        .catch(function (error) {
            console.log('获取用户信息失败或错误:',error);
            return { msg:'请求失败' }
        });
}

export { getAccessToken,getAccessSign,getUserInfo,getSign,getToken,login,getIndexData }