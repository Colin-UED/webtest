(function($){
    $.extend({
        tabChange:function(con){
            var num=0;
            var i=num;
            var $container=$(".index_b_hero"),
                $imgs=$container.find("li.hero"),
                $leftBtn=$container.find("a.prev"),
                $rightBtn=$container.find("a.next");

            //设置默认CSS
            $imgs.css("left","-1200px");
            $imgs.eq(i).css("left",0).end().eq(i+1).css("left","1200px");
            $(".small_list li").click(function(){
                sildeJump($(this).index());
            });
            //跳到当前的索引；
            function sildeJump(flagNum){
                if(flagNum>=6){
                    $imgs.eq(6).css("left","0px");
                    $imgs.eq(0).css("left","1200px");
                }else{
                    if(flagNum==0){
                        $imgs.eq(0).css("left","0px");
                        $imgs.eq(1).css("left","1200px");
                        $imgs.eq(2).css("left","3600px");
                        $imgs.eq(3).css("left","3600px");
                        $imgs.eq(4).css("left","-3600px");
                        $imgs.eq(5).css("left","-3600px");
                        $imgs.eq(6).css("left","-1200px");
                    }else{
                        for(var i=flagNum;i>=0;i--){
                            var leftPx=(i-flagNum)*1200;
                            $imgs.eq(i).css("left",leftPx+"px");
                        }
                        for(var j=flagNum+1;j<=6;j++){
                            var rightPx=(j-flagNum)*1200;
                            $imgs.eq(j).css("left",rightPx+"px");
                        }
                    }
                }
                num=i=flagNum;
                tabLiChange(flagNum);
            }
            //LI的样式
            function tabLiChange(flagNum){
                var length=$(".small_list li").length;
                for(var i= 0;i<length;i++){
                    $("#" + i).parent().removeClass("on");
                }
                $("#" + flagNum).parent().addClass("on");
            }

            //左右按钮的事件
            $leftBtn.click(function(){
                if(num<=0){
                    num=0;
                    sildeJump(6);
                    return;
                }
                sildeJump(num-1);
            });
            $rightBtn.click(function(){
                if(num>=6){
                    num=0;
                    sildeJump(0);
                    return;
                }
                sildeJump(num+1);
            });
        }
    });
    $.tabChange()

}(jQuery));