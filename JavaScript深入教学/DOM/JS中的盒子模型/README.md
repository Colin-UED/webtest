#JS中的盒子模型
    clientWidth;//获取元素的可见宽度。width+左右padding；
    clientHeight;//获取元素的可见高度。width+上下padding；
    clientLeft;//获取元素的左边框宽度
    clientTop;//获取元素的上边框高度；

    offsetWidth;//获取元素width+左右padding+左右border；
    offsetHeight;//获取元素的width+上下padding+上下border；
    offsetLeft;//获取元素距离父级参照物的左偏移量；
    offsetTop;//获取元素距离父级参照物的上偏移量；
    offsetParent;//获取元素的父级参照物/上级参照物（和parentNode区分开）

	window.onscroll;//随时的计算当前页面距离body顶部的偏移量(左上角)；
    scrollWidth;//获取元素实际内容的宽，在没有内容溢出的情况下和clientWidth一样，有内容的溢出，则是width+左padding；
    scrollHeight;//获取元素实际内容的宽，在没有内容溢出的情况下和clientWidth一样，有内容的溢出，则是width+左padding；
    scrollLeft;//横向滚动条卷去的高度，这是一个可读写的属性；设置scrollLeft=0；就回到了页面横向第一屏最上边；
    scrollTop;//纵向滚动条卷去的高度，这是一个可读写的属性；设置scrollTop=0；就回到了页面纵向第一屏最上边；

JS没有直接获取margin值的属性；

**getComputedStyle的兼容性写法**：
>     function getCss(element,value){
        if(window.getComputedStyle){
            return getComputedStyle(element,null)[value];
        }else{
            return element.currentStyle[value];
        }
    }

上面if中window一定要加，因为这个getComputedStyle在IE下是undefined。如果不加window是直接提示报错的；所以要加window;这样就不是把它作为变量，而是作为window的属性；

if的条件判断也可以变相转化为：

if(typeof getComputedStyle==”function”)

用的时候可以像下面这么用；

alert(getCSS(ele,"fontSize"));

getComputerStyle第二种写法
>     function getCss2(element,value){
        try{
            return getComputedStyle(element,null)[value];
        }else{
            return element.currentStyle[value];
        }
    }

**jQuery中的盒子模型**:

    $("div").height();//内容的高
    $("div").innerHeight();//相当于clientHeight；
    $("div").outerHeight();//相当于offsetHeight；
    $("div").outerHeight(true);//相当于offsetHeight+上下margin；

**CSS伪类样式**：
>     <style>
        #p1{height: 2em;line-height: 2em;}
        /*CSS中设置伪类的方法*/
        #p1:before{
            /*里面【:】【::】是一样的，现在的规范是写两个冒号的，但是写一个冒号也支持；*/
            content: "我是用CSS添加在P1前面的";
            color: #ff0000;
            background: orange;
            clear: both;
        }
        #p1::after{
            content: "我是用CSS添加在P1后的";
            color: green;
            background: orange;
            clear: both;
        }
    </style>
> `<body><p id="p1">蚊子蚊子蚊子</p></body>`

>     /*JS中获取伪类的方法*/
    var ele=document.getElementById("p1");
    var strColor=window.getComputedStyle(ele,"bdfor").color;
    var fontSize=window.getComputedStyle(ele,"bdfor").fontSize;
    console.log(strColor);
    console.log(fontSize);

**计算任意DOM元素距离文档的左或上的绝对偏移**
>         function offset(ele){//计算任意DOM元素距离文档的左或上的绝对偏移
            var l=ele.offsetLeft;
            var t=ele.offsetTop;
            var p=ele.offsetParent;
            while(p){
                if(window.navigator.userAgent.indexOf("MISE 8")>-1){//判断IE8的方法
                    l+= p.offsetLeft;
                    t+= p.offsetTop;
                }else{
                    l+= p.offsetLeft+ p.clientLeft;
                    t+= p.offsetTop+ p.clientTop;
                }
                p= p.offsetParent;
            }
            return {left:l,top:t}
        }



-固定宽度出现滚动条；

>         #div1{
            width: 200px;
            height: 200px;
            background: orange;
            overflow: auto;//固定高宽，出现滚动条的意思；
        } 

滚动条的最大值是
>     ele.scrollHeight-ele.clientHeight;