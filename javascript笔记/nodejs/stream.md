---
title: stream接口
layout: page
category: nodejs
date: 2014-10-23
modifiedOn: 2014-10-23
---

## 概念

Stream是Node.js为异步读写数据提供的统一接口。无论是硬盘数据、网络数据，还是内存数据，都可以采用这个接口读写。

读写数据有两种方式。一种方式是同步处理，即先将数据全部读入内存，然后处理。它的优点是符合直觉，流程非常自然，缺点是如果遇到大文件，要花很长时间，可能要过很久才能进入数据处理的步骤。另一种方式就是Stream方式，它是系统读取外部数据实际上的方式，即每次只读入数据的一小块，像“流水”一样。所以，Stream方式就是每当系统读入了一小块数据，就会触发一个事件，发出“新数据块”的信号，只要监听这个事件，就能掌握进展，做出相应处理，这样就提高了程序的性能。

Stream接口最大特点就是通过事件通信，具有readable、writable、drain、data、end、close等事件，既可以读取数据，也可以写入数据。读写数据时，每读入（或写入）一段数据，就会触发一次data事件，全部读取（或写入）完毕，触发end事件。如果发生错误，则触发error事件。

一个对象只要部署了Stream接口，就可以从读取数据，或者写入数据。Node内部很多涉及IO处理的对象，都部署了Stream接口，比如HTTP连接、文件读写、标准输入输出等。以下这些输入输出操作，提供的都是Stream接口。

- http responses, on the client
- http requests, on the server
- fs read streams
- zlib streams
- crypto streams
- tcp sockets
- child process stdout and stderr
- process.stdin

数据流通过pipe方法，可以方便地导向其他具有Stream接口的对象。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);
```

上面代码先打开文本文件wow.txt，然后压缩，再导向标准输出。

```javascript
fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('wow.gz'));
```

上面代码压缩文件wow.txt以后，又将其写回压缩文件。

下面代码新建一个Stream实例，然后指定写入事件和终止事件的回调函数，再将其接到标准输入之上。

```javascript
var stream = require('stream');
var Stream = stream.Stream;

var ws = new Stream;
ws.writable = true;

ws.write = function(data) {
  console.log("input=" + data);
}

ws.end = function(data) {
  console.log("bye");
}

process.stdin.pipe(ws);
```

调用上面的脚本，会产生以下结果。

```bash
$ node pipe_out.js
hello
input=hello
^d
bye
```

上面代码调用脚本下，键入hello，会输出`input=hello`。然后按下ctrl-d，会输出bye。使用管道命令，可以看得更清楚。

```bash
$ echo hello | node pipe_out.js
input=hello

bye
```

## 可读数据流

“可读数据流”表示数据的来源，只要一个对象提供“可读数据流”，就表示你可以从其中读取数据。

“可读数据流”有两种状态：流动态和暂停态。处于流动态时，数据会尽快地从数据源导向用户的程序；处于暂停态时，必须显式调用`stream.read()`等指令，“可读数据流”才会释放数据。刚刚新建的时候，“可读数据流”处于暂停态。

三种方法可以让暂停态转为流动态。

- 添加data事件的监听函数
- 调用resume方法
- 调用pipe方法将数据送往一个可写数据流

如果转为流动态时，没有data事件的监听函数，也没有pipe方法的目的地，那么数据将遗失。

以下两种方法可以让流动态转为暂停态。

- 不存在pipe方法的目的地时，调用pause方法
- 存在pipe方法的目的地时，移除所有data事件的监听函数，并且调用unpipe方法，移除所有pipe方法的目的地

注意，只移除data事件的监听函数，并不会自动引发数据流进入“暂停态”。另外，存在pipe方法的目的地时，调用pause方法，并不能保证数据流总是处于暂停态，一旦那些目的地发出数据请求，数据流有可能会继续提供数据。

每当系统有新的数据，该接口可以监听到data事件，从而回调函数。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';

readableStream.setEncoding('utf8');

readableStream.on('data', function(chunk) {
  data+=chunk;
});

readableStream.on('end', function() {
  console.log(data);
});
```

