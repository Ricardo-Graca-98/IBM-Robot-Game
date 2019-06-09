//All the nodes required to read and write files and communicate with twitter
var Twitter = require('twitter');
var fs = require('fs');
var Twit = require('twit');

//Get the keys for twitter
var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials); //Parse them

//Twit authentication
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

//Run the setup function
setTimeout(setup, 0);

function setup()
{
    var IDs = fs.readFileSync('sendAuth.txt', 'utf-8'); //Read the auth file
    var parsedIDs = IDs.split(" "); //Split the id's by spaces
    for(var i = 0; i < parsedIDs.length; i++)
    {
      console.log(parsedIDs);
      setTimeout(sendMessage, 0, parsedIDs[i]); //Send messages for each ID
    }
    fs.writeFileSync("sendAuth.txt", ""); //Clear the id file
}

function sendMessage(ID) //Template to send messages on twitter, the only thing that changes is the recipient ID
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

  T.post('direct_messages/events/new', replyTo, function(err,data,response) //Send new message
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

setTimeout(getMessages, 0); //Get messages from users

function getMessages()
{
  client.get('direct_messages/events/list', function(error, msg, response) 
  {
    if(error)
    {
      console.log(error);
    }
    else
    {
      for(var i = 0; i < msg.events.length; i++) //loop through messages
      {
        var senderText = msg.events[i].message_create.message_data.text; //get text
        var senderID = msg.events[i].message_create.sender_id; //get id

        if(senderText == "Yes" || senderText == "yes") //if confirmed then change his status to confirmed
        {
          console.log(senderID + " sent: " + senderText);
          linkUsersToID(senderID, 0);
          console.log(senderID + " is being confirmed!");
        }
        else if(senderText == "No" || senderText == "no") //if not confirmed then delete his account
        {
          console.log(senderID + " sent: " + senderText);
          linkUsersToID(senderID, 1);
          console.log(senderID + " is being deleted!");
        }
      }
    }
  });
}

function linkUsersToID(ID, DELETE) //check if it authenticates the user or deletes it
{
  var files = fs.readdirSync('./Users');
  for(var i = 0; i < files.length; i++)
  {
    if(ID == fs.readFileSync('./Users/' + files[i] + '/twitterID.txt', 'utf-8')) 
    {
      console.log(ID + " = " + fs.readFileSync('./Users/' + files[i] + '/twitterID.txt', 'utf-8'));
      if(DELETE == 1) //Delete user
      {
        console.log("Deleted!");
        rimraf.sync('./Users/' + files[i]);
      }
      else //Confirm user
      {
        console.log("Confirmed!");
        fs.writeFileSync('./Users/' + files[i] + '/auth.txt', "1");
      }
    }
  }
  fs.appendFileSync("./debug.txt", "Done!\n"); //Debugging 
}