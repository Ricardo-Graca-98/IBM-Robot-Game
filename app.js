//Add all the nodes to the script
var app = require('http').createServer(handler) //HTTP node to create the server
var io = require('socket.io')(app); //Socket node for communication
var fs = require('fs'); //Fs node to read/write to files
var url = require('url'); //URL node to get the URL of the HTML request
var childProcess = require('child_process'); //Child Process to run other scripts asynchronously

require('dns').lookup(require('os').hostname(), function (err, add, fam)  //DNS node to check for the IP
{
    console.log("Hosted at " + add + ":" + app.address().port); //Print the IP and the Port to the screen
})

var create = false; //Var to check if a user has been created

setTimeout(updateLeaderboards, 10000); //Update the leaderboards 10 sec after the script starts
setTimeout(checkAuth, 0); //Check for authorization requests on twitter as soon as the script starts
setTimeout(checkUpdate, 0);//Check if the server needs to update the users as soon as the script starts
setInterval(checkUpdate, 86400000); //Check every 7 days if the server needs an update to the users
setInterval(check, 100); //Check if a new user can be created every 100ms
setInterval(checkAuth, 360000); //Check for authorization requests on twitter every 5 minutes
//setInterval(updateCSV, 60000); //Cause of the problem in case it crashes
//setTimeout(updateCSV, 0);

app.listen(80); //Creates the website on the port 80

