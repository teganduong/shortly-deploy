var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

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
  
  Link.find({}, function(err, links) {
    if (err) {
      console.log('error in fetching links');
    } else {
      res.status(200).send(links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ 'url': uri }).exec(function(err, link) {
    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading url');
          return res.sendStatus(404);
        } else {
          var newLink = new Link({
            url: uri,
            title: title,
            baseUrl: 'http://127.0.0.1:4568'
          });
          newLink.save(function(err) {
            if (err) {
              console.log('new link not saved');
            } else {
              console.log('link saved');
              res.status(200).send(newLink);
            }
          });
        }
      });
    } 
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  
  User.findOne({ username: username }).exec(function(err, user) {
    console.log('user', user);
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        console.log('match', match);
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user) {
    if (!user) {
      var newUser = new User({
        username: username, 
        password: password
      });
      newUser.save(function(err) {
        if (!err) {
          util.createSession(req, res, newUser);
        } else {
          console.log('new user not saved');
        }
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  console.log('params', req.params[0]);
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (!link) {
      console.log('did not find link');
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save(function(err) {
        if (!err) {
          console.log('link', link.url);
          res.redirect(link.url);
        } else {
          console.log('Error in redirecting to url!');
        }
      });
    }
  });

};