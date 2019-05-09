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

    //CHANGE FOR A WHILE
    if(nameArray.length > 1)
    {
        var player1 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        var player2;
        var player1Skills = [];
        var player2Skills = [];
        do
        {
            player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        }
        while(player2 == player1)
        {
            player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        }
        console.log(nameArray[player1] + " vs " + nameArray[player2]);
        
        for(var i = 0; i < 2; i++)
        {
            var readSkills = fs.readFileSync('./Users/' + nameArray[i == 0 ? player1 : player2] + '/robotStats.txt', 'utf8');
            for(var j = 0; j < readSkills.length; j++)
            {
                var singleStat = "";
                while(readSkills[j] != ' ')
                {
                    singleStat += readSkills[j];
                    j++;
                }
                i == 0 ? player1Skills.push(singleStat) : player2Skills.push(singleStat);
            }
        }

        var slowest = player1Skills[1] > player2Skills[1] ? player2Skills : player1Skills;
        var fastest = player1Skills[1] > player2Skills[1] ? player1Skills : player2Skills;
        var fastestName = player1Skills[1] > player2Skills[1] ? nameArray[player1] : nameArray[player2];
        var slowestName = player1Skills[1] > player2Skills[1] ? nameArray[player2] : nameArray[player1];

        while(player1Skills[2] > 0 && player2Skills[2] > 0)
        {
            for(var i = 0; i < slowest[1]; i++)
            {
                if(attack(slowest[0], fastest[3]) == 0 && fastest[2] > 0 && slowest[2] > 0)
                {
                    fastest[2] -= slowest[0];
                    console.log(slowestName + " hit " + fastestName + " dealing " + slowest[0] + " dmg!");
                    console.log(fastest[2] + " health remaining!");
                }
                else if(slowest[2] > 0 && fastest[2] > 0)
                {
                    console.log(slowestName + " misses!");
                }
            }
            for(var i = 0; i < fastest[1]; i++)
            {
                if(attack(fastest[0], slowest[3]) == 0 && slowest[2] > 0 && fastest[2] > 0)
                {
                    slowest[2] -= fastest[0];
                    console.log(fastestName + " hit " + slowestName + " dealing " + fastest[0] + " dmg!");
                    console.log(slowest[2] + " health remaining!");
                }
                else if(slowest[2] > 0 && fastest[2] > 0)
                {
                    console.log(fastestName + " misses!");
                }
            }
            console.log(player1Skills[1] > player2Skills[1] ? nameArray[player1] + " health - " + fastest[2] + " | " + nameArray[player2] + " health - " + slowest[2] : nameArray[player2] + " health - " + fastest[2] + " | " + nameArray[player1] + " health - " + slowest[2]);
            console.log("");
        }
        console.log(player1Skills[2] > player2Skills[2] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!");
    }
}

function attack(dmg, evasion)
{
    var evasion = Math.floor(Math.random() * (+100 - +0)) + +0 < 5 ? 1 : 0;
    return evasion;
}