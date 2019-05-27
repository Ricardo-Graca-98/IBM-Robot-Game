var Twitter = require('twitter');
var fs = require('fs');
var Twit = require('twit');

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);

//Twitter authentication
var T = new Twit({
    consumer_key: ParsedCredentials.twitter[2].consumer_key,
    consumer_secret: ParsedCredentials.twitter[2].consumer_secret,
    access_token: ParsedCredentials.twitter[2].access_token_key,
    access_token_secret: ParsedCredentials.twitter[2].access_token_secret,
  })

  //Authentication into Twitter
var client = new Twitter
({
    consumer_key: ParsedCredentials.twitter[2].consumer_key,
    consumer_secret: ParsedCredentials.twitter[2].consumer_secret,
    access_token_key: ParsedCredentials.twitter[2].access_token_key,
    access_token_secret: ParsedCredentials.twitter[2].access_token_secret
});

setTimeout(setup, 0);

function setup()
{
    var IDs = fs.readFileSync('sendAuth.txt', 'utf-8');
    var parsedIDs = IDs.split(" ");
    for(var i = 0; i < parsedIDs.length; i++)
    {
      console.log(parsedIDs);
      setTimeout(sendMessage, 0, parsedIDs[i]);
    }
    fs.writeFileSync("sendAuth.txt", "");
}

function sendMessage(ID)
{
  var replyTo = 
  {
    'event': 
    {
      'type': 'message_create',
      'message_create': 
      {
        'target': 
        {
          'recipient_id': ID
        },
        'message_data': 
        {
          'text': 'Hello! I\'m here to confirm that you created an account in our game! Please type yes or no to confirm' ,
          'quick_reply': 
          {
            'type': 'options',
            'options': 
            [
              {
                'label' : 'Yes',
                'description' : 'Confirm it was you',
                'metadata' : 'external_id_1'
              },
              {
                'label' : 'No',
                'description' : 'It wasn\'t me',
                'metadata' : 'external_id_2'
              }
            ]
          }
        }
      }
    }
  }

  T.post('direct_messages/events/new', replyTo, function(err,data,response)
  {
      if(err)
      {
        console.log("error!");
      }
      else
      {
        console.log("success");
      }
  });
}

setTimeout(checkIfWorks, 0);

function checkIfWorks()
{
  fs.writeFileSync("./debug.txt", "Starting to get tweets\n");
  client.get('direct_messages/events/list', function(error, msg, response) 
  {
    if(error)
    {
      fs.appendFileSync("./debug.txt", error + "\n");
      console.log(error);
    }
    else
    {
      fs.appendFileSync("./debug.txt", "Adding user\n");
      var confirmedUsers = new Array();
      for(var i = 0; i < msg.events.length; i++)
      {
        var senderText = msg.events[i].message_create.message_data.text;
        var senderID = msg.events[i].message_create.sender_id;

        if(senderText == "Yes" || senderText == "yes")
        {
          console.log(senderID + " sent: " + senderText);
          linkUsersToID(senderID, 0);
          console.log(senderID + " is being confirmed!");
        }
        else if(senderText == "No" || senderText == "no")
        {
          console.log(senderID + " sent: " + senderText);
          linkUsersToID(senderID, 1);
          console.log(senderID + " is being deleted!");
        }
      }
    }
  });
}

function linkUsersToID(ID, DELETE)
{
  fs.appendFileSync("./debug.txt", "Got here with " + DELETE + "\n");
  var files = fs.readdirSync('./Users');
  for(var i = 0; i < files.length; i++)
  {
    if(ID == fs.readFileSync('./Users/' + files[i] + '/twitterID.txt', 'utf-8'))
    {
      console.log(ID + " = " + fs.readFileSync('./Users/' + files[i] + '/twitterID.txt', 'utf-8'));
      if(DELETE == 1)
      {
        console.log("Deleted!");
        rimraf.sync('./Users/' + files[i]);
      }
      else
      {
        console.log("Confirmed!");
        fs.writeFileSync('./Users/' + files[i] + '/auth.txt', "1");
      }
    }
  }
  fs.appendFileSync("./debug.txt", "Done!\n");
}