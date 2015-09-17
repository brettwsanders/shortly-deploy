var request = require('request');
// var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
// var bookshelf = db.bookshelf;
var User = db.User;
var LinkModel = db.LinkModel;
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

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
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  })
};



exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  //TODO: hash password before storage
  // password = bcrypt(password,)
  console.log('orig password: ', password);
  // hashedPW = hashPassword(password); 
  // console.log('hashed pw: ', hashedPW);
  var newUser = new User({username: username, password: password});
  var query = User.findOne({username: username}, function(err, user){
    if (err) return console.error(err);
    console.log('User: ', user)
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
  
    
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });

exports.navToLink = function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};


// var hashPassword = function(password){
//   console.log('in hashPassword function');
//   var cipher = Promise.promisify(bcrypt.hash);

//   return cipher(password, null, null).then(function(err, hash){
//     if(err) return console.error(err);
//     console.log('hash:', typeof hash);
//     return hash;
//   });
// };

var hashPassword = function(password){
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log('hash is ', hash);
  });
};