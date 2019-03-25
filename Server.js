var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    console.log(req.url);
    for(var i = 0; i < req.url.length; i++)
    {
        console.log(req.url[i]);
    }
    fs.appendFile('data.txt', req.url + "\n", function (err) {
    if (err)
    {
        throw err;
    }
});
}).listen(5000); 