#innerText、innerHTML和outerHTML

测试如下：
>     <div id="div1">DIV的文字内容,<a href="javascript:;">A标签的文字内容</a></div>

>     var oDiv=document.getElementById("div1");
    var a=oDiv.innerText;
    var a2=oDiv.outerText;
    var b=oDiv.innerHTML;
    var b2=oDiv.outerHTML;
    console.log(a);//DIV的文字内容,A标签的文字内容
    console.log(a2);//DIV的文字内容,A标签的文字内容
    console.log(b);//DIV的文字内容,<a href="javascript:;">A标签的文字内容</a>
    console.log(b2);//<div id="div1">DIV的文字内容,<a href="javascript:;">A标签的文字内容</a></div>


- innerText 设置或获取位于对象起始和结束标签内的文本
- outerText 设置(包括标签)或获取(不包括标签)对象的文本
- innerHTML 设置或获取位于对象起始和结束标签内的 HTML
- outerHTML 设置或获取对象及其内容的 HTML 形式
 
- innerText和outerText在获取时是相同效果，但在设置时，innerText仅设置标签内的文本，而outerText设置包括标签在内的文本。

**innerHTML和outerHTML、innerText与outerText的不同之处在于：**

- innerHTML与outerHTML在设置对象的内容时按照HTML来解析；包含的HTML会被解析成代码，而innerText与outerText按照纯文本来解析； 
- 在设置时，innerHTML与innerText仅设置标签内的文本，而outerHTML与outerText设置包括标签在内的文本。    

innerHTML是IE提出来的，浏览器都是支持的，除了火狐外；innerHTML并不是W3C的标准，而textContent才是W3C的标准API。

innerText和textContent的主要区别如下:


- textContent可以获取所有元素的内容；包括script和style，但innerText不能获取这两个标签的内容。
- innertText可以感知样式，不会返回隐藏元素的文本内容，但是textContent可以返回；
- 因为innerText感知样式，因此会触发重排(reflow),而textContent不会；

新web application应该避免使用innerText等M$专有的API,IE9及以上也支持textContent。


innerHTML


就像名字的含义一样，textContent返回元素及其后代的文本内容,
而innerHTML则返回HTML,如果仅仅需要文本就不应该使用innerHTML,textContent不只是更有效率，而且可以避免XSS(Cross-site scripting)攻击。

> 
>  
> 	function text(ele,str){//处理innerText和textContent的兼容性；
> 	if(ele&&ele.nodeType&&ele.nodeType==1){
> 		if(str===undefined){//如果str没有传，那么方法是获取元素的文本内容；
> 			if(typeof ele.textContent=='string')
> 				return ele.textContent;
> 			else
> 				return ele.innerText;
> 
> 		}else{//如果传了，就是添加文本内容
> 			if(str===null){
> 				alert('text方法参数错误,str为null！');
> 				return ;
> 			}else if(typeof str=='string'){
> 				if(typeof ele.textContent=='string') {
> 					ele.textContent += str;
> 				}else{
> 					ele.innerText+=str;
> 				}
> 			}else{
> 				alert('text方法的参数错误！')
> 			}
> 		}
> 	}else{
> 		alert('text方法的ele参数错误！')
> 	}
> 	}
