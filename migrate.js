/**
 * Created by thram on 20/01/16.
 */
module.exports = function (callback) {
  var _     = require('lodash');
  var db    = require('./models');
  var Umzug = require('umzug');
  var umzug = new Umzug({
    storage: 'sequelize',

    storageOptions: {
      sequelize: db.sequelize
    },

    migrations: {
      params : [db.sequelize.getQueryInterface(), db.sequelize.constructor, function () {
        throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
      }],
      path   : './migrations',
      pattern: /\.js$/
    }
  });

  umzug.up().then(function (migrations) {
    console.log('Migrations Completed!');
    console.log(_.map(migrations, 'file'));

    callback(migrations);
    // "migrations" will be an Array with the names of the
    // executed migrations.
  });
};