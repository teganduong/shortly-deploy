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
  // shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  this.visits = 0;
  next();
});

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });