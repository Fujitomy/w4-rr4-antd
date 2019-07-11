/**
 * wabpack errors log 错误日志集合
 * 
 */


{
  

  `
  Reason: macOs线程池不够，估计cpu核数不够
  Method：改为开启所有线程，const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 }); 
  Logs:
  ArgumentError: HappyThreadPool requires a positive integer for its size , but got {0}
  
  `
}

