var http=require("http");
var fs=require("fs");//IO文件读入读出；
var url=require("url");
var querystring=require("querystring");

http.createServer(function(req,res){
    res.write('<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <title></title><style>#div1{width: 100px;height: 100px;background: orange;margin: 10px auto;}</style></head> <body>');
    res.write("<h1>这是一个H1的标题</h1>");
    res.write("这特么不就是拼凑出来的HTML文件吗");
    res.write('<div id="div1">div1的innerText</div>');
    res.end("</body></html>");
}).listen(8082);