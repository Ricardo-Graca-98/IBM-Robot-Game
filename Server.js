var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
        if (err) 
        {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        } 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
    if(req.url[1] == '@')
        {
            console.log("Add new one!");
            var saveUsername;
            for(var j = 2; j < req.url.length; j++)
                {
                    saveUsername += req.url[j];
                }
            console.log(saveUsername);
            fs.appendFileSync('add.txt', saveUsername);
        }
    fs.appendFile('data.txt', req.url + "\n", function (err) {
    if (err)
    {
        throw err;
    }
});
}).listen(5000); 