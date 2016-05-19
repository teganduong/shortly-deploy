var db = require('../config');
var crypto = require('crypto');

var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  url: { type: String, required: true, unique: true }, 
  baseUrl: { type: String, unique: true },
  code: { type: String, unique: true },
  title: String, 
  visits: Number
});

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  this.code = shasum.digest('hex').slice(0, 5);
  this.visits = 0;
  next();
});

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;

