const app = require('http').createServer(handler)
const io = require('socket.io')(app)
const fs = require('fs')
const url = require('url')
const childProcess = require('child_process')

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log("Hosted at " + add + ":" + app.address().port);
})

var create = false;

setTimeout(updateLeaderboards, 10000)
setTimeout(checkAuth, 0)
setTimeout(checkUpdate, 0)
setInterval(checkUpdate, 86400000)
setInterval(check, 100)
setInterval(checkAuth, 360000)

app.listen(800);

function handler (req, res) 
{
    var request = url.parse(req.url, true);
    var filename = "." + request.pathname;
    var requestText = "";
    //Get CODE
    var requestChar = req.url[1];

    //Store all requests
    var time = new Date;
    console.log(req.url + " - " + time.getHours() + ":" + time.getMinutes() + " " + time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + "\n");
    
    if(req.url != "/" && req.url != "/favicon.ico")
    {
        fs.appendFile('data.txt', req.url + " - " + time.getHours() + ":" + time.getMinutes() + " " + time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + "\n", function(err){
            if(err)
            {
                throw err;
            }
        });
    }
    

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
            setInterval(checkAuth, 5000);
            return res.end("User creation in progress!");
        }
    }
    else if(requestChar == "!")
    {
        if (fs.existsSync('queue.txt') != 1) {
            fs.appendFileSync('queue.txt',"");
        }

        var fightList = fs.readFileSync('queue.txt', 'utf-8');
        console.log(fightList);
        var index = fightList.search(requestText);
        if(index < 0)
        {
            console.log("Add to queue");
            fs.appendFileSync('queue.txt', requestText + " ");
            runScript('./Fight.js', function (err)
            {
            if (err) throw err;
            });
            return res.end("User added to the fight queue!");
        }
        else
        {
            runScript('./Fight.js', function (err)
            {
            if (err) throw err;
            });
            return res.end("Already in the queue!");
        }
        
    }
    else if(requestChar == "%")
    {
        var stats = requestText.split("~");
        console.log(stats[0]);
        var debug = 0;
        if(fs.existsSync('./Users/' + stats[0]))
        {
            var debug = 1;
            fs.writeFileSync('./Users/' + stats[0] + '/idealStats.txt', stats[1] + " " + stats[2] + " " + stats[3] + " " + stats[4]);
        }
        return res.end("Adding stats to " + stats[0] + "! " + debug);
    }
    else if(requestChar == "$")
    {
        var data = requestText.split("$");
        var name = data[0];
        var modData = data[1];
        var modName = modData.slice(0, modData.length-1);
        var modLvl = modData[modData.length-1];
        var modules = fs.readFileSync('./Users/' + name + '/robotStats.txt', 'utf-8');
        modName = modName.charAt(0).toUpperCase() + modName.slice(1);
        //var lvlPos = modName.length + modules.indexOf(modName);
        var readModuleInfo = fs.readFileSync('./Modules/' + modName + '/LVL' + modLvl + '.txt', 'utf-8');
        for(var i = 0; i < readModuleInfo.length; i++)
        {
            var number = "";
            if(isNaN(readModuleInfo[i]) == 0)
            {
                while(readModuleInfo[i].match(/^[0-9]+$/) != null)
                {
                    number += readModuleInfo[i];
                    i++;
                }
            }
            if(number != "")
            {
                break;
            }
        }
        var stats = modules.split("/");
        for(var i = 0; i < stats.length; i++)
        {
            var statsName = stats[i].slice(0, stats[i].length-1)
            if(statsName == modName)
            {
                stats[i] = stats[i].slice(0, stats[i].length-1);
                stats[i] += modLvl;
                console.log(stats[i]);
                stats[i+1] = number;
                console.log(stats[i+1]); 
            }
        }
        fs.writeFileSync('./Users/' + name + '/robotStats.txt', "");
        for(var i = 0; i < stats.length; i++)
        {
            fs.appendFileSync('./Users/' + name + '/robotStats.txt', stats[i]);
            if(i+1 < stats.length)
            {
                fs.appendFileSync('./Users/' + name + '/robotStats.txt', "/");
            }
        }
    }
    else if(requestChar == null)
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
    else
    {
        fs.readFile(filename, function(err, data)
        {
            if (err) 
            {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("Not in the database, sorry!");
            } 
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }

    /*************************************DATA HANDLING OVER*****************************************/
}

function updateLeaderboards()
{
    runScript('./Leaderboard.js', function (err)
    {
        if (err) throw err;
    })
}

function checkUpdate()
{
    console.log("Runninng UpdateWeekly.js");
    runScript('./UpdateWeekly.js', function (err)
    {
        if (err) throw err;
    })
}

function checkAuth()
{
    if (fs.existsSync('sendAuth.txt')) 
    {
        console.log("Runninng Authentication.js");
        runScript('./Authentication.js', function (err) 
            {
                if (err) throw err;
            });
    }
}

function check()
{
    if(create)
    {
        console.log("Runninng CreateProfile.js");
        runScript('./CreateProfile.js', function (err) 
        {
            if (err) throw err;
        });
        create = false;
    }
}

function runScript(scriptPath, callback) 
{

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

function updateCSV()
{
    var averageStats = [0,0,0,0,0];
    var users = 0;
    fs.writeFileSync("debug.txt", "1");
    var files = fs.readdirSync('./Users');
    fs.appendFileSync("debug.txt", "2");
    for(var i = 0; i < files.length; i++)
    {
        users++;
        var readStats = fs.readFileSync("./Users/" + files[i] + "/stats.txt", "utf-8");
        var split = readStats.split(" ");
        for(var j = 0; j < averageStats.length; j++)
        {
            averageStats[j] = parseInt(averageStats[j]) + parseInt(split[j]);
        }
        fs.appendFileSync("debug.txt", "3");
    }
    for(var i = 0; i < 5; i++)
    {
        averageStats[i] = averageStats[i]/users;
    }
    fs.appendFileSync("debug.txt", "4");
    fs.writeFileSync("./Stats/personalityStats.csv", "trait,percent\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "1," + averageStats[0] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "2," + averageStats[1] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "3," + averageStats[2] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "4," + averageStats[3] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "5," + averageStats[4] + "\n");
    fs.appendFileSync("debug.txt", "5");
}

setInterval(socketUpdate, 500);

var exportData = "";
var opennessArray = "";
var conscientiousnessArray = "";
var emotionalRangeArray = "";
var extraversionArray = "";
var agreeablenessArray = "";

function socketUpdate()
{
    var data = fs.readFileSync("./data.txt", 'utf-8');
    var splitedData = data.split("\n");
    exportData = splitedData;
    exportData = exportData[exportData.length-2];
    data = fs.readFileSync("./Leaderboards/Openness.txt", 'utf-8');
    opennessArray = data.split("\n");
    data = fs.readFileSync("./Leaderboards/Conscientiousness.txt", 'utf-8');
    conscientiousnessArray = data.split("\n");
    data = fs.readFileSync("./Leaderboards/EmotionalRange.txt", 'utf-8');
    emotionalRangeArray = data.split("\n");
    data = fs.readFileSync("./Leaderboards/Extraversion.txt", 'utf-8');
    extraversionArray = data.split("\n");
    data = fs.readFileSync("./Leaderboards/Agreeableness.txt", 'utf-8');
    agreeablenessArray = data.split("\n");
}

var clients = 0;
io.sockets.on('connection', function (socket) 
{
    setInterval(function(){
        socket.emit("data", {text: exportData});
    }, 500);
    setInterval(function(){
        socket.emit("opennessData", 
        {
            a: opennessArray[0],
            b: opennessArray[1],
            c: opennessArray[2],
            d: opennessArray[3],
            e: opennessArray[4]
        });
    }, 500);
    setInterval(function(){
        socket.emit("conscientiousnessData", 
        {
            a: conscientiousnessArray[0],
            b: conscientiousnessArray[1],
            c: conscientiousnessArray[2],
            d: conscientiousnessArray[3],
            e: conscientiousnessArray[4]
        });
    }, 500);
    setInterval(function(){
        socket.emit("emotionalRangeData", 
        {
            a: emotionalRangeArray[0],
            b: emotionalRangeArray[1],
            c: emotionalRangeArray[2],
            d: emotionalRangeArray[3],
            e: emotionalRangeArray[4]
        });
    }, 500);
    setInterval(function(){
        socket.emit("extraversionData", 
        {
            a: extraversionArray[0],
            b: extraversionArray[1],
            c: extraversionArray[2],
            d: extraversionArray[3],
            e: extraversionArray[4]
        });
    }, 500);
    setInterval(function(){
        socket.emit("agreeablenessData", 
        {
            a: agreeablenessArray[0],
            b: agreeablenessArray[1],
            c: agreeablenessArray[2],
            d: agreeablenessArray[3],
            e: agreeablenessArray[4]
        });
    }, 500);
}); 

