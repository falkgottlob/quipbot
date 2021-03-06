"use strict";

let quip = require('./quip.js'),
    cheerio = require('cheerio'),
    processor = require('./processor'),
    handlers = require('./handlers'),
    QUIP_TOKEN = process.env.QUIP_TOKEN,
    Client = require('node-rest-client').Client,
    rclient = new Client(),
    WebSocketClient = require('websocket').client,
    client = new WebSocketClient(),
    qclient = new quip.Client({accessToken: process.env.QUIP_TOKEN}),
    args = {
        headers: { "Authorization": "Bearer " + QUIP_TOKEN  } // request headers 
    },
    url;
 
// direct way 
rclient.get("https://platform.quip.com/1/websockets/new", args, function (data, response) {
    console.log('QUIP Connect: ' + data);
    
    url = data;
    
    client.on('connectFailed', function(error) {
        console.log('QUIP Connect Error: ' + error.toString());
    });

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
                parseMessage(message);
            }
        });
   
    });
    client.connect(url.url, null, 'https://quip.com' , null , null);

});

function parseMessage(message) {
     
    let events = JSON.parse(message.utf8Data);
    //console.log("QUIP parsing Type: " + events.type); 
    
    if(events.type == 'message' && events.message.text.startsWith("#")){
        //console.log("QUIP parsing Text: " + events.message.text); 

        let thread = events.thread.id;
        let annotation = '';
        if(events.message.annotation){
          annotation = events.message.annotation.id;
        }
        let records = [];
        let values = [];


        let valueText = events.message.text.substring(1);

        let valueResult = valueText.split(" ");
  
        for (var i = 0, len = valueResult.length; i < len; i++) {
            console.log("Element " + i + " = " + valueResult[i]); 
            values.push(valueResult[i]); 
        }

        let result = processor.match(events.message.text);

                if (result) {
                  
                    let handler = handlers[result.handler];
                    
                    if (handler && typeof handler === "function") {
                        handler(thread, values);
                    } else {
                        console.log("Handler " + result.handlerName + " is not defined");
                    }
                }

          
    }

}



 //addsection(thread, compiledFunction({  records: result, rtype: sobject}));

let sendMessage = (message, thread, responseto, parts) => {

   //parts need very specific generation, too much effort so took it out
    var newmessages = { 
        threadId : thread, 
        content : message, 
        annotation_id : responseto
    };
    
    qclient.newMessage(newmessages, callbackMessage);

    //respond(thread, 'error', annotation, null);
}

let addSection = (message, thread) => {

    var newsection = {
        threadId : thread,
        content : message
    }
 
    qclient.editDocument(newsection, sentedit);    
    
}

let addQuipContent = (quipid, thread) => {

    qclient.getThread(quipid, function(err, threads){
        if (err) {  console.error(err); }
        //html = cheerio.load(threads.html);
        addSection(threads.html, thread);
    });
    
}

let sentedit = (error, message) => {
  //console.log('edit sent ' + error);
  //console.log(message);
}
let getHtml = (error, message) => {
  //console.log('edit sent ' + error);
  //console.log(message);
}
let callbackMessage = (error, message) => {
//  console.log('message sent ' + error + message);
}

let startnew = () => {
    client.connect(url.url, null, 'https://quip.com' , null , null);
}     
exports.sendMessage = sendMessage;
exports.addSection = addSection;
exports.addQuipContent = addQuipContent;

