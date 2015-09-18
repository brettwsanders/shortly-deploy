var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');

var handler = require('./lib/request-handler');
var mongohandler = require('./lib/request-handler-mongo');

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

app.get('/', util.checkUser, mongohandler.renderIndex);
app.get('/create', util.checkUser, mongohandler.renderIndex);

app.get('/links', util.checkUser, mongohandler.fetchLinks);
app.post('/links', mongohandler.saveLink);

app.get('/login', mongohandler.loginUserForm);
app.post('/login', mongohandler.loginUser);
app.get('/logout', mongohandler.logoutUser);

app.get('/signup', mongohandler.signupUserForm);
app.post('/signup', mongohandler.signupUser);

app.get('/*', mongohandler.navToLink);

module.exports = app;
