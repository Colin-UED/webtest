---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2014-02-27
---

Ajax指的是不刷新页面，发出异步请求，向服务器端要求数据，然后再进行处理的方法。

## XMLHttpRequest对象

XMLHttpRequest对象用于从JavaScript发出HTTP请求，下面是典型用法。

{% highlight javascript %}

// 新建一个XMLHttpRequest实例对象
var xhr = new XMLHttpRequest();

// 指定通信过程中状态改变时的回调函数
xhr.onreadystatechange = function(){

	// 通信成功时，状态值为4
    var completed = 4;
    if(xhr.readyState === completed){
        if(xhr.status === 200){
            // 处理服务器发送过来的数据
        }else{
            // 处理错误
        }
    }
};

// open方式用于指定HTTP动词、请求的网址、是否异步
xhr.open('GET', '/endpoint', true);

// 发送HTTP请求
xhr.send(null);

{% endhighlight %}

### Open()

open方法用于指定发送HTTP请求的参数，它有三个参数如下：

- 发送方法，一般来说为“GET”、“POST”、“PUT”和“DELETE”中的一个值。
- 网址。
- 是否异步，true表示异步，false表示同步。

下面发送POST请求的例子。

```javascript

xhr.open('POST', encodeURI('someURL'));
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {};
xhr.send(encodeURI('dataString'));

```

上面方法中，open方法向指定URL发出POST请求，send方法送出实际的数据。

### setRequestHeader()

setRequestHeader方法用于设置HTTP请求的头信息。

### send()

send方法用于实际发出HTTP请求。如果不带参数，就表示HTTP请求只包含头信息，也就是只有一个URL，典型例子就是GET请求；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是POST请求。

在XHR 2之中，send方法可以发送许多类型的数据。

{% highlight javascript %}

void send();
void send(ArrayBuffer data);
void send(Blob data);
void send(Document data);
void send(DOMString data);
void send(FormData data);

{% endhighlight %}

Blob类型可以用来发送二进制数据，这使得通过Ajax上传文件成为可能。

FormData类型可以用于构造表单数据。

{% highlight javascript %}

var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

xhr.send(formData);

{% endhighlight %}

上面的代码构造了一个formData对象，然后使用send方法发送。它的效果与点击下面表单的submit按钮是一样的。

{% highlight html %}

<form id='registration' name='registration' action='/register'>
    <input type='text' name='username' value='张三'>
    <input type='email' name='email' value='zhangsan@example.com'>
    <input type='number' name='birthDate' value='1940'>
    <input type='submit' onclick='return sendForm(this.form);'>
</form>

{% endhighlight %}

FormData对象还可以对现有表单添加数据，这为我们操作表单提供了极大的灵活性。

{% highlight javascript %}

function sendForm(form) {
    var formData = new FormData(form);
    formData.append('csrf', 'e69a18d7db1286040586e6da1950128c');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.onload = function(e) {
        // ...
    };
    xhr.send(formData);

    return false; 
}

var form = document.querySelector('#registration');
sendForm(form);

{% endhighlight %}

FormData对象也能用来模拟File控件，进行文件上传。

{% highlight javascript %}

function uploadFiles(url, files) {
  var formData = new FormData();

  for (var i = 0, file; file = files[i]; ++i) {
    formData.append(file.name, file);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function(e) { ... };

  xhr.send(formData);  // multipart/form-data
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  uploadFiles('/server', this.files);
}, false);

{% endhighlight %}

### readyState属性和readyStateChange事件

在通信过程中，每当发生状态变化的时候，readyState属性的值就会发生改变。

这个值每一次变化，都会触发readyStateChange事件。我们可以指定这个事件的回调函数，对不同状态进行不同处理。尤其是当状态变为4的时候，表示通信成功，这时回调函数就可以处理服务器传送回来的数据。

### progress事件

上传文件时，XMLHTTPRequest对象的upload属性有一个progress，会不断返回上传的进度。

假定网页上有一个progress元素。

{% highlight javascript %}

<progress min="0" max="100" value="0">0% complete</progress>

{% endhighlight %}

文件上传时，对upload属性指定progress事件回调函数，即可获得上传的进度。

{% highlight javascript %}

function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  // Listen to the upload progress.
  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
    }
  };

  xhr.send(blobOrFile);
}

upload(new Blob(['hello world'], {type: 'text/plain'}));

{% endhighlight %}

下面是一个上传ArrayBuffer对象的例子。

{% highlight javascript %}

