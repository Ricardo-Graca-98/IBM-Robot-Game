var fs = require('fs');

setTimeout(changeModule, 0);

function changeModule()
{
    var name = "disturbedboy69";
    var modData = "shields3";
    var modName = modData.slice(0, modData.length-1);
    var modLvl = modData[modData.length-1];
    var modules = fs.readFileSync('./Users/' + name + '/robotStats.txt', 'utf-8');
    modName = modName.charAt(0).toUpperCase() + modName.slice(1);
    //var lvlPos = modName.length + modules.indexOf(modName);
    var readModuleInfo = fs.readFileSync('./Modules/' + modName + '/LVL' + modLvl + '.txt', 'utf-8');
    for(var i = 0; i < readModuleInfo.length; i++)
    {
        var number = "";
        if(isNaN(readModuleInfo[i]) == 0)
        {
            while(readModuleInfo[i].match(/^[0-9]+$/) != null)
            {
                number += readModuleInfo[i];
                i++;
            }
        }
        if(number != "")
        {
            break;
        }
    }
    var stats = modules.split("/");
    for(var i = 0; i < stats.length; i++)
    {
        var statsName = stats[i].slice(0, stats[i].length-1)
        if(statsName == modName)
        {
            stats[i] = stats[i].slice(0, stats[i].length-1);
            stats[i] += modLvl;
            console.log(stats[i]);
            stats[i+1] = number;
            console.log(stats[i+1]); 
        }
    }
    fs.writeFileSync('./Users/' + name + '/robotStats.txt', "");
    for(var i = 0; i < stats.length; i++)
    {
        fs.appendFileSync('./Users/' + name + '/robotStats.txt', stats[i]);
        if(i+1 < stats.length)
        {
            fs.appendFileSync('./Users/' + name + '/robotStats.txt', "/");
        }
    }
}