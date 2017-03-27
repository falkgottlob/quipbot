"use strict";

var express = require('express'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    quipconnect = require('./modules/messenger'),
    session = require('express-session'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),

    SF_CLIENT_ID = process.env.SFDC_CONSUMER,
    SF_CLIENT_SECRET = process.env.SFDC_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD,
    SF_WHERE = process.env.WHERE,

    app = express();
    
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'somesecret', key: 'sid' }));  


app.set('port', process.env.PORT || 5000);

app.get('/', function(req, res){
  res.render('index', {
    title: 'nforce test app'
  });
});


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


