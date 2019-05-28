var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var Twitter = require('twitter');
var fs = require('fs');
var rimraf = require("rimraf");

var text = "";
var completed = false;
var ID = "default";
var counter = 0;
var lastWordIndex = 0;
var addList = new Array();
var lvlPerPercentile = 0.05;
var addFile = fs.readFileSync('add.txt', 'utf8');

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);

setTimeout(processText, 500);
setInterval(checkCompletion, 0);

//Authentication into Twitter
var client = new Twitter ({
    consumer_key: ParsedCredentials.twitter[0].consumer_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    access_token_key: ParsedCredentials.twitter[0].access_token_key,
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret
})

//Authentication into the Personality Insight API
var personalityInsights = new PersonalityInsightsV3({
    version: ParsedCredentials.ibm[0].version,
    iam_apikey: ParsedCredentials.ibm[0].iam_apikey,
    url: ParsedCredentials.ibm[0].url,
})

const addUser = () => {
    var newUser = false;
    var outputText = "";
    ID = addList[counter];
    console.log(ID);

    //Get tweets from user timeline
    client.get(
        'statuses/user_timeline', 
        { screen_name: ID, count: '1000',  include_rts: 'false'}, 
        (error, tweets, response) => {
       
        if(!fs.existsSync('./Users/' + ID + '/auth.txt')){
            newUser = true;
            console.log("NEW USER!");
        }
        else
        {
            var auth = fs.readFileSync('./Users/' + ID + '/auth.txt', 'utf-8');
            if(auth == 0)
            {
                console.log("Not authenticated!");
                //fs.writeFileSync('sendAuth.txt', "ricardojg1@hotmail.com");
            }
            else
            {
                console.log("Authorized");
            }
        }

        //Make them json
        var data = JSON.stringify(tweets, null, 2);

        //Clean them
        var profileText = JSON.parse(data);
        outputText += "{ \"contentItems\" : [\n\n";
        console.log(profileText[0].user.id);

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

        if(newUser)
        {
            fs.writeFileSync('./Users/' + ID + '/auth.txt', 0);
            fs.writeFileSync('./Users/' + ID + '/twitterID.txt', profileText[0].user.id);
            fs.writeFileSync('sendAuth.txt', profileText[0].user.id);
            fs.writeFileSync('./Users/' + ID + '/robotStats.txt', "Power0/1/Shields0/100/Movement0/5/Weapons0/10");
            fs.mkdirSync('./Users/' + ID + '/Fights');
        }

        var profileParams = {
            
            // Get the content from the JSON file.
            content: require('./Users/' + ID + '/profile.json'),
            content_type: 'application/json',
            consumption_preferences: 'false'
        };

        //Gets the information from the Personality Insight tool belonging to the Watson AI
        personalityInsights.profile(profileParams, function(error, profile) 
        {
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
                    filtered += profile.personality[i].name + " " + profile.personality[i].percentile + "\n";
                    var lvl = ((profile.personality[i].percentile.toFixed(2) / lvlPerPercentile).toString());
                    lvl[1] != '.' ? lvl = lvl.substring(0,2) : lvl = lvl.substring(0,1);
                    lvl = parseInt(lvl, 10) + 1;
                    if(lvl > 20)
                    {
                        lvl = 20;
                    }
                    fs.appendFileSync('./Users/' + ID + '/stats.txt', lvl + " ");
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

Date.prototype.getUnixTime = function() {return this.getTime()/1000|0};
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }