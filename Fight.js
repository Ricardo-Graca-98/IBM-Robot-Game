 var fs = require('fs');

var players = fs.readFileSync('queue.txt', 'utf8');

setTimeout(fight, 0);

function fight()
{
    var counter = 0;
    var nameArray = [];
    var name = "";
    for(var i = 0; i < players.length; i++)
    {
        if(players[i] == ' ')
        {
            name = name.replace(/\s/g, '');
            nameArray.push(name);
            name = "";
        }
        name += players[i];
    }

    for(var i = 0; i < nameArray; i++)
    {   
        console.log(nameArray[i]);
    }   

    while(nameArray.length > 1)
    {
        counter++;
        var player1 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        var player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;
        var player1Skills = [];
        var player2Skills = [];

        //Get random players to fight
        while(player2 == player1)
        {
            console.log(player1 + " - " + player2);
            player2 = Math.floor(Math.random() * nameArray.length) + 0;  
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

        //DEBUG
        /*for(var k = 0; k < player1Skills.length; k++)
        {
            console.log(player1Skills[k]);
        }
        console.log("-------------");
        for(var k = 0; k < player2Skills.length; k++)
        {
            console.log(player2Skills[k]);
        }*/


        var slowest = player1Skills[0] > player2Skills[0] ? player2Skills : player1Skills;
        var fastest = player1Skills[0] > player2Skills[0] ? player1Skills : player2Skills;
        /*for(var i = 0; i < slowest.length; i++)
        {
            console.log(slowest[i]);
        }*/
        var counterFastest, counterSlowest;
        var fastestName;
        if(player1Skills[0] > player2Skills[0])
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
        var slowestName = player1Skills[0] > player2Skills[0] ? nameArray[player2] : nameArray[player1];

        while(player1Skills[1] > 0 && player2Skills[1] > 0)
        {
            for(var i = 0; i < fastest[0]; i++)
            {
                if(attack(fastest[3], slowest[2]) == 0 && slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log("fastest attacks");
                    slowest[1] -= fastest[3];
                    //console.log(fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!\n");
                    //console.log(slowest[1] + " health remaining!");
                }
                else if(slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log(fastestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " misses!\n");
                }
            }
            for(var i = 0; i < slowest[0]; i++)
            {
                if(attack(slowest[3], fastest[2]) == 0 && fastest[1] > 0 && slowest[1] > 0)
                {
                    //console.log("slowest attacks");
                    fastest[1] -= slowest[3];
                    //console.log(slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!\n" );
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!\n");
                    //console.log(fastest[1] + " health remaining!");
                }
                else if(slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log(slowestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " misses!\n");
                }
            }
            //console.log("");
        }
        fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        console.log(player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!");

        console.log("Adding to the reports!! " + fastestName + "|" + slowestName);

        var file = fs.readdirSync('./Users/' + fastestName + '/Fights');
        console.log(fastestName + " " + file.length);
        if(file.length == 1)
        {
            fs.writeFileSync('./Users/' + fastestName + '/Fights' + '/fightCount.txt', file.length-1);
        }
        else
        {
            fs.writeFileSync('./Users/' + fastestName + '/Fights' + '/fightCount.txt', file.length-2);
        }

        file = fs.readdirSync('./Users/' + slowestName + '/Fights');
        console.log(slowestName + " " + file.length);
        if(file.length == 1)
        {
            fs.writeFileSync('./Users/' + slowestName + '/Fights' + '/fightCount.txt', file.length-1);
        }
        else
        {
            fs.writeFileSync('./Users/' + slowestName + '/Fights' + '/fightCount.txt', file.length-2);
        }

        nameArray.splice(player1, 1);

        if(player1 < player2)
        {
            nameArray.splice(player2 - 1, 1);
        }
        else
        {
            nameArray.splice(player2, 1);
        }

        if(nameArray.length != 0)
        {
            fs.writeFileSync("queue.txt", nameArray[0] + " ");
        }
        else
        {
            fs.writeFileSync("queue.txt", "");
        }
    }
    console.log(counter + " fights completed!");
}

function attack(dmg, evasion)
{
    var evasion = Math.floor(Math.random() * (+100 - +0)) + +0 <= evasion ? 1 : 0;
    return evasion;
}