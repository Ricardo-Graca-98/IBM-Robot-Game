 var fs = require('fs');

var players = fs.readFileSync('queue.txt', 'utf8'); //Read who's on the queue.txt file

setTimeout(fight, 0);

function fight() 
{
    var counter = 0;
    var nameArray = [];
    var name = "";
    for(var i = 0; i < players.length; i++) //Push all the players into an array with the names
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

    while(nameArray.length > 1) //While there are at least 2 players in the queue to fight, make them all fight
    {
        counter++; //Counts the number of fights

        //Randomly chooses player 1 and 2
        var player1 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0; 
        var player2 = Math.floor(Math.random() * ((+nameArray.length-1) - +0)) + +0;

        //Arrays to store their stats
        var player1Skills = [];
        var player2Skills = [];

        //Checks if player 2 is different from player 1
        while(player2 == player1)
        {
            console.log(player1 + " - " + player2);
            player2 = Math.floor(Math.random() * nameArray.length) + 0;  
        }

        //Check which index should the reports be saved has
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

        //Get players skills
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

        //Get slowest and fastest
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

        //While both are alive keep fighting
        while(player1Skills[1] > 0 && player2Skills[1] > 0)
        {
            //Attack as many times as the fastest is able to (also it's the first to attack)
            for(var i = 0; i < fastest[0]; i++)
            {
                //if it hits the target deal damage
                if(attack(fastest[3], slowest[2]) == 0 && slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log("fastest attacks");
                    slowest[1] -= fastest[3];
                    //console.log(fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " hit " + slowestName + " dealing " + fastest[3] + " dmg!\n");
                    //console.log(slowest[1] + " health remaining!");
                }
                //if it misses the target
                else if(slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log(fastestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', fastestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', fastestName + " misses!\n");
                }
            }
            //Attack as many times as the slowest is able to
            for(var i = 0; i < slowest[0]; i++)
            {
                //if it hits the target deal damage
                if(attack(slowest[3], fastest[2]) == 0 && fastest[1] > 0 && slowest[1] > 0)
                {
                    //console.log("slowest attacks");
                    fastest[1] -= slowest[3];
                    //console.log(slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!\n" );
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " hit " + fastestName + " dealing " + slowest[3] + " dmg!\n");
                    //console.log(fastest[1] + " health remaining!");
                }
                //if it misses the target
                else if(slowest[1] > 0 && fastest[1] > 0)
                {
                    //console.log(slowestName + " misses!");
                    fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', slowestName + " misses!\n");
                    fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', slowestName + " misses!\n");
                }
            }
            //console.log("");
        }
        //Write to the file who's the winner
        fs.appendFileSync('./Users/' + fastestName + '/Fights' + '/fightReport' + counterFastest + '.txt', player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        fs.appendFileSync('./Users/' + slowestName + '/Fights' + '/fightReport' + counterSlowest + '.txt', player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!\n");
        console.log(player1Skills[1] > player2Skills[1] ? nameArray[player1] + " wins!" : nameArray[player2] + " wins!");

        console.log("Adding to the reports!! " + fastestName + "|" + slowestName);

        //Write to the fightCount txt file how many fights the user has
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

        //Remove the name from the queue
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

//Checks if the target hits or not
function attack(dmg, evasion) //meant to do the dmg calculations here
{
    var evasion = Math.floor(Math.random() * (+100 - +0)) + +0 <= evasion ? 1 : 0;
    return evasion;
}