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
    consumer_key: ParsedCredentials.twitter[0].consumer_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    access_token_key: ParsedCredentials.twitter[0].access_token_key,
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret
});

setTimeout(setup, 0);

function setup()
{
    var IDs = fs.readFileSync('sendAuth.txt', 'utf-8');
    var parsedIDs = IDs.split("\n");
    for(var i = 0; i < parsedIDs.length; i++)
    {
        //setTimeout(sendMessage, 0, parsedIDs[i]);
    }
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
      console.info(data);
  });
}

setTimeout(checkIfWorks, 500);

function checkIfWorks()
{
  client.get('direct_messages/events/list', function(error, msg, response) {
    if(error)
    {
      //console.log(error);
    }
    console.log(msg.events[0].message_create.message_data.text);  // The favorites.
  });
}