function sendArrayBuffer() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  var uInt8Array = new Uint8Array([1, 2, 3]);

  xhr.send(uInt8Array.buffer);
}

{% endhighlight %}

### 服务器返回的信息

（1）status属性

status属性表示返回的HTTP状态码。一般来说，如果通信成功的话，这个状态码是200。

（2）responseText属性

responseText属性表示服务器返回的文本数据。

### setRequestHeader方法

setRequestHeader方法用于设置HTTP头信息。

{% highlight javascript %}

xhr.setRequestHeader('Content-Type', 'application/json');

xhr.setRequestHeader('Content-Length', JSON.stringify(data).length);

xhr.send(JSON.stringify(data));

{% endhighlight %}

上面代码首先设置头信息Content-Type，表示发送JSON格式的数据；然后设置Content-Length，表示数据长度；最后发送JSON数据。

### overrideMimeType方法

该方法用来指定服务器返回数据的MIME类型。

传统上，如果希望从服务器取回二进制数据，就要使用这个方法，人为将数据类型伪装成文本数据。

{% highlight javascript %}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);

// 强制将MIME改为文本类型
xhr.overrideMimeType('text/plain; charset=x-user-defined');

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var binStr = this.responseText;
    for (var i = 0, len = binStr.length; i < len; ++i) {
      var c = binStr.charCodeAt(i);
      var byte = c & 0xff;  // 去除高位字节，留下低位字节
    }
  }
};

xhr.send();

{% endhighlight %}

上面代码中，因为传回来的是二进制数据，首先用xhr.overrideMimeType方法强制改变它的MIME类型，伪装成文本数据。字符集必需指定为“x-user-defined”，如果是其他字符集，浏览器内部会强制转码，将其保存成UTF-16的形式。字符集“x-user-defined”其实也会发生转码，浏览器会在每个字节前面再加上一个字节（0xF700-0xF7ff），因此后面要对每个字符进行一次与运算（&），将高位的8个位去除，只留下低位的8个位，由此逐一读出原文件二进制数据的每个字节。

这种方法很麻烦，在XMLHttpRequest版本升级以后，一般采用下面的指定responseType的方法。

### responseType属性

XMLHttpRequest对象有一个responseType属性，用来指定服务器返回数据（xhr.response）的类型。

XHR 2允许用户自行设置这个属性，也就是指定返回数据的类型，可以设置如下的值：

- 'text'：返回类型为字符串，这是默认值。
- 'arraybuffer'：返回类型为ArrayBuffer。
- 'blob'：返回类型为Blob。
- 'document'：返回类型为Document。
- 'json'：返回类型为JSON object。

text类型适合大多数情况，而且直接处理文本也比较方便，document类型适合返回XML文档的情况，blob类型适合读取二进制数据，比如图片文件。

{% highlight javascript %}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = new Blob([this.response], {type: 'image/png'});
    // ...
  }
};

xhr.send();

{% endhighlight %}

如果将这个属性设为ArrayBuffer，就可以按照数组的方式处理二进制数据。

{% highlight javascript %}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  for (var i = 0, len = binStr.length; i < len; ++i) {
	// var byte = uInt8Array[i]; 
  }
};

xhr.send();

{% endhighlight %}

如果将这个属性设为“json”，支持JSON的浏览器（Firefox>9，chrome>30），就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而是一个JSON对象。

XHR2支持Ajax的返回类型为文档，即xhr.responseType="document" 。这意味着，对于那些打开CORS的网站，我们可以直接用Ajax抓取网页，然后不用解析HTML字符串，直接对XHR回应进行DOM操作。

## 文件上传

通常，我们使用file控件实现文件上传。

{% highlight html %}

<form id="file-form" action="handler.php" method="POST">
  <input type="file" id="file-select" name="photos[]" multiple/>
  <button type="submit" id="upload-button">上传</button>
</form>

{% endhighlight %}

上面HTML代码中，file控件的multiple属性，指定可以一次选择多个文件；如果没有这个属性，则一次只能选择一个文件。

file对象的files属性，返回一个FileList对象，包含了用户选中的文件。

{% highlight javascript %}

var fileSelect = document.getElementById('file-select');
var files = fileSelect.files;

{% endhighlight %}

然后，新建一个FormData对象的实例，用来模拟发送到服务器的表单数据，把选中的文件添加到这个对象上面。

{% highlight javascript %}

var formData = new FormData();

for (var i = 0; i < files.length; i++) {
  var file = files[i];

  if (!file.type.match('image.*')) {
    continue;
  }

  formData.append('photos[]', file, file.name);
}

