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
                var singleStat = 0;
                if(readSkills[j] != ' ')
                {
                    singleStat = parseInt(readSkills[j], 10);
                    i == 0 ? player1Skills.push(singleStat) : player2Skills.push(singleStat);
                    console.log(i == 0 ? player1Skills[player1Skills.length-1] : player2Skills[player2Skills.length-1]);
                }
            }
            console.log("");
        }

        do
        {
            if(player1Skills[1] > player2Skills[1])
            {
                attack(player1Skills[0], player2Skills[3]);
            }
            else if(player2Skills[1] > player1Skills[1])
            {
                attack(player2Skills[0], player1Skills[3]);
            }
            else
            {
                var random = Math.random();
                if(random < 0.5)
                {
                    attack(player1Skills[0], player2Skills[3]);
                }
                else
                {
                    attack(player2Skills[0], player1Skills[3]);
                }
            }
        }
        while(player1Skills[2] <= 0 && player2Skills[2] <= 0)
        {
            player2Skills[2] = 0;
        }
    }
}

function attack(dmg, evasion)
{
    var evasion = Math.floor(Math.random() * (+100 - +0)) + +0 < 5 ? 1 : 0;
    console.log(evasion);
    return evasion;
}