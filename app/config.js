//////////////////////////
//sqlite
//////////////////////////

var Bookshelf = require('bookshelf');
var path = require('path');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: process.env.IP || '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'shortlydb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('base_url', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db; // uncomment for sqlite

//////////////////////////////////////////

//////////////////////////
//MongoDB
//////////////////////////

var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
mongoose.connect('mongodb://localhost/shortly');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var userSchema = new Schema({
  username: String,
  password: String
});

var linkSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
})

userSchema.pre('save', function(next){
  //do stuff
  var cipher = Promise.promisify(bcrypt.hash);
  var user = this;
  return cipher(user.password, null, null).bind(user)
    .then(function(hash){
      user.password = hash;
      next();
    // .then(function(hash) {
    })
});

var User = mongoose.model('User', userSchema);
var LinkModel = mongoose.model('Link', linkSchema);

module.exports.User = User;
module.exports.LinkModel = LinkModel;
 


// var insertDocument = function(db, callback) {
//   db.collection('users').insertOne({}, function(err, result){
//     assert.equal(err, null);
//     console.log('');
//     callback(result);
//   });
// };
