import axios from 'axios';
import qs from 'qs';
import *as $ from 'jquery';
import reqwest from "reqwest";

function handleRequest(url,type='GET',param,resolve,reject){
    if(type === 'GET'){
        url += `?${param ?new URLSearchParams(param).toString():''}&_t=${+new Date()}`
    }
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200)
        {
            console.log(xhr.responseText,'原生ajax请求');
            resolve(xhr.responseText);
        }else{
            reject({msg:'请求失败'});
        }
    }
    
    xhr.open(type,url,true);
    xhr.send();
}

function ajax(url,type,param){
    return new Promise((resolve,reject)=>{
        handleRequest(url,type,param,resolve,reject);
    }).then(data=>{
        console.log(data,'异步执行完成');
        return data
    });
}

export default ajax;