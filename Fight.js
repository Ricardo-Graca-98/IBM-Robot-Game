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
        var player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        var player1Skills = [];
        var player2Skills = [];

        //Get random players to fight
        while(player2 == player1)
        {
            player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        }

        //Check which index should the files be saved in
        P1counter = 0;
        P2counter = 0;
        while(fs.existsSync('./Users/' + nameArray[player1] + '/Fights' + '/fightReport' + P1counter + '.txt'))
        {
            P1counter++;
        }
        while(fs.existsSync('./Users/' + nameArray[player2] + '/Fights' + '/fightReport' + P2counter + '.txt'))
        {
            P2counter++;
        }
        console.log("Done! P1-" + P1counter + " P2-" + P2counter);

        console.log(nameArray[player1] + " vs " + nameArray[player2]);
        
        for(var i = 0; i < 2; i++)
        {
            var readSkills = fs.readFileSync('./Users/' + nameArray[i == 0 ? player1 : player2] + '/robotStats.txt', 'utf8');
            var allStats = readSkills.split("/");

            for(var j = 1; j < allStats.length; j += 2)
            {

                i == 0 ? player1Skills.push(allStats[j]) : player2Skills.push(allStats[j]);
            }
        }
        for(var k = 0; k < player1Skills.length; k++)
        {
            console.log(player1Skills[k]);
        }
        console.log("-------------");
        for(var k = 0; k < player2Skills.length; k++)
        {
            console.log(player2Skills[k]);
        }


        var slowest = player1Skills[1] > player2Skills[1] ? player2Skills : player1Skills;
        var fastest = player1Skills[1] > player2Skills[1] ? player1Skills : player2Skills;
        var counterFastest, counterSlowest;
        var fastestName;
        if(player1Skills[1] > player2Skills[1])
        {
            fastestName = nameArray[player1];
            counterFastest = P1counter;
            counterSlowest = P2counter;
        }
        else
        {
            fastestName = nameArray[player2];
            counterFastest = P2counter;
            counterSlowest = P1counter;
        }
        var slowestName = player1Skills[1] > player2Skills[1] ? nameArray[player2] : nameArray[player1];

        while(player1Skills[2] > 0 && player2Skills[2] > 0)
        {
            for(var i = 0; i < slowest[1]; i++)
            {
                if(attack(slowest[0], fastest[3]) == 0 && fastest[2] > 0 && slowest[2] > 0)
                {
                    fastest[2] -= slowest[0];
                    console.log(slowestName + " hit " + fastestName + " dealing " + slowest[0] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[0] + " dmg!\n" );
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[0] + " dmg!\n");
                    console.log(fastest[2] + " health remaining!");
                }
                else if(slowest[2] > 0 && fastest[2] > 0)
                {
                    console.log(slowestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " misses!\n");
                }
            }
            for(var i = 0; i < fastest[1]; i++)
            {
                if(attack(fastest[0], slowest[3]) == 0 && slowest[2] > 0 && fastest[2] > 0)
                {
                    slowest[2] -= fastest[0];
                    console.log(fastestName + " hit " + slowestName + " dealing " + fastest[0] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[0] + " dmg!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[0] + " dmg!\n");
                    console.log(slowest[2] + " health remaining!");
                }
                else if(slowest[2] > 0 && fastest[2] > 0)
                {
                    console.log(fastestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " misses!\n");
                }
            }
            console.log("");
        }
        fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', player1Skills[2] > player2Skills[2] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', player1Skills[2] > player2Skills[2] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        console.log(player1Skills[2] > player2Skills[2] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!");
        console.log("");


        //REMOVE THE FUCKING NAMES!!
        console.log(nameArray.length);

        nameArray.splice(player1);
        nameArray.splice(player2);

        console.log(nameArray.length);
        for(var i = 0; i < nameArray.length; i++)
        {
            console.log(nameArray[i]);
        }
    }
}

function attack(dmg, evasion)
{
    var evasion = Math.floor(Math.random() * (+100 - +0)) + +0 < 5 ? 1 : 0;
    return evasion;
}