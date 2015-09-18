var request = require('request');
// var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var User = db.User;
var LinkModel = db.LinkModel;


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  LinkModel.find({}).exec(function(err, links){
    res.send(200, links);
  });
};



exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  LinkModel.findOne({url: uri}).exec(function(err, link) {
    if(link){
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        } 
        var newLink = new LinkModel({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0  
        });
      
        newLink.save(function(err,link){
          if (err){
            res.send(500);
          } else {
            res.send(200, link);
          }
        });

      });

      }
    });

};




exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({username: username}).exec(function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(err, match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          console.log('Wrong password, try again!');
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var newUser = new User({username: username, password: password});
  var query = User.findOne({username: username}, function(err, user){
    if (err) return console.error(err);
    if (user) { //user already in db
      console.log('That username is already taken');
      res.redirect('/signup');
    } else {
      newUser.save(function(err, user){ //insert into db
        if (err) return console.error(err);
        util.createSession(req, res, newUser);
      });
    }
  });
      
    
};
  
    


exports.navToLink = function(req, res) {
  LinkModel.findOne({ code: req.params[0] }).exec(function(err, link){
    if(!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link){
        res.redirect(link.url);
        return;
      });
    }

  });
};

 