上面代码中，fs模块的createReadStream方法，是部署了Stream接口的文件读取方法。该方法对指定的文件，返回一个对象。该对象只要监听data事件，回调函数就能读到数据。

除了data事件，监听readable事件，也可以读到数据。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';
var chunk;

readableStream.setEncoding('utf8');

readableStream.on('readable', function() {
  while ((chunk=readableStream.read()) !== null) {
    data += chunk;
  }
});

readableStream.on('end', function() {
  console.log(data)
});
```

readable事件表示系统缓冲之中有可读的数据，使用read方法去读出数据。如果没有数据可读，read方法会返回null。

“可读数据流”除了read方法，还有以下方法。

- Readable.pause() ：暂停数据流。已经存在的数据，也不再触发data事件，数据将保留在缓存之中，此时的数据流称为静态数据流。如果对静态数据流再次调用pause方法，数据流将重新开始流动，但是缓存中现有的数据，不会再触发data事件。
- Readable.resume()：恢复暂停的数据流。
- readable.unpipe()：从管道中移除目的地数据流。如果该方法使用时带有参数，会阻止“可读数据流”进入某个特定的目的地数据流。如果使用时不带有参数，则会移除所有的目的地数据流。

### read()

read方法从系统缓存读取并返回数据。如果读不到数据，则返回null。

该方法可以接受一个整数作为参数，表示所要读取数据的数量，然后会返回该数量的数据。如果读不到足够数量的数据，返回null。如果不提供这个参数，默认返回系统缓存之中的所有数据。

只在“暂停态”时，该方法才有必要手动调用。“流动态”时，该方法是自动调用的，直到系统缓存之中的数据被读光。

```javascript
var readable = getReadableStreamSomehow();
readable.on('readable', function() {
  var chunk;
  while (null !== (chunk = readable.read())) {
    console.log('got %d bytes of data', chunk.length);
  }
});
```

如果该方法返回一个数据块，那么它就触发了data事件。

### setEncoding()

调用该方法，会使得数据流返回指定编码的字符串，而不是缓存之中的二进制对象。比如，调用`setEncoding('utf8')`，数据流会返回UTF-8字符串，调用`setEncoding('hex')`，数据流会返回16进制的字符串。

该方法会正确处理多字节的字符，而缓存的方法`buf.toString(encoding)`不会。所以如果想要从数据流读取字符串，应该总是使用该方法。

```javascript
var readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', function(chunk) {
  assert.equal(typeof chunk, 'string');
  console.log('got %d characters of string data', chunk.length);
});
```

### resume()

resume方法会使得“可读数据流”继续释放data事件，即转为流动态。

```javascript
var readable = getReadableStreamSomehow();
readable.resume();
readable.on('end', function(chunk) {
  console.log('数据流到达尾部，未读取任务数据');
});
```

上面代码中，调用resume方法使得数据流进入流动态，只定义end事件的监听函数，不定义data事件的监听函数，表示不从数据流读取任何数据，只监听数据流到达尾部。

### pause()

pause方法使得流动态的数据流，停止释放data事件，转而进入暂停态。任何此时已经可以读到的数据，都将停留在系统缓存。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('读取%d字节的数据', chunk.length);
  readable.pause();
  console.log('接下来的1秒内不读取数据');
  setTimeout(function() {
    console.log('数据恢复读取');
    readable.resume();
  }, 1000);
});
```

### isPaused()

该方法返回一个布尔值，表示“可读数据流”被客户端手动暂停（即调用了pause方法），目前还没有调用resume方法。

```javascript
var readable = new stream.Readable

readable.isPaused() // === false
readable.pause()
readable.isPaused() // === true
readable.resume()
readable.isPaused() // === false
```

### pipe()

该方法从“可读数据流”读出所有数据，将其写出指定的目的地。整个过程是自动的。

```javascript
var readable = getReadableStreamSomehow();
var writable = fs.createWriteStream('file.txt');
readable.pipe(writable);
```

