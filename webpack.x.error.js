/**
 * wabpack errors log 错误日志集合
 * 
 */


{
  
 1
  `
  ArgumentError: HappyThreadPool requires a positive integer for its size , but got {0}

  Reason: macOs线程池不够，估计cpu核数不够
  Method：改为开启所有线程，const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 }); 
  `
}

{
  2
  `
  Error: Command failed: open -a "Chrome" "http://localhost:8088"
  Unable to find application named 'Chrome'

  Reason：mac下chrome叫 Google Chrome 

  open-browser-webpack-plugin需要判断系统
  new OpenBrowserWebpackPlugin({
    browser: os.type()!=='Darwin' ?'Google Chrome':'Chrome',
    url: 'http://localhost:8088',
  }),

  `
}

