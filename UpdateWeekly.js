var fs = require('fs');
var childProcess = require('child_process');

var date = new Date();

setTimeout(checkDate, 0);

function checkDate()
{
    var nextUpdate = fs.readFileSync('update.txt', 'utf8');
    if(nextUpdate <= date.getDate())
    {
        console.log("Updating...");
        fs.writeFileSync('update.txt', (date.addDays(7)).getDate());
        runScript('./Update.js', function (err) 
            {
                if (err) throw err;
            });
    }
    else
    {
        console.log("Update in " + (nextUpdate - date.getDate()) + " days");
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