上面代码将读取的数据，写入file.txt文件。

该方法返回处理后的数据流，因此可以链式调用。

```javascript
var r = fs.createReadStream('file.txt');
var z = zlib.createGzip();
var w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

下面的写法模拟了Unix系统的cat命令，将标准输出写入标准输入。

```javascript
process.stdin.pipe(process.stdout);
```

当来源地的数据流读取完成，默认会调用目的地的end方法，就不再能够写入。对pipe方法传入第二个参数`{ end: false }`，可以让目的地的数据流保持打开。

```javascript
reader.pipe(writer, { end: false });
reader.on('end', function() {
  writer.end('Goodbye\n');
});
```

上面代码中，目的地数据流默认不会调用end方法，只能手动调用，因此“Goodbye”会被写入。

### unpipe()

该方法移除pipe方法指定的数据流目的地。如果没有参数，则移除所有的pipe方法目的地。如果有参数，则移除该参数指定的目的地。如果没有匹配参数的目的地，则不会产生任何效果。

```javascript
var readable = getReadableStreamSomehow();
var writable = fs.createWriteStream('file.txt');
readable.pipe(writable);
setTimeout(function() {
  console.log('停止写入file.txt');
  readable.unpipe(writable);
  console.log('手动关闭file.txt的写入数据流');
  writable.end();
}, 1000);
```

上面代码写入file.txt的时间，只有1秒钟，然后就停止写入。

### 事件

（1）readable

readable事件在数据流能够向外提供数据时触发。

```javascript
var readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // there is some data to read now
});
```

（2）data

对于那些没有显式暂停的数据流，添加data事件监听函数，会将数据流切换到流动态，尽快向外提供数据。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('got %d bytes of data', chunk.length);
});
```

（3）end

无法再读取到数据时，会触发end事件。也就是说，只有当前数据被完全读取完，才会触发end事件，比如不停地调用read方法。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('got %d bytes of data', chunk.length);
});
readable.on('end', function() {
  console.log('there will be no more data.');
});
```

（4）close

数据源关闭时，close事件被触发。并不是所有的数据流都支持这个事件。

（5）error

当读取数据发生错误时，error事件被触发。

## 可写数据流

“可写数据流”允许你将数据写入某个目的地。与“可读数据流”类似，它也会触发各种不同的事件。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.setEncoding('utf8');

readableStream.on('data', function(chunk) {
  writableStream.write(chunk);
});
```

上面代码中，fs模块的createWriteStream方法针对特定文件，创建了一个“可写数据流”，本质上就是对写入操作部署了Stream接口。然后，“可写数据流”的write方法，可以将数据写入文件。

“可写数据流”具有以下事件。

- error：：写入过程中出错时触发。
- pipe： “可写数据流”发现有“可读数据流”接入时触发。
- unpipe：对“可读数据流”调用unpipe方法时触发。

## pipe()

pipe方法是自动传送数据的机制，就像管道一样。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.pipe(writableStream);
```

上面代码使用pipe方法，将file1的内容写入file2。整个过程由pipe方法管理，不用手动干预，所以可以将传送数据写得很简洁。

pipe方法返回目的地的数据流，因此可以使用链式写法，将多个数据流操作连在一起。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'));
```

上面代码采用链式写法，先读取文件，然后进行压缩，最后输出。

## HTTP请求

HTTP对象使用Stream接口，实现网络数据的读写。

```javascript
var http = require('http');

var server = http.createServer(function (req, res) {
  // req is an http.IncomingMessage, which is a Readable Stream
  // res is an http.ServerResponse, which is a Writable Stream

  var body = '';
  // we want to get the data as utf8 strings
  // If you don't set an encoding, then you'll get Buffer objects
  req.setEncoding('utf8');

  // Readable streams emit 'data' events once a listener is added
  req.on('data', function (chunk) {
    body += chunk;
  });

  // the end event tells you that you have entire body
  req.on('end', function () {
    try {
      var data = JSON.parse(body);
    } catch (er) {
      // uh oh!  bad json!
      res.statusCode = 400;
      return res.end('error: ' + er.message);
    }

    // write back something interesting to the user:
    res.write(typeof data);
    res.end();
  });
});

server.listen(1337);

// $ curl localhost:1337 -d '{}'
// object
// $ curl localhost:1337 -d '"foo"'
// string
// $ curl localhost:1337 -d 'not json'
// error: Unexpected token o
```

