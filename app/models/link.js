var db = require('../config');
var crypto = require('crypto');


var Link = db.LinkModel;

var shorten = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

db.linkSchema.pre('save', function(next){
  //do stuff
  var code = shorten(this.url);
  this.code = code;
  next();
});

  
module.exports = Link;
