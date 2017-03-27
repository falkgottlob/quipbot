"use strict";

var express = require('express'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    quipconnect = require('./modules/messenger'),
    session = require('express-session'),
    jsforce = require('jsforce'),
    MongoDBStore = require('connect-mongodb-session')(session),
    
    SF_CLIENT_ID = process.env.SFDC_CONSUMER,
    SF_CLIENT_SECRET = process.env.SFDC_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD,
    SF_WHERE = process.env.WHERE,

    app = express();
    
const pug = require('pug');    


app.set('port', process.env.PORT || 5000);



app.set('views', './views');


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

app.set('views', './views');
app.set('view engine', 'pug');
//no idea if this is right, seems to work.
app.use('/favicon.ico', express.static(__dirname + '/favicon.ico'));
app.use('/assets', express.static(__dirname + '/node_modules/@salesforce-ux/design-system/assets'));

app.use(require('express-session')({
      secret: 'This is a secret',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
      },
      store: store,
      // Boilerplate options, see: 
      // * https://www.npmjs.com/package/express-session#resave 
      // * https://www.npmjs.com/package/express-session#saveuninitialized 
      resave: true,
      saveUninitialized: true
    }));

app.get('/', function (req, res) {
res.render('home', { title: 'Hey', message: 'Hello there!' })
 // res.send('Hello World! ' + JSON.stringify(req.session))
})

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


//
// Salesforce connection
//
var sfcon;

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId : process.env.SFDC_CONSUMER,
  clientSecret : process.env.SFDC_SECRET,
  redirectUri : process.env.WHERE + '/oauth2/callback'
});
//
// Get authz url and redirect to it.
//
app.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'full refresh_token offline_access' }));
});


app.get('/oauth2/callback', function(req, res) {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { res.send('Error Authenticating, you didnt try org62 did you?'); return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    //req.session.sfdcconn = conn;
    req.session.userinfo = userInfo;
    req.session.sfdc_accessToken = conn.accessToken;
    req.session.sfdc_refreshToken = conn.refreshToken;
    req.session.sfdc_instanceUrl = conn.instanceUrl;
    sfcon = conn;
    res.send('connected to ' + conn.instanceUrl);
    console.log('Salesforce server connected to ' + conn.instanceUrl);
    // ...
  });
});