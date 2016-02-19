#一、jquery选择器
参考的是CSS选择器

- :first;第一个p $("p:first")
- :last；最后一个p $("p:last")
- :even 所有偶数tr $("tr:even")
- :odd 所有奇数tr $("tr:odd")
- :eq(3) 索引值
- :hidden 所有隐藏的p元素$("p:hidden")
- :visible 所有可见的表格 $("table:visible")
- --
- [attribute] 所有带有 href 属性的元素 $("[href]")
- [attribute=value] 所有 href 属性的值等于 "#" 的元素
- [attribute$=value] 所有 href 属性的值包含以 ".jpg" 结尾的元素$("[href$='.jpg']")
- :input 所有input元素  $(":input")
- :text 所有 type="text" 的input元素$(":text")
- :button
- :image所有 type="image" 的input元素$(":image")
- :file
- --
- :selected 所有被选取的 input 元素 $(":selected")
- :checked 所有被选中的 input 元素 $(":checked")
 
#二、jquery效果

- hide() 隐藏
- show() 显示
- toggle() 切换隐藏和显示
- -- 
- fadeIn() 淡入
- fadeOut() 淡出
- fadeToggle() 淡入淡出开关
- fadeTo() 允许渐变为给定的不透明度（值介于 0 与 1 之间）
- --
- slideDown() 向下滑动(展开效果)
- slideUp()	向上滑动（收起效果）
- slideToggle() 滑动开关
- animate()  必须使用 paddingLeft 而不是 padding-left;色彩动画并不包含在核心 jQuery 库中
- stop() 方法用于停止动画或效果，在它们完成之前。
- clearQueue()对被选元素移除所有排队的函数（仍未运行的）

#三、jquery属性

- addClass() 向匹配的元素添加指定的类名。
- removeClass() 从所有匹配的元素中删除全部或者指定的类。
- hasClass() 检查匹配的元素是否拥有指定的类。
- toggleClass() 从匹配的元素中添加或删除一个类。
- --
- attr() 设置或返回匹配元素的属性和值。
- html() 设置或返回匹配的元素集合中的 HTML 内容。
- val() 设置或返回匹配元素的值。

#四、jQuery CSS
- width()设置或返回匹配元素的宽度。
- height()设置或返回匹配元素的高度。
- css()设置或返回匹配元素的样式属性。
- position()返回第一个匹配元素相对于父元素的位置。
- offset()返回第一个匹配元素相对于文档的位置。
- offsetParent()返回最近的定位祖先元素。
- scrollTop()设置或返回匹配元素相对滚动条顶部的偏移。
- scrollLeft()设置或返回匹配元素相对滚动条左侧的偏移。

#四、jQuery 遍历
- children() 方法返回被选元素的所有直接子元素。该方法只会向下一级对 DOM 树进行遍历。
- find() 方法返回被选元素的后代元素，一路向下直到最后一个后代。
- --
- parent() 方法返回被选元素的直接父元素。
- parents() 方法返回被选元素的所有祖先元素，它一路向上直到文档的根元素 (<html>)。
- parentsUntil() 方法返回介于两个给定元素之间的所有祖先元素。
- --
- siblings() 返回被选元素的所有同胞元素。
- next() 返回被选元素的下一个同胞元素。
- nextAll() 返回被选元素的所有跟随的同胞元素。
- nextUntil() 介于两个给定参数之间的所有跟随的同胞元素。
- prev()
- prevAll()
- prevUntil()
- --
- first() 方法返回被选元素的首个元素。
- last() 方法返回被选元素的最后一个元素。
- eq() 方法返回被选元素中带有指定索引号的元素。索引号从 0 开始
- filter() 方法允许您规定一个标准。不匹配这个标准的元素会被从集合中删除，匹配的元素会被返回。
- not() 方法返回不匹配标准的所有元素。
- --
- .slice()将匹配元素集合缩减为指定范围的子集。
- .map()把当前匹配集合中的每个元素传递给函数，产生包含返回值的新 jQuery 对象。
- .each()对 jQuery 对象进行迭代，为每个匹配元素执行函数。
- .has()将匹配元素集合缩减为包含特定元素的后代的集合。
- .is()根据选择器检查当前匹配元素集合，如果存在至少一个匹配元素，则返回 true。
- add() 方法将元素添加到匹配元素的集合中。
- end() 方法结束当前链条中的最近的筛选操作，并将匹配元素集还原为之前的状态。

#jQuery DOM元素
- .get() 获得由选择器指定的 DOM 元素。
- .index()返回指定元素相对于其他指定元素的 index 位置。
- .size()返回被 jQuery 选择器匹配的元素的数量。
- .toArray()以数组的形式返回 jQuery 选择器匹配的元素。

#jQuery 数据
- .data()存储与匹配元素相关的任意数据。
- .removeData()移除之前存放的数据。
- jQuery.hasData()存储与匹配元素相关的任意数据。
- --
- .queue() 显示或操作匹配元素所执行函数的队列。
- .dequeue()从队列最前端移除一个队列函数，并执行它。
- .clearQueue()从队列中删除所有未运行的项目。

#jQuery 核心
- jQuery() 方法接受一个字符串，其中包含了用于匹配元素集合的 CSS 选择器。
	- jQuery(selector, [context])接受一个字符串，其中包含了用于匹配元素集合的 CSS 选择器：
	- jQuery(html,[ownerDocument])使用原始 HTML 的字符串来创建 DOM 元素：
	- jQuery( callback )绑定一个在 DOM 文档载入完成后执行的函数：



#JQuery 事件
- JQuery hover(over,out) 
- focus()当元素获得焦点时，发生 focus 事件。
- blur()当元素失去焦点时发生 blur 事件。
- which() 属性指示按了哪个键或按钮。
- keyup() 当按钮被松开时，发生 keyup 事件
- keydown

#jquery用法；
$.extend继承父类;并且自己有的东西，可以覆盖父类的；

	(function($) {
	    $.extend({
	        zhuanbang: function(con){
	            //主体函数
	        }
	    });
	    $.zhuanbang({
	        direction: "left"
	    })
	}(jQuery));