{% endhighlight %}

上面代码中的FormData对象的append方法，除了可以添加文件，还可以添加二进制对象（Blob）或者字符串。

{% highlight javascript %}

// Files
formData.append(name, file, filename);

// Blobs
formData.append(name, blob, filename);

// Strings
formData.append(name, value);    

{% endhighlight %}

append方法的第一个参数是表单的控件名，第二个参数是实际的值，第三个参数是可选的，通常是文件名。

最后，使用Ajax方法向服务器上传文件。

{% highlight javascript %}

var xhr = new XMLHttpRequest();

xhr.open('POST', 'handler.php', true);

xhr.onload = function () {
  if (xhr.status !== 200) {
    alert('An error occurred!');
  }
};

xhr.send(formData);

{% endhighlight %}

目前，各大浏览器（包括IE 10）都支持Ajax上传文件。

除了使用FormData接口上传，也可以直接使用File API上传。

```javascript

var file = document.getElementById('test-input').files[0];
var xhr = new XMLHttpRequest();

xhr.open('POST', 'myserver/uploads');
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);

```

可以看到，上面这种写法比FormData的写法，要简单很多。

## JSONP

JSONP是一种常见做法，用于服务器与客户端之间的数据传输，主要为了规避浏览器的同域限制。因为Ajax只能向当前网页所在的域名发出HTTP请求（除非使用下文要提到的CORS，但并不是所有服务器都支持CORS），所以JSONP就采用在网页中动态插入script元素的做法，向服务器请求脚本文件。

{% highlight javascript %}

function addScriptTag(src){
	var script = document.createElement('script');
	script.setAttribute("type","text/javascript");
	script.src = src;
	document.body.appendChild(script);
}

window.onload = function(){
	addScriptTag("http://example.com/ip?callback=foo");
}

function foo(data) {
    console.log('Your public IP address is: ' + data.ip);
};

{% endhighlight %}

上面代码使用了JSONP，运行以后当前网页就可以直接处理example.com返回的数据了。

由于script元素返回的脚本文件，是直接作为代码运行的，不像Ajax请求返回的是JSON字符串，需要用JSON.parse方法将字符串转为JSON对象。于是，为了方便起见，许多服务器支持JSONP指定回调函数的名称，直接将JSON数据放入回调函数的参数，如此一来就省略了将字符串解析为JSON对象的步骤。

请看下面的例子，假定访问 http://example.com/ip ，返回如下JSON数据：

{% highlight javascript %}

{"ip":"8.8.8.8"}

{% endhighlight %}

现在服务器允许客户端请求时使用callback参数指定回调函数。访问 http://example.com/ip?callback=foo ，返回的数据变成：

{% highlight javascript %}

foo({"ip":"8.8.8.8"})

{% endhighlight %}

这时，如果客户端定义了foo函数，该函数就会被立即调用，而作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。

{% highlight javascript %}

function foo(data) {
    console.log('Your public IP address is: ' + data.ip);
};

{% endhighlight %}

jQuery的getJSON方法就是JSONP的一个应用。

```javascript

$.getJSON( "http://example.com/api", function (data){ .... })

```

$.getJSON方法的第一个参数是服务器网址，第二个参数是回调函数，该回调函数的参数就是服务器返回的JSON数据。

## CORS

CORS的全称是“跨域资源共享”（Cross-origin resource sharing），它提出一种方法，允许JavaScript代码向另一个域名发出XMLHttpRequests请求，从而克服了传统上Ajax只能在同一个域名下使用的限制（same origin security policy）。

所有主流浏览器都支持该方法，不过IE8和IE9的该方法不是部署在XMLHttpRequest对象，而是部署在XDomainRequest对象。检查浏览器是否支持的代码如下：

{% highlight javascript %}

var request = new XMLHttpRequest();

if("withCredentials" in request) {
  // 发出跨域请求
}

{% endhighlight %}

CORS的原理其实很简单，就是增加一条HTTP头信息的查询，询问服务器端，当前请求的域名是否在许可名单之中，以及可以使用哪些HTTP动词。如果得到肯定的答复，就发出XMLHttpRequest请求。这种机制叫做“预检”（preflight）。

“预检”的专用HTTP头信息是Origin。假定用户正在浏览来自www.example.com的网页，该网页需要向Google请求数据，这时浏览器会向该域名询问是否同意跨域请求，发出的HTTP头信息如下：

