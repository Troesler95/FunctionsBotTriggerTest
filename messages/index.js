/*-----------------------------------------------------------------------------
To learn more about this template please visit
https://aka.ms/abs-node-proactive
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var azure = require('azure-storage');
var path = require('path');
var request = require('request');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */
var inMemory = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
bot.set('storage', inMemory);

// Intercept event (ActivityTypes.Event)
// This is where the event from the HTTP trigger is "caught"
// message contains the payload returned from the HTTP trigger function's context.done() call
bot.on('event', function (message) {
    // handle message from trigger function
    var returnedMessage = message.value;
    var reply = new builder.Message()
        .address(returnedMessage.address)
        .text("The message you sent was: " + returnedMessage.text);
    bot.send(reply);
});

// Handle message from user
bot.dialog('/', function (session) {
    var messageDetails = { address: session.message.address, text: session.message.text };

    session.sendTyping();
    session.send('Your message (\'' + session.message.text + '\') is being POSTed to the function trigger, and it will be ' +
        'sent back to you via a Function shortly after!');

    request.post({
        url: "https://proativetriggerfuncbot.azurewebsites.net/api/EndpointTrigger",
        json: true,
        body: messageDetails,
    }, (err, res, body) => {
        if(res.statusCode != 200) {
            session.send("There was an error POSTing to the trigger!");
            session.send("Error: " + err.Message);
        }
    });

    session.send("Sent POST request to HTTP trigger!");
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = connector.listen();
}


