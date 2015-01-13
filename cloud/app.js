var express = require('express');
var expressLayouts = require('cloud/express-layouts');
var meme = require('cloud/routes/meme');

var app = express();

// Configure the app
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// Setup your keys here (TODO: replace with dummy values before publicizing)
app.locals.parseApplicationId = '0cVoHgM9zWOQaSuchoDBEWtAgeRzAReQSc0CaF7J';
app.locals.parseJavascriptKey = 'xX9YPFsCBGJMN0G270mnzehuaP6T6MYJEoYUemOI';
app.locals.facebookApplicationId = '700571116707231';

// Setup underscore to be available in all templates
app.locals._ = require('underscore');

// Define all the endpoints
app.get('/', meme.new);
app.post('/meme', meme.create);
app.get('/meme/latest', meme.index);
app.get('/meme/:objectId', meme.show);
app.get('/popular', meme.popular);

app.listen(); 