{% highlight http %}

OPTIONS /resources/post-here/ HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Origin: http://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER

{% endhighlight %}

上面的HTTP请求，它的动词是OPTIONS，表示这是一个“预检”请求。除了提供浏览器信息，里面关键的一行是Origin头信息。

```http

Origin: http://www.example.com

```

这行HTTP头信息表示，请求来自www.example.com。服务端如果同意，就返回一个Access-Control-Allow-Origin头信息。

预检请求中，浏览器还告诉服务器，实际发出请求，将使用HTTP动词POST，以及一个自定义的头信息X-PINGOTHER。

```http

Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER

```

服务器收到预检请求之后，做出了回应。

```http

HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER
Access-Control-Max-Age: 1728000
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain

```

上面的HTTP回应里面，关键的是Access-Control-Allow-Origin头信息。这表示服务器同意www.example.com的跨域请求。

{% highlight http %}

Access-Control-Allow-Origin: http://www.example.com

{% endhighlight %}

如果不同意，服务器端会返回一个错误。

如果服务器端对所有网站都开放，可以返回一个星号（*）通配符。

{% highlight http %}

Access-Control-Allow-Origin: *

{% endhighlight %}

服务器还告诉浏览器，允许的HTTP动词是POST、GET、OPTIONS，也允许自定义的头信息X-PINGOTHER，

```http

Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER
Access-Control-Max-Age: 1728000

```

如果服务器通过了预检请求，则以后每次浏览器正常的HTTP请求，都会有一个origin头信息；服务器的回应，也都会有一个Access-Control-Allow-Origin头信息。Access-Control-Max-Age头信息表示，允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

由于整个过程都是浏览器自动后台完成，不用用户参与，所以对于开发者来说，使用Ajax跨域请求与同域请求没有区别，代码完全一样。但是，这需要服务器的支持，所以在使用CORS之前，要查看一下所请求的网站是否支持。

CORS机制默认不发送cookie和HTTP认证信息，除非在Ajax请求中打开withCredentials属性。

{% highlight javascript %}

var request = new XMLHttpRequest();
request.withCredentials = true;

{% endhighlight %}

同时，服务器返回HTTP头信息时，也必须打开Access-Control-Allow-Credentials选项。否则，浏览器会忽略服务器返回的回应。

{% highlight http %}

Access-Control-Allow-Credentials: true

{% endhighlight %}

需要注意的是，此时Access-Control-Allow-Origin不能指定为星号，必须指定明确的、与请求网页一致的域名。同时，cookie依然遵循同源政策，只有用服务器域名（前例是www.google.com）设置的cookie才会上传，其他域名下的cookie并不会上传，且网页代码中的document.cookie也无法读取www.google.com域名下的cookie。

CORS机制与JSONP模式的使用目的相同，而且更强大。JSONP只支持GET请求，CORS可以支持所有类型的HTTP请求。在发生错误的情况下，CORS可以得到更详细的错误信息，部署更有针对性的错误处理代码。JSONP的优势在于可以用于老式浏览器，以及可以向不支持CORS的网站请求数据。

## Fetch API

### 基本用法

Ajax操作所用的XMLHttpRequest对象，已经有十多年的历史，它的API设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。Fetch API是一种新规范，用来取代XMLHttpRequest对象。它主要有两个特点，一是简化接口，将API分散在几个不同的对象上，二是返回Promise对象，避免了嵌套的回调函数。

检查浏览器是否部署了这个API的代码如下。

```javascript

if (fetch in window){
  // 支持
} else {
  // 不支持
}

```

下面是一个XMLHttpRequest对象发出Ajax请求的常规例子。

```javascript

function reqListener() {
  var data = JSON.parse(this.responseText);
  console.log(data);
}

function reqError(err) {
  console.log('Fetch Error :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', './api/some.json', true);
oReq.send();

```

同样的操作用Fetch实现如下。

```javascript

fetch('./api/some.json')
  .then(function(response) {
      if (response.status !== 200) {
        console.log('请求失败，状态码：' + response.status);
        return;
      }
      response.json().then(function(data) {
        console.log(data);
      });
  }).catch(function(err) {
    console.log('出错：', err);
  });

```

上面代码中，因为HTTP请求返回的response对象是一个Stream对象，使用json方法转为JSON格式，但是json方法返回的是一个Promise对象。

fetch函数的第一个参数可以是URL字符串，也可以是后文要讲到的Request对象实例。

