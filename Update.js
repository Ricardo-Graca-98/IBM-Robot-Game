const fs = require('fs');
var childProcess = require('child_process');

setTimeout(update, 0);

//Updates all existing users by adding them back into the add.txt file and calling for the createProfile script
function update()
{
    fs.readdir('./Users', (err, files) => 
    {
        for(var i = 0; i < files.length; i++)
        {
            fs.appendFileSync('add.txt', files[i] + " \n");
        }
        runScript('./CreateProfile.js', function (err) 
            {
                if (err) throw err;
            });
    });
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