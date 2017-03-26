"use strict";

var express = require('express'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    quipconnect = require('./modules/messenger'),
	session = require('express-session');
	MongoDBStore = require('connect-mongodb-session')(session),

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
