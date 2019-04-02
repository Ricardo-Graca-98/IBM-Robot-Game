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
                        lvl += data[i+5];
                        lvl = lvl.trim();
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
                        lvlCounter++;
                    }
            }
        players[counter].averageLVL += (parseInt(players[counter].openness) + parseInt(players[counter].conscientiousness) + parseInt(players[counter].extraversion) + parseInt(players[counter].agreeableness) + parseInt(players[counter].emotionalRange)) / 5;
        counter++;
    })
    for(var i = 0; i < players.length; i++)
        {
            console.log(players[i].name + " " + players[i].openness + " " + players[i].conscientiousness + " " + players[i].extraversion + " " + players[i].agreeableness + " " + players[i].emotionalRange + " Avg." + players[i].averageLVL);
        }
    setTimeout(sort(players), 0);
}

function sort (data)
{
    var bestOpenness = [];
    var bestConscientiousness = [];
    var bestExtraversion = [];
    var bestAgreeableness = [];
    var bestEmotionalRange = [];
    for(var j = 0; j < 5; j++)
        {
            var array = [0];
            console.log(data.length);
            for(var i = 0; i < data.length; i++)
            {
                switch(j)
                    {
                        case 0:
                            console.log(data[i].openness + " > " + array[0]);
                            if(data[i].openness > array[0])
                                {
                                    console.log(array[0] + " < " + data[i].openness);
                                    array.splice(0,0,data[i].openness);
                                    console.log(array.length + "\n");
                                }
                    }
            }
            for(var i = 0; i < array.length; i++)
                {
                    console.log("Biggest - " + array[i]);
                }
        }
    console.log("what");
}

function Player (name)
{
    this.name = name;
    this.openness = 0;
    this.conscientiousness = 0;
    this.extraversion = 0;
    this.agreeableness = 0;
    this.emotionalRange = 0;
    this.averageLVL = 0;
}