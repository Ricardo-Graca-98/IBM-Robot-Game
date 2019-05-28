var Twitter = require('twitter');
var fs = require('fs');
var Twit = require('twit');

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);

//Twitter authentication
var T = new Twit({
    consumer_key: ParsedCredentials.twitter[0].consumer_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    access_token: ParsedCredentials.twitter[0].access_token_key,
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret,
  })
 
 
 // Reply to Twitter messages
 function replyToDirectMessage(){

  //get the user stream
  var stream = T.stream('user');

stream.on('direct_message', function (eventMsg) {
    console.log("here");
  var msg = eventMsg.direct_message.text;
  var screenName = eventMsg.direct_message.sender.screen_name;
  var userId = eventMsg.direct_message.sender.id;

  // reply object
  var replyTo = { user_id: userId,
    text: "Thanks for your message :)", 
    screen_name: screenName };

  console.log(screenName + " says: " + msg );

  // avoid replying to yourself when the recipient is you
  if(screenName != eventMsg.direct_message.recipient_screen_name){

    //post reply
    T.post("direct_messages/new",replyTo, function(err,data,response){
            console.info(data);
        });
    }
});
}

setTimeout(replyToDirectMessage, 0);