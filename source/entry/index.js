
import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App/App.jsx';

// 监听热更新
if (module.hot) module.hot.accept();

ReactDOM.render(
    <App />, 
    document.getElementById('root')
);


