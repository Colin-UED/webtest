//这里一定要用onload，不能用ready；因为要等图片下载好，才可以进行定位的；否则做不出来效果；
$(window).on("load",function(){
    waterfall();
    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    $(window).on("scroll",function(){
        if(scrollChange()){
            $.each(dataInt.data,function(key,value){//key是0,123这种索引；
                var $pin=$("<div>").addClass("pin").appendTo($("#main"));
                var $box=$("<div>").addClass("box").appendTo($pin);
                var $img=$("<img>").attr("src","./images/"+value.src).appendTo($box);
            })
            waterfall();
        }
    });

    function waterfall(){
        var $boxs = $( "#main>div" );
        var w = $boxs.eq( 0 ).outerWidth();
        var num = Math.floor( $( window ).width() / w );
        $( "#main" ).css({
            'width:' : w * num,
            'margin': '0 auto'
        });
        var arr=[];//用于存储 每列中的所有块框相加的高度。
        $boxs.each( function( index, value ){
            var h = $boxs.eq( index ).outerHeight();
            if( index < num ){
                arr.push(h);
            }else{
                var minH=Math.min.apply(null,arr);
                var minIndex= $.inArray(minH,arr);
                $(value).css({
                    "position":"absolute",
                    "top":minH+"px",
                    "left":minIndex*w+"px"
                });
                arr[minIndex]+=$(value).outerHeight();//增加这个盒子的高度；
            }
        });
    }
    function scrollChange(){
        var $lastBoxs = $("#main>div").last();
        var $lastH=$lastBoxs.offset().top+Math.floor($lastBoxs.outerHeight()/2);
        var $scrollTop=$(window).scrollTop();
        var $documentH=$(window).height();
        return ($lastH<$scrollTop+$documentH)?true:false;

    }
})