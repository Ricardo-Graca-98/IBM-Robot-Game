var fs = require('fs');
var childProcess = require('child_process');

var date = new Date();

setTimeout(checkDate, 0);

function checkDate()
{
    var data = fs.readFileSync('update.txt', 'utf8');
    var nextUpdate = data.split(" ");
    if(nextUpdate[1] == date.getMonth() + 1)
    {
        if(nextUpdate[0] <= date.getDate())
        {
            console.log("Updating...");
            var month;
            if(date.getDay() > (date.addDays(7)).getDate())
            {
                month = date.getMonth() + 2;
            }
            else
            {
                month = date.getMonth() + 1;
            }
            fs.writeFileSync('update.txt', (date.addDays(7)).getDate() + " " + month);
            runScript('./Update.js', function (err) 
            {
                if (err) throw err;
            });
        }
        else
        {
            console.log("Update in " + (nextUpdate[0] - date.getDate()) + " days");
        }
    }
    else if(nextUpdate[1] < date.getMonth() + 1)
    {
        console.log("Updating...");
        var month;
        if(date.getDay() > (date.addDays(7)).getDate())
        {
            month = date.getMonth() + 2;
        }
        else
        {
            month = date.getMonth() + 1;
        }
        fs.writeFileSync('update.txt', (date.addDays(7)).getDate() + " " + month);
        runScript('./Update.js', function (err) 
        {
            if (err) throw err;
        });
    }
    else
    {
        console.log("Update in " + (nextUpdate[0] - date.getDate()) + " days");
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
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