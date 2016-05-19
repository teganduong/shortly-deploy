var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hash: String

});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('attemptedPassword', attemptedPassword);
  console.log('this.pw', this.password);
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  var pw = this.password;
  return cipher(pw, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      var query = {password: pw };
      this.update(query, { password: hash });
      // this.hash = hash;
      // this.save(function(err) {
      //   if (err) {
      //     console.log('error');
      //   }
      // });
      // this.save();
      // console.log('this.password', this.password, this.username);
    });
};

userSchema.pre('save', function(next) {
  this.hashPassword();
  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;


