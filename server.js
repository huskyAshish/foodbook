var express = require('express');
var app = express();

var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

app.use(session({
    secret: 'this is the secret',//process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connectionString = "mongodb://localhost/cs5610-project";

if(process.env.HEROKU_MONGODB_DB_PASSWORD) {
    connectionString = "mongodb://" +
        process.env.HEROKU_MONGODB_DB_USERNAME + ":" +
        process.env.HEROKU_MONGODB_DB_PASSWORD + "@" +
        process.env.HEROKU_MONGODB_DB_HOST + ':' +
        process.env.HEROKU_MONGODB_DB_PORT + '/' +
        process.env.HEROKU_APP_NAME;
}

var mongoose = require("mongoose");
mongoose.connect(connectionString);

app.use(express.static(__dirname + '/public/foodbook-client'));

require ("./foodbook-server/app")(app);

app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), app.get('ipaddress'));
