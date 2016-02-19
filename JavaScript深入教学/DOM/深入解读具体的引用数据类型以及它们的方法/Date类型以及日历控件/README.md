# Date类型及日历控件
Date事件函数的方法

>     new Date()//获取客户端当前的事件（标准的事件格式数据）
    getFullYear();//获取四位年
    getMonth();//获取月0-11代表1-12月；
    getDate();//获取日
    getDay();//获取星期0-6代表周日-周六
    getHours();//获取小时
    getMinutes();//获取分
    getSeconds();//获取秒
    getMilliseconds();//获取毫秒
    getTime();//获取距离1970年一月一日午夜的毫秒差；
其中get对应的有set；比如有getMinutes就会有setMinutes；如果传入的值超过59就会增加小时数；

如果是getUTCMinutes是获取UTC日期中的分钟数；

有一个特殊的事件组件方法；getTimezoneOffset()返回本地事件与UTC事件相差的分钟数；

例如美国东部标准事件返回300，在某地进入夏令时的情况下，这个值会有变化；