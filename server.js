"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    quipconnect = require('./modules/messenger'),
   
    app = express();


app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
