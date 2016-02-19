
var http=require("http");
var fs=require("fs");//IO文件读入读出；
var url=require("url");
var querystring=require("querystring");

http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true);
    //console.log(JSON.stringify(urlObj));
    //urlObj.pathname;//访问的路径
    //urlObj.query;//查询的字符

    var pathname=urlObj.pathname;
    if(pathname=="/"){
        fs.createReadStream("index.html").pipe(res);
    }else if(pathname=="/blog/"){
        fs.createReadStream("blog.html").pipe(res);
    }else{
        fs.createReadStream("404.html").pipe(res);
    }
}).listen(8088);