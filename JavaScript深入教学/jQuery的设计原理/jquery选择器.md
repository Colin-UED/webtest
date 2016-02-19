#jquery选择器是参照CSS选择器的;

- .aa div  表示class=aa中标签是div的子元素
- .aa:first 第一个class=aa的类名元素
- .aa:first-child 所有中作为长子的那个；last类似
- .aa+   表示class=aa的下一个弟弟； 相当于jquery的next()
- .aa~   表示class=aa的弟弟们；相当于jquery的nextAll()
- :eq()  当前索引数；如果里面写索引号，就选择的是那个索引书，从0开始
- $("li:not(:eq(4))") 排除第4个li
- $("li:not(.aa)") 排除class=aa的li
- animated 在执行动画的元素；

