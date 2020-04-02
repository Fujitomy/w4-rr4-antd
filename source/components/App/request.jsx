import axios from 'axios';
import qs from 'qs';
import { Modal } from 'antd';

function handleRequest(res,callback){
    const { code,msg,data } = res || {};
    switch(code){
        case 0:
            typeof callback==='function' && callback(res);
            break;
        case 100010110:
            // Modal({ msg:'您还未登录，请重新登录！'});
            break;
        default:
            // Modal({ msg: data ? data: msg });
    }
}

export default function request(url,type='get',params,callback){
    type = (/^get$/i).test(type) ? `get` : `post`;
    const data = type === 'get' ? {params}:qs.stringify(params);
    return axios[type](`${url}?`,data).then(res => { 
        handleRequest(res,callback);
        console.log(res,'请求到的数据');
        return res.data;
    });
}