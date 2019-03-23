var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var Twitter = require('twitter');
var fs = require('fs');
const simpleGit = require('simple-git');

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
var outputText = "";

//Get tweets from user timeline
client.get('statuses/user_timeline', {screen_name: 'DisturbedBoy69', count: '100', include_rts: 'false'} , function(error, tweets, response)
{
    //Make them json
    var data = JSON.stringify(tweets, null, 2);
    //Clean them
    let profileText = JSON.parse(data);
    outputText += "{ \"contentItems\" : [\n\n";
    //Take tweet text
    for(var i = 0; i < profileText.length;   i++)
    {
        text =  profileText[i].text;
        text = text.replace(/(\r\n|\n|\r)/gm," ");
        
        outputText += "{\n\t\"content\":\"" + text + "\",\n\t\"contenttype\": \"text/plain\",\n\t\"created\":" + 0 + ",\n\t\"id\":\"" + profileText[i].id + "\",\n\t\"language\":\"en\"\n}";
        
        if((i+1) != profileText.length)
            {
                outputText += ",\n";
            }
    }
    outputText += "]}";
    fs.writeFileSync('./profile.json', outputText);
    var profileParams = {
        // Get the content from the JSON file.
        content: require('./profile.json'),
        content_type: 'application/json',
        consumption_preferences: 'true'
    };
    personalityInsights.profile(profileParams, function(error, profile) {
        if (error) 
        {
            console.log(error);
        } 
        else 
        { 
            fs.writeFileSync('./outputUnity.json', JSON.stringify(profile, null, 2));
        }
    });
    simpleGit.push('origin', 'master');
})

