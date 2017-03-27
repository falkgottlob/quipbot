"use strict";

var express = require('express'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    quipconnect = require('./modules/messenger'),
    session = require('express-session'),

    SF_CLIENT_ID = process.env.SFDC_CONSUMER,
    SF_CLIENT_SECRET = process.env.SFDC_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD,
    SF_WHERE = process.env.WHERE,

    app = express();
    
const pug = require('pug');    


app.set('port', process.env.PORT || 5000);




var store = new MongoDBStore(
      {
        uri: process.env.MONGODB_URI,
        collection: 'QuipBotSessions'
      });
 
    // Catch errors 
    store.on('error', function(error) {
      //assert.ifError(error);
      //assert.ok(false);
      console.log(error);
    });


app.get('/', function (req, res) {
res.render('home', { title: 'Hey', message: 'Hello there!' })
 // res.send('Hello World! ' + JSON.stringify(req.session))
})

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


