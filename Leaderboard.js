var fs = require('fs');

setTimeout(update, 0);

function update()
{
    var players = [];
    var counter = 0;
    fs.readdirSync('./Users/').forEach(file => {
        var player = new Player(file);
        players.push(player);
        var lvlCounter = 0;
        var target = './Users/' + file + '/stats.txt';
        var data = fs.readFileSync(target).toString();
        for(var i = 0; i < data.length; i++)
            {
                var lvl = "";
                if(data[i] == 'L' && data[i+1] == 'V')
                    {
                        lvl += data[i+4];
                        if(data[i+4] != '\n')
                            {
                                lvl += data[i+5];
                            }
                        switch(lvlCounter)
                            {
                                case 0:
                                    players[counter].openness = lvl;
                                    break;
                                case 1:
                                    players[counter].conscientiousness = lvl;
                                    break;
                                case 2:
                                    players[counter].extraversion = lvl;
                                    break;
                                case 3:
                                    players[counter].agreeableness = lvl;
                                    break;
                                case 4:
                                    players[counter].emotionalRange = lvl;
                                    break;
                            }
                    }
            }
        counter++;
    })
    for(var i = 0; i < players.length; i++)
        {
            console.log(players[i].name + " " + players[i].openness);
        }
}

function Player (name)
{
    this.name = name;
    this.openness = 0;
    this.conscientiousness = 0;
    this.extraversion = 0;
    this.agreeableness = 0;
    this.emotionalRange = 0;
}