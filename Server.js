var http = require('http');
var fs = require('fs');
var url = require('url');
var childProcess = require('child_process');

var create = false;

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
            var saveUsername = "";
            for(var j = 2; j < req.url.length; j++)
                {
                    saveUsername += req.url[j];
                }
            fs.appendFileSync('add.txt', saveUsername + " \n");
            create = true;
        }
    fs.appendFile('data.txt', req.url + "\n", function (err) {
    if (err)
    {
        throw err;
    }
});
}).listen(5000);

setInterval(check, 1000);

function check()
{
    if(create)
    {
            runScript('./CreateProfile.js', function (err) 
            {
                if (err) throw err;
            });
        create = false;
    }
}

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;
    var process = childProcess.fork(scriptPath);

    //listen for errors
    process.on('error', function (err) 
    {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) 
    {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}