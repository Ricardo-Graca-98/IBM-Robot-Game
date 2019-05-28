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