function handler (req, res) //Every time the website has a request this function gets called
{
    var request = url.parse(req.url, true); //Parses the URL
    var filename = "." + request.pathname; //Get the file location
    var requestText = ""; 
    var requestChar = req.url[1]; //Get the first char which is a "code"

    /* 
    
    CODE CHART

        @ - Create new user
        ! - Add user to fighting queue
        % - To receive the ideal stats from the game
        $ - To change the modules of someone's robot

    */

    var time = new Date; //Creates a new variable that works with time

    //console.log(req.url + " - " + time.getHours() + ":" + time.getMinutes() + " " + time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + "\n");
    
    //If the request is not empty or asking for the favicon then save the requests into a data.txt file so we can track what's happening in the server
    if(req.url != "/" && req.url != "/favicon.ico")
    {
        fs.appendFile('data.txt', req.url + " - " + time.getHours() + ":" + time.getMinutes() + " " + time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + "\n", function(err){
            if(err)
            {
                throw err;
            }
        });
    }
    

    //Separate the "code" from the text
    for(var j = 2; j < req.url.length; j++)
    {
        requestText += req.url[j];
    }

    /*************************************DATA HANDLING*********************************************/

    if(requestChar == '@') //Create user
    {
        if(fs.existsSync('./Users/' + requestText)) //If the user already exists then cancel request
        {
            return res.end("User is already in the database!");
        }
        else //If it's a new user
        {
            fs.appendFileSync('add.txt', requestText + " \n"); //Add him to the add.txt file
            create = true; //Tell the script we are creating someone right now
            setInterval(checkAuth, 5000); //Check for authorization so that it sends the request to the user
            return res.end("User creation in progress!");
        }
    }
    else if(requestChar == "!") //Add user to the fighting queue
    {
        if (fs.existsSync('queue.txt') != 1) //If queue.txt file doesn't exist
        {
            fs.appendFileSync('queue.txt',""); //Create one
        }
        var fightList = fs.readFileSync('queue.txt', 'utf-8'); //Read if there are any names on the queue
        //console.log(fightList);
        var index = fightList.search(requestText); //Search for the fighter name
        if(index < 0) //If he doesn't exist
        {
            console.log("Add to queue");
            fs.appendFileSync('queue.txt', requestText + " "); //Add his name to the queue
            runScript('./Fight.js', function (err) //Run the fighting script to check if there are more opponents to fight
            {
                if (err) throw err;
            });
            return res.end("User added to the fight queue!"); //Return this text to the website
        }
        else
        {
            runScript('./Fight.js', function (err) //If the user is already in the queue then call for the fighting script
            {
            if (err) throw err;
            });
            return res.end("Already in the queue!");
        }
        
    }
    else if(requestChar == "%") //Add their ideal stats
    {
        var stats = requestText.split("~"); //Split the values on the ~, example "ip:port/%name~10~8~3~10"
        //console.log(stats[0]);
        var debug = 0; 
        if(fs.existsSync('./Users/' + stats[0])) //Check if the user exists 
        {
            var debug = 1;
            fs.writeFileSync('./Users/' + stats[0] + '/idealStats.txt', stats[1] + " " + stats[2] + " " + stats[3] + " " + stats[4]); //Save the stats into a file inside the user's folder
        }
        return res.end("Adding stats to " + stats[0] + "! " + debug); //Return the output to the website
    }
    else if(requestChar == "$") //Change the modules
    {
        var data = requestText.split("$"); //Split the data on the $'s
        var name = data[0]; //get the user name
        var modData = data[1]; //get the mod type
        var modName = modData.slice(0, modData.length-1); //get the mod name
        var modLvl = modData[modData.length-1]; //get the mod level
        var modules = fs.readFileSync('./Users/' + name + '/robotStats.txt', 'utf-8'); //read the curent modules
        modName = modName.charAt(0).toUpperCase() + modName.slice(1);
        //var lvlPos = modName.length + modules.indexOf(modName);
        var readModuleInfo = fs.readFileSync('./Modules/' + modName + '/LVL' + modLvl + '.txt', 'utf-8'); //Read the information about that module
        for(var i = 0; i < readModuleInfo.length; i++) //Parse all the data
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
        var stats = modules.split("/"); //Create an array of stats by separating the words/numbers by /
        for(var i = 0; i < stats.length; i++) 
        {
            var statsName = stats[i].slice(0, stats[i].length-1) 
            if(statsName == modName) //Look for the same name and then pick up all the stats from that module
            {
                stats[i] = stats[i].slice(0, stats[i].length-1);
                stats[i] += modLvl;
                console.log(stats[i]);
                stats[i+1] = number;
                console.log(stats[i+1]); 
            }
        }
        fs.writeFileSync('./Users/' + name + '/robotStats.txt', ""); //Empty the file
        for(var i = 0; i < stats.length; i++)
        {
            fs.appendFileSync('./Users/' + name + '/robotStats.txt', stats[i]); //Append all the new stats into the file
            if(i+1 < stats.length)
            {
                fs.appendFileSync('./Users/' + name + '/robotStats.txt', "/"); //Separate them by / except for the last one
            }
        }
    }
    else if(requestChar == null) //If requestChar is detected then it means the user is asking for the main page
    {
        fs.readFile(__dirname + '/index.html', //Read the index file
        function (err, data) 
        {
            if (err) 
            {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
        res.writeHead(200);
        res.end(data); //Return the index file to the user
        });
    }
    else
    {
        fs.readFile(filename, function(err, data) //If the request is trying to search for something that doesn't exist then return an output to the website saying that it's not in the database
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

//Function to run leaderboards script
function updateLeaderboards()
{
    runScript('./Leaderboard.js', function (err)
    {
        if (err) throw err;
    })
}

//Function to run updateweekly script
function checkUpdate()
{
    console.log("Runninng UpdateWeekly.js");
    runScript('./UpdateWeekly.js', function (err)
    {
        if (err) throw err;
    })
}

//Function to run authentication in case anyone is waiting to be authenticated
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

//Function to check for profile creation
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

//Function to run other scripts
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

//Function used to update the CSVs / Not in use right now
function updateCSV()
{
    var averageStats = [0,0,0,0,0]; //Create the average stats
    var users = 0; 
    fs.writeFileSync("debug.txt", "1"); //Debugging
    var files = fs.readdirSync('./Users'); //Read the number of users
    fs.appendFileSync("debug.txt", "2"); //Debugging
    for(var i = 0; i < files.length; i++) //Loop through each user
    {
        users++;
        var readStats = fs.readFileSync("./Users/" + files[i] + "/stats.txt", "utf-8"); //Get the stats
        var split = readStats.split(" "); //Split the stats
        for(var j = 0; j < averageStats.length; j++)
        {
            averageStats[j] = parseInt(averageStats[j]) + parseInt(split[j]); //parse the stats and add them into the average stats
        }
        fs.appendFileSync("debug.txt", "3"); //Debugging
    }
    for(var i = 0; i < 5; i++)
    {
        averageStats[i] = averageStats[i]/users; //Get the actual values from 1-20
    }
    fs.appendFileSync("debug.txt", "4"); //Debugging
    //Write the CSV file!
    fs.writeFileSync("./Stats/personalityStats.csv", "trait,percent\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "1," + averageStats[0] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "2," + averageStats[1] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "3," + averageStats[2] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "4," + averageStats[3] + "\n");
    fs.appendFileSync("./Stats/personalityStats.csv", "5," + averageStats[4] + "\n");
    fs.appendFileSync("debug.txt", "5"); //Debugging
}

setInterval(socketUpdate, 500); //Update the sockets every 500ms

//Variables for sockets
var exportData = "";
var opennessArray = "";
var conscientiousnessArray = "";
var emotionalRangeArray = "";
var extraversionArray = "";
var agreeablenessArray = "";

function socketUpdate()
{
    //Get all the data for each variable
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

//If someone is connected to the server then send them the data
io.sockets.on('connection', function (socket) 
{
    //Send them the real time requests
    setInterval(function(){
        socket.emit("data", {text: exportData});
    }, 500);
    //Send them all the leaderboards stats
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