response对象还有一个ok属性，如果返回的状态码在200到299之间（即请求成功），这个属性为true，否则为false。因此，上面的代码可以写成下面这样。

```javascript
fetch("./api/some.json").then(function(response) {
  if (response.ok) {
    response.json().then(function(data) {
      console.log(data);
    });
  } else {
    console.log("请求失败，状态码为", response.status);
  }
}, function(err) {
  console.log("出错：", err);
});
```

response对象除了json方法，还包含了HTTP回应的元数据。

```javascript

fetch('users.json').then(function(response) {
  console.log(response.headers.get('Content-Type'));
  console.log(response.headers.get('Date'));

  console.log(response.status);
  console.log(response.statusText);
  console.log(response.type);
  console.log(response.url);
});

```

上面代码中，response对象有很多属性，其中的type属性比较特别，表示HTTP回应的类型，它有以下三个值。

- basic：正常的同域请求
- cors：CORS机制下的跨域请求
- opaque：非CORS机制下的跨域请求，这时无法读取返回的数据，也无法判断是否请求成功

如果需要在CORS机制下发出跨域请求，需要指明状态。

```javascript

fetch('http://some-site.com/cors-enabled/some.json', {mode: 'cors'})  
  .then(function(response) {  
    return response.text();  
  })  
  .then(function(text) {  
    console.log('Request successful', text);  
  })  
  .catch(function(error) {  
    log('Request failed', error)  
  });

```

除了指定模式，fetch方法的第二个参数还可以用来配置其他值，比如指定cookie连同HTTP请求一起发出。

```javascript

fetch(url, {
  credentials: 'include'
})

```

发出POST请求的写法如下。

```javascript

fetch("http://www.example.org/submit.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: "firstName=Nikhil&favColor=blue&password=easytoguess"
}).then(function(res) {
  if (res.ok) {
    console.log("Perfect! Your settings are saved.");
  } else if (res.status == 401) {
    console.log("Oops! You are not authorized.");
  }
}, function(e) {
  console.log("Error submitting form!");
});

```

目前，还有一些XMLHttpRequest对象可以做到，但是Fetch API还没做到的地方，比如中途中断HTTP请求，以及获取HTTP请求的进度。这些不足与Fetch返回的是Promise对象有关。

### Headers

Fetch API引入三个新的对象（也是构造函数）：Headers, Request 和 Response。其中，Headers对象用来构造/读取HTTP数据包的头信息。

```javascript
var content = "Hello World";
var reqHeaders = new Headers();
reqHeaders.append("Content-Type", "text/plain");
reqHeaders.append("Content-Length", content.length.toString());
reqHeaders.append("X-Custom-Header", "ProcessThisImmediately");
```

Headers对象的实例，除了使用append方法添加属性，也可以直接通过构造函数一次性生成。

```javascript
reqHeaders = new Headers({
  "Content-Type": "text/plain",
  "Content-Length": content.length.toString(),
  "X-Custom-Header": "ProcessThisImmediately",
});
```

Headers对象实例还提供了一些工具方法。

```javascript
reqHeaders.has("Content-Type") // true
reqHeaders.has("Set-Cookie") // false
reqHeaders.set("Content-Type", "text/html")
reqHeaders.append("X-Custom-Header", "AnotherValue")

reqHeaders.get("Content-Length") // 11
reqHeaders.getAll("X-Custom-Header") // ["ProcessThisImmediately", "AnotherValue"]

reqHeaders.delete("X-Custom-Header")
reqHeaders.getAll("X-Custom-Header") // []
```

### Request

Request对象用来构造HTTP请求。

```javascript
var req = new Request("/index.html");
req.method // "GET"
req.url // "http://example.com/index.html"
```

Request对象实例的非url属性，只能通过Request构造函数的第二个参数进行设置。

```javascript
var uploadReq = new Request("/uploadImage", {
  method: "POST",
  headers: {
    "Content-Type": "image/png",
  },
  body: "image data"
});
```

Request对象实例有两个属性是只读的，不能手动设置。一个是referrer属性，表示请求的来源，由浏览器设置，有可能是空字符串。另一个是context属性，表示请求发出的上下文，如果是image，表示是从img标签发出，如果是worker，表示是从worker脚本发出，如果是fetch，表示是从fetch函数发出的。

Request对象实例的mode属性，用来设置是否跨域，合法的值有以下三种：same-origin、no-cors（默认值）、cors。当设置为same-origin时，只能向同域的URL发出请求，否则会报错。

