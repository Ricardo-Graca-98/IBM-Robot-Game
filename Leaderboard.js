var fs = require('fs');

setTimeout(update, 0);

function update()
{
    var players = [];
    var counter = 0;
    fs.readdirSync('./Users/').forEach(file => 
    {
        var player = new Player(file);
        players.push(player);
        var lvlCounter = 0;
        var target = './Users/' + file + '/stats.txt';
        var data = fs.readFileSync(target).toString();
        data = data.split(" ");
        console.log(data.length);
        data.pop();
        players[counter].openness = data[0];
        players[counter].conscientiousness = data[1];
        players[counter].extraversion = data[2];
        players[counter].agreeableness = data[3];
        players[counter].emotionalRange = data[4];

        players[counter].averageLVL += (parseInt(players[counter].openness) + parseInt(players[counter].conscientiousness) + parseInt(players[counter].extraversion) + parseInt(players[counter].agreeableness) + parseInt(players[counter].emotionalRange)) / 5;
        counter++;
    })
    /*for(var i = 0; i < players.length; i++)
    {
        console.log(players[i].name + " " + players[i].openness + " " + players[i].conscientiousness + " " + players[i].extraversion + " " + players[i].agreeableness + " " + players[i].emotionalRange + " Avg." + players[i].averageLVL);
    }*/
    setTimeout(function(){sort(players);}, 1000);
}

function sort (data)
{
    console.log("Sorting data");
    var bestOpenness = [];
    var bestConscientiousness = [];
    var bestExtraversion = [];
    var bestAgreeableness = [];
    var bestEmotionalRange = [];
    var array = [0];
    var arrayOfNames = [];
    //var arrayOfNames = [];
    console.log("------------------------STATS------------------------\n")
    for(var j = 0; j < 5; j++)
        {
            //console.log(data.length);
            for(var i = 0; i < data.length; i++)
            {
                switch(j)
                    {
                        case 0:
                            for(var k = 0; k < array.length; k++)
                                {
                                    if(parseInt(data[i].openness) > array[k])
                                    {
                                        array.splice(k,0,data[i].openness);
                                        arrayOfNames.splice(k,0,data[i].name);
                                        break;
                                    }
                                }
                            break;
                        case 1:
                            //console.log("Checking " + data[i].name + " - " + data[i].conscientiousness + ">" + array[k]);
                            for(var k = 0; k < array.length; k++)
                                {
                                    if(parseInt(data[i].conscientiousness) > array[k])
                                    {
                                        array.splice(k,0,data[i].conscientiousness);
                                        arrayOfNames.splice(k,0,data[i].name);
                                        break;
                                    }
                                }
                            break;
                        case 2:
                            //console.log("Checking " + data[i].name + " - " + data[i].conscientiousness + ">" + array[k]);
                            for(var k = 0; k < array.length; k++)
                                {
                                    if(parseInt(data[i].emotionalRange) > array[k])
                                    {
                                        array.splice(k,0,data[i].emotionalRange);
                                        arrayOfNames.splice(k,0,data[i].name);
                                        break;
                                    }
                                }
                            break;
                        case 3:
                            //console.log("Checking " + data[i].name + " - " + data[i].conscientiousness + ">" + array[k]);
                            for(var k = 0; k < array.length; k++)
                                {
                                    if(parseInt(data[i].extraversion) > array[k])
                                    {
                                        array.splice(k,0,data[i].extraversion);
                                        arrayOfNames.splice(k,0,data[i].name);
                                        break;
                                    }
                                }
                            break;
                        case 4:
                            //console.log("Checking " + data[i].name + " - " + data[i].conscientiousness + ">" + array[k]);
                            for(var k = 0; k < array.length; k++)
                                {
                                    if(parseInt(data[i].agreeableness) > array[k])
                                    {
                                        array.splice(k,0,data[i].agreeableness);
                                        arrayOfNames.splice(k,0,data[i].name);
                                        break;
                                    }
                                }
                            break;
                    }
            }
            array.pop();
            switch(j)
                {
                    case 0:
                        bestOpenness = array;
                        for(var i = 0; i < bestOpenness.length; i++)
                            {
                                bestOpenness[i] += (" [" + arrayOfNames[i] + "]");
                            }
                        break;
                    case 1:
                        bestConscientiousness = array;
                        for(var i = 0; i < bestConscientiousness.length; i++)
                            {
                                bestConscientiousness[i] += (" [" + arrayOfNames[i] + "]");
                            }
                        break;
                    case 2:
                        bestExtraversion = array;
                        for(var i = 0; i < bestExtraversion.length; i++)
                            {
                                bestExtraversion[i] += (" [" + arrayOfNames[i] + "]");
                            }
                        break;
                    case 3:
                        bestAgreeableness = array;
                        for(var i = 0; i < bestAgreeableness.length; i++)
                            {
                                bestAgreeableness[i] += (" [" + arrayOfNames[i] + "]");
                            }
                        break;
                    case 4:
                        bestEmotionalRange = array;
                        for(var i = 0; i < bestEmotionalRange.length; i++)
                            {
                                bestEmotionalRange[i] += (" [" + arrayOfNames[i] + "]");
                            }
                        break;
                    default:
                        console.log("Switch broken!");
                        break;
                }
            arrayOfNames = [];
            array = [0];
        }
    console.log("\nOpenness\n");
    for(var i = 0; i < bestOpenness.length; i++)
        {
            console.log(bestOpenness[i]);
        }
    console.log("\nConscientiousness\n");
    for(var i = 0; i < bestConscientiousness.length; i++)
        {
            console.log(bestConscientiousness[i]);
        }
    console.log("\nEmotional Range\n");
    for(var i = 0; i < bestEmotionalRange.length; i++)
        {
            console.log(bestEmotionalRange[i]);
        }
    console.log("\nExtraversion\n");
    for(var i = 0; i < bestExtraversion.length; i++)
        {
            console.log(bestExtraversion[i]);
        }
    console.log("\nAgreeableness\n");
    for(var i = 0; i < bestAgreeableness.length; i++)
        {
            console.log(bestAgreeableness[i]);
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
    this.averageLVL = 0;
}