data事件表示读取或写入了一块数据。

```javascript
req.on('data', function(buf){
  // Do something with the Buffer
});
```

使用req.setEncoding方法，可以设定字符串编码。

```javascript

req.setEncoding('utf8');
req.on('data', function(str){
    // Do something with the String
});

```

end事件，表示读取或写入数据完毕。

```javascript

var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200);
    req.on('data', function(data){
        res.write(data);
    });
    req.on('end', function(){
        res.end();
    });
}).listen(3000);

```

上面代码相当于建立了“回声”服务，将HTTP请求的数据体，用HTTP回应原样发送回去。

system模块提供了pump方法，有点像Linux系统的管道功能，可以将一个数据流，原封不动得转给另一个数据流。所以，上面的例子也可以用pump方法实现。

```javascript

var http = require('http'),
    sys = require('sys');

http.createServer(function(req, res){
    res.writeHead(200);
    sys.pump(req, res);
}).listen(3000);

```

## fs模块

fs模块的createReadStream方法用于新建读取数据流，createWriteStream方法用于新建写入数据流。使用这两个方法，可以做出一个用于文件复制的脚本copy.js。

```javascript

// copy.js

var fs = require('fs');
console.log(process.argv[2], '->', process.argv[3]);

var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[3]);

readStream.on('data', function (chunk) {
  writeStream.write(chunk);
});

readStream.on('end', function () {
  writeStream.end();
});

readStream.on('error', function (err) {
  console.log("ERROR", err);
});

writeStream.on('error', function (err) {
  console.log("ERROR", err);
});d all your errors, you wouldn't need to use domains.

```

上面代码非常容易理解，使用的时候直接提供源文件路径和目标文件路径，就可以了。

{% highlight bash %}

node cp.js src.txt dest.txt

{% endhighlight %}

Streams对象都具有pipe方法，起到管道作用，将一个数据流输入另一个数据流。所以，上面代码可以重写成下面这样：

{% highlight javascript %}

var fs = require('fs');
console.log(process.argv[2], '->', process.argv[3]);

var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[3]);

readStream.on('open', function () {
  readStream.pipe(writeStream);
});

readStream.on('end', function () {
  writeStream.end();
});

{% endhighlight %}

## 错误处理

下面是压缩后发送文件的代码。

```javascript
http.createServer(function (req, res) {
  // set the content headers
  fs.createReadStream('filename.txt')
  .pipe(zlib.createGzip())
  .pipe(res)
})
```

上面的代码没有部署错误处理机制，一旦发生错误，就无法处理。所以，需要加上error事件的监听函数。

```javascript
http.createServer(function (req, res) {
  // set the content headers
  fs.createReadStream('filename.txt')
  .on('error', onerror)
  .pipe(zlib.createGzip())
  .on('error', onerror)
  .pipe(res)

  function onerror(err) {
    console.error(err.stack)
  }
})
```

上面的代码还是存在问题，如果客户端中断下载，写入的数据流就会收不到close事件，一直处于等待状态，从而造成内存泄漏。因此，需要使用[on-finished模块](https://github.com/jshttp/on-finished)用来处理这种情况。

```javascript
http.createServer(function (req, res) {
  var stream = fs.createReadStream('filename.txt')

  // set the content headers
  stream
  .on('error', onerror)
  .pipe(zlib.createGzip())
  .on('error', onerror)
  .pipe(res)

  onFinished(res, function () {
    // make sure the stream is always destroyed
    stream.destroy()
  })
})
```

## 参考链接

- James Halliday, [cs294-101-streams-lecture](https://github.com/substack/cs294-101-streams-lecture)