```javascript
var arbitraryUrl = document.getElementById("url-input").value;
fetch(arbitraryUrl, { mode: "same-origin" }).then(function(res) {
  console.log("Response succeeded?", res.ok);
}, function(e) {
  console.log("Please enter a same-origin URL!");
});
```

上面代码中，如果用户输入的URL不是同域的，将会报错，否则就会发出请求。

如果mode属性为no-cors，就与默认的浏览器行为没有不同，类似script标签加载外部脚本文件、img标签加载外部图片。如果mode属性为cors，就可以向部署了CORS机制的服务器，发出跨域请求。

```javascript
var u = new URLSearchParams();
u.append('method', 'flickr.interestingness.getList');
u.append('api_key', '<insert api key here>');
u.append('format', 'json');
u.append('nojsoncallback', '1');

var apiCall = fetch('https://api.flickr.com/services/rest?' + u);

apiCall.then(function(response) {
  return response.json().then(function(json) {
    // photo is a list of photos.
    return json.photos.photo;
  });
}).then(function(photos) {
  photos.forEach(function(photo) {
    console.log(photo.title);
  });
});
```

上面代码是向Flickr API发出图片请求的例子。

### Response

fetch方法返回Response对象实例，它有以下属性。

- status：整数值，表示状态码（比如200）
- statusText：字符串，表示状态信息，默认是“OK”
- ok：布尔值，表示状态码是否在200-299的范围内
- headers：Headers对象，表示HTTP回应的头信息
- url：字符串，表示HTTP请求的网址
- type：字符串，合法的值有五个basic、cors、default、error、opaque。basic表示正常的同域请求；cors表示CORS机制的跨域请求；error表示网络出错，无法取得信息，status属性为0，headers属性为空，并且导致fetch函数返回Promise对象被拒绝；opaque表示非CORS机制的跨域请求，受到严格限制。

Response对象还有两个静态方法。

- Response.error() 返回一个type属性为error的Response对象实例
- Response.redirect(url, status) 返回的Response对象实例会重定向到另一个URL

### body属性

Request对象和Response对象都有body属性，表示请求的内容。body属性可能是以下的数据类型。

- ArrayBuffer
- ArrayBufferView (Uint8Array等)
- Blob/File
- string
- URLSearchParams
- FormData

```javascript
var form = new FormData(document.getElementById('login-form'));
fetch("/login", {
  method: "POST",
  body: form
})
```

上面代码中，Request对象的body属性为表单数据。

Request对象和Response对象都提供以下方法，用来读取body。

- arrayBuffer()
- blob()
- json()
- text()
- formData()

注意，上面这些方法都只能使用一次，第二次使用就会报错，也就是说，body属性只能读取一次。Request对象和Response对象都有bodyUsed属性，返回一个布尔值，表示body是否被读取过。

```javascript
var res = new Response("one time use");
console.log(res.bodyUsed); // false
res.text().then(function(v) {
  console.log(res.bodyUsed); // true
});
console.log(res.bodyUsed); // true

res.text().catch(function(e) {
  console.log("Tried to read already consumed Response");
});
```

上面代码中，第二次通过text方法读取Response对象实例的body时，就会报错。

这是因为body属性是一个stream对象，数据只能单向传送一次。这样的设计是为了允许JavaScript处理视频、音频这样的大型文件。

如果希望多次使用body属性，可以使用Response对象和Request对象的clone方法。它必须在body还没有读取前调用，返回一个前的body，也就是说，需要使用几次body，就要调用几次clone方法。

```javascript
addEventListener('fetch', function(evt) {
  var sheep = new Response("Dolly");
  console.log(sheep.bodyUsed); // false
  var clone = sheep.clone();
  console.log(clone.bodyUsed); // false

  clone.text();
  console.log(sheep.bodyUsed); // false
  console.log(clone.bodyUsed); // true

  evt.respondWith(cache.add(sheep.clone()).then(function(e) {
    return sheep;
  });
});
```

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
- Eric Bidelman, [New Tricks in XMLHttpRequest2](http://www.html5rocks.com/en/tutorials/file/xhr2/)
- Matt West, [Uploading Files with AJAX](http://blog.teamtreehouse.com/uploading-files-ajax)
- Monsur Hossain, [Using CORS](http://www.html5rocks.com/en/tutorials/cors/)
- MDN, [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
- Matt Gaunt, [Introduction to fetch()](http://updates.html5rocks.com/2015/03/introduction-to-fetch)
- Nikhil Marathe, [This API is so Fetching!](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)
