"use strict";

let quip = require('./quip.js'),

    QUIP_TOKEN = process.env.QUIP_TOKEN,

    qclient = new quip.Client({accessToken: QUIP_TOKEN}),;

var Client = require('node-rest-client').Client;
var rclient = new Client();

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var args = {
    headers: { "Authorization": "Bearer " + QUIP_TOKEN  } // request headers 
};
var url;
 
// direct way 
rclient.get("https://platform.quip.com/1/websockets/new", args, function (data, response) {
    // parsed response body as js object 
    url = data;
    client.on('connectFailed', function(error) {
        console.log('QUIP Connect Error: ' + error.toString());
    })

    client.on('connect', function(connection) {
        console.log("QUIP WebSocket client connected");
        connection.on('error', function(error) {
            console.log("QUIP Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log("QUIP echo-protocol Connection Closed");
            setTimeout(startnew, 5000);
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
                parseMessage(message);
            }
        });
    sendNumber();
         //quip expects origin to be set. 
    client.connect(url.url, null, 'https://quip.com' , null , null);
    });

});

function parseMessage(message) {
            if (connection.connected) {
                var mess = JSON.parse(message.utf8Data);
                if(mess.type == 'message'){




                    let events = req.body.entry[0].messaging;
                    for (let i = 0; i < events.length; i++) {
                        let event = events[i];
                        let sender = event.sender.id;
                        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
                            sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
                        } else if (event.message && event.message.text) {
                            let result = processor.match(event.message.text);
                            if (result) {
                                let handler = handlers[result.handler];
                                if (handler && typeof handler === "function") {
                                    handler(sender, result.match);
                                } else {
                                    console.log("Handler " + result.handlerName + " is not defined");
                                }
                            }
                        } else if (event.postback) {
                            let payload = event.postback.payload.split(",");
                            let postback = postbacks[payload[0]];
                            if (postback && typeof postback === "function") {
                                postback(sender, payload);
                            } else {
                                console.log("Postback " + postback + " is not defined");
                            }
                        } else if (event.message && event.message.attachments) {
                            uploads.processUpload(sender, event.message.attachments);
                        }
                    }
                    res.sendStatus(200);











                } 
            }
            
        }
        function sendNumber() {
            if (connection.connected) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                connection.sendUTF(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
