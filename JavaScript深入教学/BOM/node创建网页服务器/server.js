var http=require("http");
var fs=require("fs");
var url=require("url");//解析URL
var querystring=require("querystring");//解析查询字符串

http.createServer(function(req,res){
    /*qes==request请求,从浏览器断过来的请求;res=responsel应答，从服务器返回浏览器端的对象*/
    res.writeHead(200);
    res.write('<!DOCTYPE html> <html> <head lang="en"> <meta charset="UTF-8"> <title></title> </head> <body>');
    res.write("<h1>这是一行字符串</h1>");
    res.write("this is my node.js DEMO");
    res.end("</body></html>")
}).listen(8081);
/*运行后，http://localhost:8081/，就可以访问了*/