var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var childProcess = require('child_process');

app.listen(80);

function handler (req, res) 
{
    var request = url.parse(req.url, true);
    var filename = "." + request.pathname;
    var requestText = "";
    //Get CODE
    var requestChar = req.url[1];

    //Store all requests
    var time = new Date;
    fs.appendFile('data.txt', req.url + " - " + time.getHours() + ":" + time.getMinutes() + " " + time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + "\n", function(err){
        if(err)
        {
            throw err;
        }
    });

    //Separate the CODE from the TEXT
    for(var j = 2; j < req.url.length; j++)
    {
        requestText += req.url[j];
    }

    /*************************************DATA HANDLING*********************************************/

    if(requestChar == '@')
    {
        if(fs.existsSync('./Users/' + requestText))
        {
            return res.end("User is already in the database!");
        }
        else
        {
            fs.appendFileSync('add.txt', requestText + " \n");
            create = true;
            return res.end("User creation in progress!");
        }
    }
    else if(requestChar == "!")
    {
        if (fs.existsSync('queue.txt') != 1) {
            fs.appendFileSync('queue.txt',"");
        }
        var fightList = fs.readFileSync('queue.txt', 'utf-8');
        var index = fightList.search(requestText);
        if(index < 0)
        {
            console.log("Add to queue");
            fs.appendFileSync('queue.txt', requestText + " \n");
            runScript('./Fight.js', function (err)
            {
            if (err) throw err;
            });
            return res.end("User added to the fight queue!");
        }
        else
        {
            return res.end("Already in the queue!");
        }
        
    }
    else
    {
        fs.readFile(__dirname + '/index.html',
        function (err, data) 
        {
            if (err) 
            {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
        res.writeHead(200);
        res.end(data);
        });
    }

    /*************************************DATA HANDLING OVER*****************************************/
}

function checkUpdate()
{
    runScript('./UpdateWeekly.js', function (err)
    {
        if (err) throw err;
    })
}

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

var clients = 0;
io.sockets.on('connection', function (socket) 
{
    console.log("User connected!");
    ++clients;
    io.sockets.emit('users_count', clients);
    socket.on('disconnect', function () 
    {
        console.log("User disconnected!");
        --clients;
    });
});