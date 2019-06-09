/* First fighting script which doesn't really work as we intended */

var fs = require('fs');

var players = fs.readFileSync('queue.txt', 'utf8');

setTimeout(fight, 0);

function fight()
{
    var nameArray = [];
    var name = "";
    for(var i = 0; i < players.length; i++)
    {
        if(players[i] == '\n')
        {
            name = name.replace(/\s/g, '');
            nameArray.push(name);
            name = "";
        }
        name += players[i];
    }

    var skills = [];
    console.log(nameArray.length);
    for(var i = 0; i < nameArray.length; i++)
    {
        console.log(nameArray[i]);
        var readSkills = fs.readFileSync('./Users/' + nameArray[i] + '/stats.txt', 'utf8');
        var total = 0;
        for(var j = 0; j < readSkills.length; j++)
        {
            if(readSkills[j] != ' ')
            {
                total += parseInt(readSkills[j], 10);
            }
        }
        skills.push(total);
        console.log(skills[i]);
    }

    /*for(var i = 0; i < skills.length; i += 2)
    {
        if(skills[i] > skills[i+1])
        {
            console.log(nameArray[i] + " vs " + nameArray[i+1] + " - " + nameArray[i] + " wins!");
        }
        else
        {
            console.log(nameArray[i] + " vs " + nameArray[i+1] + " - " + nameArray[i+1] + " wins!");
        }
    }*/

    for(var i = 0; i < skills.length; i += 2)
    {
        console.log(i+1 + " - " + nameArray.length);
        if(i+1 < nameArray.length)
        {
            var scoreFirst = Math.random() * (+skills[i] - +0) + +0;
            var scoreSecond = Math.random() * (+skills[i+1] - +0) + +0;
            if(skills[i] > skills[i+1])
            {
                scoreFirst += skills[i] - skills[i+1];
            }
            else
            {
                scoreSecond += skills[i+1] - skills[i];
            }
            console.log(scoreFirst + " " + scoreSecond);
            if(scoreFirst > scoreSecond)
            {
                console.log(nameArray[i] + " wins!");
                fs.appendFileSync('results.txt', nameArray[i] + " > " + nameArray[i+1] + "\n");
            }
            else
            {
                console.log(nameArray[i+1] + " wins!");
                fs.appendFileSync('results.txt', nameArray[i+1] + " > " + nameArray[i] + "\n");
            }
        } 
    }
}

