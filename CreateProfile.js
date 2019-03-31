var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var Twitter = require('twitter');
var fs = require('fs');
var rimraf = require("rimraf");

//Authentication into the Personality Insight API
var personalityInsights = new PersonalityInsightsV3({
  version: '2019-03-22',
  iam_apikey: 'YMpOWrKJysOg9xdNt3HNIcpnVqZHve-_VaVKkq4cokxi',
  url: 'https://gateway-lon.watsonplatform.net/personality-insights/api'
});

//Authentication into Twitter
var client = new Twitter({
  consumer_key: 'PX8hDcf9YHAKqXII5TdhlHMVw',
  consumer_secret: 'FFb7qceLkOXSa0GnLMgzItSeIYsmpckxToTZe0jUHPVMRNeWPV',
  access_token_key: '3135731542-Amvbgvz8s1t0v80KW4TCLnoFfNzUIBSJuWwXvWM',
  access_token_secret: 'Bja7LysYPFqkMubC8i9d8R1GljlTozLjtWtIRu52BVz6F'
});

var text = "";
var completed = false;
var ID = "default";
var counter = 0;
var lastWordIndex = 0;
var addList = new Array();
var lvlPerPercentile = 0.05;

var addFile = fs.readFileSync('add.txt', 'utf8');

//Create question template
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

setTimeout(processText, 500);
setInterval(checkCompletion, 500);

function addUser()
{
    ID = addList[counter];
    console.log(ID);
    //Get tweets from user timeline
    client.get('statuses/user_timeline', {screen_name: ID, count: '1000', include_rts: 'false'} , function(error, tweets, response)
    {
        //console.log(tweets);
        var outputText = "";
        //Make them json
        var data = JSON.stringify(tweets, null, 2);
        //Clean them
        var profileText = JSON.parse(data);
        outputText += "{ \"contentItems\" : [\n\n";
        //Take tweet text
        for(var i = 0; i < profileText.length;   i++)
        {
            text =  profileText[i].text;
            text = text.replace(/(\r\n|\n|\r)/gm," ");
            text = text.replace(/"/g, '');
            
            var parsedUnixTime = new Date(profileText[i].created_at).getUnixTime();
            outputText += "{\n\t\"content\":\"" + text + "\",\n\t\"contenttype\": \"text/plain\",\n\t\"created\":" + parsedUnixTime + ",\n\t\"id\":\"" + profileText[i].id + "\",\n\t\"language\":\"en\"\n}";
            
            if((i+1) != profileText.length)
            {
                outputText += ",\n";
            }
        }
        outputText += "]}";
        if (!fs.existsSync('./Users/' + ID))
        {
            fs.mkdirSync('./Users/' + ID);
        }
        fs.writeFileSync('./Users/' + ID + '/profile.json', outputText);
        var profileParams = {
            // Get the content from the JSON file.
            content: require('./Users/' + ID + '/profile.json'),
            content_type: 'application/json',
            consumption_preferences: 'false'
        };
        //Gets the information from the Personality Insight tool belonging to the Watson AI
        personalityInsights.profile(profileParams, function(error, profile) {
            if (error) 
            {
                console.log("FAILED! Error code - " + error.code);
                console.log("Aborting...");
                rimraf.sync('./Users/' + ID);
                console.log("Aborted!");
                completed = true;
            } 
            else 
            { 
                var filtered = "";
                if (fs.existsSync('./Users/' + ID + '/stats.txt'))
                {
                    rimraf.sync('./Users/' + ID + '/stats.txt');
                }
                for(var i = 0; i < profile.personality.length; i++)
                {
                    //console.log(profile.personality[i].name + " " + profile.personality[i].percentile + "\n");
                    filtered += profile.personality[i].name + " " + profile.personality[i].percentile + "\n";
                    var lvl = ((profile.personality[i].percentile.toFixed(2) / lvlPerPercentile).toString());
                    lvl[1] != '.' ? lvl = lvl.substring(0,2) : lvl = lvl.substring(0,1);
                    lvl = parseInt(lvl, 10) + 1;
                    if(lvl > 20)
                    {
                        lvl = 20;
                    }
                    console.log(lvl);
                    //console.log(lvl1 + " " + lvl2);
                    fs.appendFileSync('./Users/' + ID + '/stats.txt', profile.personality[i].name + " LVL-" + lvl + "\n");
                }
                fs.writeFileSync('./Users/' + ID + '/outputUnity.txt', filtered);
                fs.writeFileSync('./Users/' + ID + '/outputRawUnity.json', JSON.stringify(profile, null, 2));
                completed = true;
                console.log("Account created!");
            }
        });
    })
}

function checkCompletion()
{
    if(completed)
    {
            counter++;
            completed = false;
        if(counter < addList.length)
            {
                setTimeout(addUser, 0);
            }
        else{
            console.log("Process completed! \n");
        }
    }
}

function processText()
{
    console.log("Adding to the database...");
    for(var k = 0; k < addFile.length; k++)
    {
        if(addFile[k] == "\n")
            {
                var word = "";
                for(var i = lastWordIndex; i < k - 1; i++)
                {
                    word += addFile[i];
                }
                addList.push(word);
                lastWordIndex = k + 1;
            }
    }
    fs.unlinkSync("add.txt");
    setTimeout(addUser, 0);
}

function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }